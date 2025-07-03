import React, { useState, useEffect } from 'react';

// Helper functions for formatting
const unformatIDR = (val) => (val ? String(val).replace(/\./g, '') : '');
const formatIDRInput = (val) => {
    const numStr = unformatIDR(val);
    if (numStr === '' || isNaN(Number(numStr))) return '';
    return new Intl.NumberFormat('id-ID').format(numStr);
};
const formatIDRCurrency = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const DanaPensiun = ({ onSaveTarget }) => {
    // --- State Management ---
    const [namaTarget, setNamaTarget] = useState('Dana Pensiun');
    const [inputs, setInputs] = useState({
        usiaSekarang: '30',
        usiaPensiun: '55',
        durasiPensiun: '30',
        pengeluaranBulanan: '8.000.000',
        saldoAwal: '50.000.000',
        iuranBulanan: '2.000.000',
        asumsiInflasi: '4.0',
        asumsiImbalHasil: '8.0',
    });

    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Allow numeric formatting for currency fields
        if (['pengeluaranBulanan', 'saldoAwal', 'iuranBulanan'].includes(id)) {
             // Format the value with dots for readability
            const formattedValue = formatIDRInput(value);
            setInputs(prev => ({ ...prev, [id]: formattedValue }));
        } else {
            setInputs(prev => ({ ...prev, [id]: value }));
        }
    };
    
    const parseNumericValue = (value, isCurrency = false) => {
        if (typeof value !== 'string') {
            return parseFloat(value) || 0;
        }
        
        let cleanValue = value;
        if (isCurrency) {
            // For currency, remove thousand separators (.)
            cleanValue = unformatIDR(value);
        } else {
            // For percentages, replace comma with dot for decimal
            cleanValue = value.replace(',', '.');
        }
        
        return parseFloat(cleanValue) || 0;
    };

    const calculateAndDisplay = () => {
        setLoading(true);
        setError('');
        setResults(null);

        // --- Get User Inputs & Parse ---
        const parsedInputs = {
            usiaSekarang: parseInt(inputs.usiaSekarang, 10),
            usiaPensiun: parseInt(inputs.usiaPensiun, 10),
            durasiPensiun: parseInt(inputs.durasiPensiun, 10),
            pengeluaranBulanan: parseNumericValue(inputs.pengeluaranBulanan, true),
            saldoAwal: parseNumericValue(inputs.saldoAwal, true),
            iuranBulanan: parseNumericValue(inputs.iuranBulanan, true),
            inflasi: parseNumericValue(inputs.asumsiInflasi) / 100,
            imbalHasil: parseNumericValue(inputs.asumsiImbalHasil) / 100,
        };

        // --- Validation ---
        if (parsedInputs.usiaPensiun <= parsedInputs.usiaSekarang) {
            setError("Usia pensiun harus lebih besar dari usia sekarang.");
            setLoading(false);
            return;
        }
        if (parsedInputs.durasiPensiun <= 0) {
            setError("Durasi pensiun harus lebih dari 0 tahun.");
            setLoading(false);
            return;
        }
        if (Object.values(parsedInputs).some(val => isNaN(val) || val < 0)) {
            setError("Harap isi semua kolom dengan angka positif yang valid.");
            setLoading(false);
            return;
        }

        // --- Core Calculations ---
        const periodeTahun = parsedInputs.usiaPensiun - parsedInputs.usiaSekarang;
        const periodeBulan = periodeTahun * 12;

        const fvSaldoAwal = parsedInputs.saldoAwal * Math.pow((1 + parsedInputs.imbalHasil), periodeTahun);

        const imbalHasilBulanan = parsedInputs.imbalHasil / 12;
        const fvIuranBulanan = parsedInputs.iuranBulanan * ((Math.pow(1 + imbalHasilBulanan, periodeBulan) - 1) / imbalHasilBulanan);

        const totalProyeksiDana = fvSaldoAwal + fvIuranBulanan;

        const pengeluaranTahunanSekarang = parsedInputs.pengeluaranBulanan * 12;
        const targetPengeluaranTahunanPensiun = pengeluaranTahunanSekarang * Math.pow((1 + parsedInputs.inflasi), periodeTahun);
        
        const realReturnRate = (1 + parsedInputs.imbalHasil) / (1 + parsedInputs.inflasi) - 1;
        let targetDanaDibutuhkan;

        if (realReturnRate !== 0) {
            targetDanaDibutuhkan = targetPengeluaranTahunanPensiun * ((1 - Math.pow(1 + realReturnRate, -parsedInputs.durasiPensiun)) / realReturnRate);
        } else {
            targetDanaDibutuhkan = targetPengeluaranTahunanPensiun * parsedInputs.durasiPensiun;
        }

        const selisih = totalProyeksiDana - targetDanaDibutuhkan;
        
        setResults({
            totalProyeksiDana,
            targetDanaDibutuhkan,
            selisih,
            durasiPensiun: parsedInputs.durasiPensiun,
            imbalHasil: parsedInputs.imbalHasil,
            periodeBulan,
        });
        setLoading(false);
    };

    const handleSimpanTarget = () => {
        if (!results || !onSaveTarget) return;

        const targetData = {
            nama: namaTarget,
            target: results.targetDanaDibutuhkan,
            terkumpul: parseNumericValue(inputs.saldoAwal, true),
            jangkaWaktu: (parseInt(inputs.usiaPensiun, 10) - parseInt(inputs.usiaSekarang, 10)) * 12,
        };
        
        onSaveTarget(targetData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        calculateAndDisplay();
    };
    


    // --- Render Logic ---
    const renderAdvice = () => {
        if (!results) return null;
        const { selisih, imbalHasil, periodeBulan } = results;

        if (selisih < 0) {
            const imbalHasilBulanan = imbalHasil / 12;
            const fvFactor = ((Math.pow(1 + imbalHasilBulanan, periodeBulan) - 1) / imbalHasilBulanan);
            const tambahanInvestasiBulanan = fvFactor > 0 ? Math.abs(selisih) / fvFactor : 0;
            
            return (
                <p>
                    Untuk menutup kekurangan tersebut, Anda disarankan untuk menambah investasi bulanan sebesar <strong>{formatIDRCurrency(tambahanInvestasiBulanan)}</strong>. Alternatif lain adalah meningkatkan imbal hasil investasi atau menunda usia pensiun.
                </p>
            );
        } else {
            return <p>Anda berada di jalur yang tepat! Pertahankan disiplin investasi Anda. Pertimbangkan untuk diversifikasi aset untuk menjaga nilai investasi dari risiko pasar.</p>;
        }
    };

    const renderSummary = () => {
        if (!results) return null;
        const { selisih } = results;

        if (selisih >= 0) {
            return (
                <div className="border-l-4 border-green-500 p-4 rounded-lg bg-slate-50">
                    <p className="text-lg font-semibold text-green-800">✅ Selamat! Proyeksi Anda Tercapai</p>
                    <p className="text-sm text-gray-600 mt-1">Anda memiliki potensi surplus dana sebesar {formatIDRCurrency(selisih)}.</p>
                </div>
            );
        } else {
            return (
                <div className="border-l-4 border-red-500 p-4 rounded-lg bg-slate-50">
                    <p className="text-lg font-semibold text-red-800">⚠️ Perhatian! Proyeksi Anda Belum Tercapai</p>
                    <p className="text-sm text-gray-600 mt-1">Anda memiliki potensi kekurangan dana sebesar {formatIDRCurrency(Math.abs(selisih))}.</p>
                </div>
            );
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-amber-600">Kalkulator Dana Pensiun</h2>
                <p className="mt-2 text-md text-gray-600">Rencanakan masa depan finansial Anda dengan proyeksi yang akurat.</p>
            </header>

            <div className="max-w-3xl mx-auto">
                {/* Input Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-2">
                        <label htmlFor="namaTarget" className="block text-sm font-medium text-gray-700">Nama Target</label>
                        <input type="text" id="namaTarget" value={namaTarget} onChange={(e) => setNamaTarget(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" placeholder="Contoh: Pensiun Nyaman" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-700">Data Diri & Target</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="usiaSekarang" className="block text-sm font-medium text-gray-700">Usia Anda Saat Ini (Tahun)</label>
                                <input type="number" id="usiaSekarang" value={inputs.usiaSekarang} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                            </div>
                            <div>
                                <label htmlFor="usiaPensiun" className="block text-sm font-medium text-gray-700">Target Usia Pensiun</label>
                                <input type="number" id="usiaPensiun" value={inputs.usiaPensiun} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                            </div>
                            <div>
                                <label htmlFor="durasiPensiun" className="block text-sm font-medium text-gray-700">Estimasi Durasi Pensiun (Tahun)</label>
                                <input type="number" id="durasiPensiun" value={inputs.durasiPensiun} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mt-6 mb-4 border-b pb-2 text-gray-700">Data Finansial</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="pengeluaranBulanan" className="block text-sm font-medium text-gray-700">Pengeluaran Bulanan (Rp)</label>
                                <input type="text" id="pengeluaranBulanan" value={inputs.pengeluaranBulanan} onChange={handleInputChange} inputMode="numeric" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                            </div>
                            <div>
                                <label htmlFor="saldoAwal" className="block text-sm font-medium text-gray-700">Saldo Investasi Awal (Rp)</label>
                                <input type="text" id="saldoAwal" value={inputs.saldoAwal} onChange={handleInputChange} inputMode="numeric" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                            </div>
                            <div>
                                <label htmlFor="iuranBulanan" className="block text-sm font-medium text-gray-700">Iuran Rutin per Bulan (Rp)</label>
                                <input type="text" id="iuranBulanan" value={inputs.iuranBulanan} onChange={handleInputChange} inputMode="numeric" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mt-6 mb-4 border-b pb-2 text-gray-700">Asumsi Ekonomi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="asumsiInflasi" className="block text-sm font-medium text-gray-700">Asumsi Inflasi per Tahun (%)</label>
                                <input type="number" id="asumsiInflasi" step="0.1" value={inputs.asumsiInflasi} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                            </div>
                            <div>
                                <label htmlFor="asumsiImbalHasil" className="block text-sm font-medium text-gray-700">Imbal Hasil Investasi per Tahun (%)</label>
                                <input type="number" id="asumsiImbalHasil" step="0.1" value={inputs.asumsiImbalHasil} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" className="mt-8 w-full bg-amber-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-300">
                        Hitung
                    </button>
                </form>

                {/* Results Display */}
                <div className="mt-10">
                    {loading && (
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Menghitung proyeksi...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {!loading && !error && results && (
                         <div className="border-t-4 border-amber-500 rounded-lg bg-white shadow-lg p-6 mt-8 animate-fade-in">
                            <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Hasil Analisis Dana Pensiun</h3>
                            <div className="space-y-6">
                                <div>{renderSummary()}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-l-4 border-blue-500 bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800 font-medium">Proyeksi Dana Terkumpul</p>
                                        <p className="text-2xl font-bold text-blue-700">{formatIDRCurrency(results.totalProyeksiDana)}</p>
                                        <p className="text-xs text-gray-500 mt-1">Estimasi total dana Anda di usia pensiun.</p>
                                    </div>
                                    <div className="border-l-4 border-red-500 bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-red-800 font-medium">Target Dana Dibutuhkan</p>
                                        <p className="text-2xl font-bold text-red-700">{formatIDRCurrency(results.targetDanaDibutuhkan)}</p>
                                        <p className="text-xs text-gray-500 mt-1">Untuk kebutuhan hidup selama {results.durasiPensiun} tahun masa pensiun.</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-700">Rekomendasi</h4>
                                    <div className="mt-2 text-sm p-4 bg-amber-50 text-amber-900 rounded-lg">
                                        {renderAdvice()}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSimpanTarget}
                                    className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                    Simpan sebagai Target Finansial
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DanaPensiun;
