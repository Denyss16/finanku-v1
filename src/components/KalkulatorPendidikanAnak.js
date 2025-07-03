import React, { useState } from 'react';

// --- KONFIGURASI JENJANG PENDIDIKAN ---
const EDUCATION_LEVELS = {
    sd: { name: 'SD', entryAge: 6, duration: 6 },
    smp: { name: 'SMP', entryAge: 12, duration: 3 },
    sma: { name: 'SMA', entryAge: 15, duration: 3 },
    s1: { name: 'S1', entryAge: 18, duration: 4 },
};

// --- FUNGSI BANTU ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const formatNumberForInput = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
};

const KalkulatorPendidikanAnak = ({ onSaveTarget }) => {
    const [formData, setFormData] = useState({
        birthDate: '',
        currentSavings: '',
        inflationRate: '10',
        levels: {
            sd: { entry: '', yearly: '' },
            smp: { entry: '', yearly: '' },
            sma: { entry: '', yearly: '' },
            s1: { entry: '', yearly: '' },
        }
    });
    const [results, setResults] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCurrencyChange = (e) => {
        const { name } = e.target;
        const rawValue = e.target.value.replace(/\D/g, ''); // Hanya ambil angka

        if (name.includes('.')) {
            const [level, type] = name.split('.');
            setFormData(prev => ({
                ...prev,
                levels: {
                    ...prev.levels,
                    [level]: { ...prev.levels[level], [type]: rawValue }
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: rawValue }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.birthDate) {
            alert('Mohon isi tanggal lahir anak terlebih dahulu.');
            return;
        }
        const calculationResults = calculateAllLevels(formData);
        setResults(calculationResults);
    };

    const handleReset = () => {
        setFormData({
            birthDate: '',
            currentSavings: '',
            inflationRate: '10',
            levels: {
                sd: { entry: '', yearly: '' },
                smp: { entry: '', yearly: '' },
                sma: { entry: '', yearly: '' },
                s1: { entry: '', yearly: '' },
            }
        });
        setResults(null);
    };

    const handleSaveTarget = () => {
        if (!results || !onSaveTarget) return;

        const totalShortfall = results.summary.totalShortfall;
        if (totalShortfall <= 0) {
            alert("Selamat! Dana Anda sudah mencukupi. Tidak ada target yang perlu disimpan.");
            return;
        }

        const s1Result = results.resultsByLevel.s1;
        const jangkaWaktuTahun = s1Result ? Math.ceil(s1Result.yearsToEntry + EDUCATION_LEVELS.s1.duration) : 10;

        const targetData = {
            nama: 'Pendidikan Anak',
            target: totalShortfall,
            terkumpul: parseFloat(formData.currentSavings) || 0,
            jangkaWaktu: jangkaWaktuTahun, // Dalam tahun
        };

        onSaveTarget(targetData);
    };

    const calculateAllLevels = (data) => {
        const today = new Date();
        const birth = new Date(data.birthDate);
        const ageInMilliseconds = today.getTime() - birth.getTime();
        const childAgeNow = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        const inflationRate = parseFloat(data.inflationRate) / 100 || 0;

        let remainingSavings = parseFloat(data.currentSavings) || 0;
        const resultsByLevel = {};
        let cumulativeCost = 0;

        for (const levelKey in EDUCATION_LEVELS) {
            const levelConfig = EDUCATION_LEVELS[levelKey];
            const levelCosts = data.levels[levelKey];
            const yearsToEntry = Math.max(0, levelConfig.entryAge - childAgeNow);
            const fvEntryFee = (parseFloat(levelCosts.entry) || 0) * Math.pow(1 + inflationRate, yearsToEntry);
            let totalFvYearlyFee = 0;
            for (let i = 0; i < levelConfig.duration; i++) {
                const yearsForThisFee = yearsToEntry + i;
                totalFvYearlyFee += (parseFloat(levelCosts.yearly) || 0) * Math.pow(1 + inflationRate, yearsForThisFee);
            }
            const totalTargetFund = fvEntryFee + totalFvYearlyFee;
            cumulativeCost += totalTargetFund;
            
            const shortfall = Math.max(0, totalTargetFund - remainingSavings);
            const surplus = Math.max(0, remainingSavings - totalTargetFund);
            remainingSavings = surplus;
            
            const monthlySavingsTarget = yearsToEntry > 0 ? shortfall / (yearsToEntry * 12) : 0;

            resultsByLevel[levelKey] = {
                ...levelConfig,
                yearsToEntry: yearsToEntry,
                totalTargetFund: totalTargetFund,
                shortfall: shortfall,
                monthlySavingsTarget: monthlySavingsTarget
            };
        }

        const summary = {
            totalCumulativeCost: cumulativeCost,
            currentSavings: parseFloat(data.currentSavings) || 0,
            totalShortfall: Math.max(0, cumulativeCost - (parseFloat(data.currentSavings) || 0))
        };

        return { 
            resultsByLevel: resultsByLevel, 
            summary: summary 
        };
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} onReset={handleReset}>
                {/* Informasi & Asumsi Section */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        Informasi & Asumsi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Tanggal Lahir Anak</label>
                            <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="currentSavings" className="block text-sm font-medium text-gray-700">Tabungan Pendidikan Saat Ini (Rp)</label>
                            <input type="text" inputMode="numeric" id="currentSavings" name="currentSavings" value={formatNumberForInput(formData.currentSavings)} onChange={handleCurrencyChange} placeholder="Contoh: 10000000" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700">Asumsi Inflasi (% per Tahun)</label>
                            <input type="number" id="inflationRate" name="inflationRate" value={formData.inflationRate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                        </div>
                    </div>
                </div>

                {/* Estimasi Biaya Section */}
                <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Estimasi Biaya Pendidikan Saat Ini (per Jenjang)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.keys(EDUCATION_LEVELS).map(levelKey => (
                            <div key={levelKey} className="p-4 bg-white rounded-lg border">
                                <h4 className="font-semibold text-center text-gray-700 mb-3">{EDUCATION_LEVELS[levelKey].name}</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor={`${levelKey}-entry`} className="block text-xs font-medium text-gray-500">Uang Pangkal</label>
                                        <input type="text" inputMode="numeric" id={`${levelKey}-entry`} name={`${levelKey}.entry`} value={formatNumberForInput(formData.levels[levelKey].entry)} onChange={handleCurrencyChange} placeholder="0" className="mt-1 w-full p-2 text-sm border-gray-200 rounded-md text-right" />
                                    </div>
                                    <div>
                                        <label htmlFor={`${levelKey}-yearly`} className="block text-xs font-medium text-gray-500">Biaya Tahunan</label>
                                        <input type="text" inputMode="numeric" id={`${levelKey}-yearly`} name={`${levelKey}.yearly`} value={formatNumberForInput(formData.levels[levelKey].yearly)} onChange={handleCurrencyChange} placeholder="0" className="mt-1 w-full p-2 text-sm border-gray-200 rounded-md text-right" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md duration-300">
                        Hitung
                    </button>
                    <button type="reset" className="w-full bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300">
                        Ulangi
                    </button>
                </div>
            </form>

            {/* Results Section */}
            {results && (
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-lg">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Hasil Perhitungan</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {results.resultsByLevel && Object.values(results.resultsByLevel).map(r => {
                                    if (!r.name || r.totalTargetFund <= 0) return null; // Guard against summary object
                                    return (
                                        <div key={r.name} className="bg-white p-4 rounded-lg border border-gray-200">
                                            <h3 className="text-xl font-bold text-purple-600">{r.name}</h3>
                                            <p className="text-sm text-gray-500 mb-4">Anak Anda akan masuk {r.name} dalam <strong>{r.yearsToEntry.toFixed(1)} tahun</strong> lagi.</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="bg-gray-100 p-3 rounded-md">
                                                    <span className="block text-xs text-gray-500">Total Kebutuhan Dana</span>
                                                    <strong className="text-lg text-gray-800">{formatCurrency(r.totalTargetFund)}</strong>
                                                </div>
                                                <div className="bg-gray-100 p-3 rounded-md">
                                                    <span className="block text-xs text-gray-500">Kekurangan Dana</span>
                                                    <strong className="text-lg text-red-600">{formatCurrency(r.shortfall)}</strong>
                                                </div>
                                            </div>
                                            <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                                                <p className="text-sm text-indigo-800">🎯 Target Tabungan Bulanan untuk jenjang ini:</p>
                                                <p className="text-2xl font-bold text-indigo-900">{formatCurrency(r.monthlySavingsTarget)} / bulan</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                 <div className="bg-gray-800 text-white rounded-lg p-6 mt-6">
                                    <h3 className="text-xl font-bold mb-4">Ringkasan Total Perencanaan</h3>
                                    <div className="space-y-3 text-md">
                                        <div className="flex justify-between"><span>Total Estimasi Biaya (SD - S1)</span><span className="font-semibold">{formatCurrency(results.summary.totalCumulativeCost)}</span></div>
                                        <div className="flex justify-between"><span>Dana Anda Saat Ini</span><span className="font-semibold">{formatCurrency(results.summary.currentSavings)}</span></div>
                                        <hr className="border-gray-600"/>
                                        <div className="flex justify-between text-lg"><span className="font-bold">Total Kekurangan Dana</span><span className="font-bold text-yellow-400">{formatCurrency(results.summary.totalShortfall)}</span></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4">*Perhitungan target tabungan bulanan di atas dialokasikan secara bertahap untuk setiap jenjang pendidikan.</p>
                                </div>

                                 <button 
                                    onClick={handleSaveTarget}
                                    className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-400"
                                    disabled={!results || results.summary.totalShortfall <= 0}
                                >
                                    Simpan sebagai Target Finansial
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KalkulatorPendidikanAnak;
