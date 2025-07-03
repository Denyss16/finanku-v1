import React, { useState } from 'react';
import { formatCurrency, formatNumberInput, parseNumberInput } from '../utils/formatters';

const InvestasiMasaDepan = ({ onSaveTarget }) => {
  const [namaTarget, setNamaTarget] = useState('Investasi Masa Depan');
  const [targetDana, setTargetDana] = useState(500000000);
  const [modalAwal, setModalAwal] = useState(10000000);
  const [jangkaWaktu, setJangkaWaktu] = useState(10);
  const [returnTahunan, setReturnTahunan] = useState(8);
  const [hasil, setHasil] = useState(null);

  const handleTargetDanaChange = (e) => setTargetDana(parseNumberInput(e.target.value));
  const handleModalAwalChange = (e) => setModalAwal(parseNumberInput(e.target.value));

  const hitungInvestasi = () => {
    const r = returnTahunan / 100 / 12; // monthly return rate
    const n = jangkaWaktu * 12; // total number of months

    // Future value of initial investment
    const fvModalAwal = modalAwal * Math.pow(1 + r, n);
    
    // The remaining amount needed from monthly investments
    const kekuranganDana = targetDana - fvModalAwal;

    if (kekuranganDana <= 0) {
        setHasil({
            investasiBulanan: 0,
            totalTarget: targetDana,
            kekuranganDana: kekuranganDana,
        });
        return;
    }

    // Calculate required monthly investment using future value of a series formula
    // PMT = (FV * r) / ( (1+r)^n - 1 )
    const investasiBulanan = (kekuranganDana * r) / (Math.pow(1 + r, n) - 1);

    setHasil({
      investasiBulanan,
      totalTarget: targetDana,
      kekuranganDana: kekuranganDana > 0 ? kekuranganDana : 0,
    });
  };

  const handleSave = () => {
    if (!hasil || hasil.investasiBulanan <= 0) {
      alert("Tidak ada target untuk disimpan atau target sudah terpenuhi.");
      return;
    }

    const totalBulan = jangkaWaktu * 12;

    const targetData = {
      nama: namaTarget,
      target: hasil.totalTarget,
      terkumpul: modalAwal, // Menyertakan modal awal sebagai jumlah terkumpul
      jangkaWaktu: jangkaWaktu, // Menggunakan jangka waktu dalam tahun
    };

    onSaveTarget(targetData);
  };

  const resetForm = () => {
    setTargetDana(500000000);
    setModalAwal(10000000);
    setJangkaWaktu(10);
    setReturnTahunan(8);
    setHasil(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Kalkulator Investasi</h2>
      <p className="mb-6 text-gray-600">Hitung berapa yang perlu Anda investasikan setiap bulan untuk mencapai target finansial Anda di masa depan.</p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Target</label>
        <input type="text" value={namaTarget} onChange={(e) => setNamaTarget(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Contoh: Dana Pensiun, Rumah Impian" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Dana yang Diinginkan</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp</span>
            <input type="text" value={formatNumberInput(targetDana)} onChange={handleTargetDanaChange} className="w-full pl-10 pr-4 py-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modal Awal yang Dimiliki</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp</span>
            <input type="text" value={formatNumberInput(modalAwal)} onChange={handleModalAwalChange} className="w-full pl-10 pr-4 py-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jangka Waktu (tahun)</label>
          <input type="number" value={jangkaWaktu} onChange={(e) => setJangkaWaktu(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asumsi Return Investasi (%/tahun)</label>
          <input type="number" value={returnTahunan} onChange={(e) => setReturnTahunan(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button onClick={hitungInvestasi} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Hitung</button>
        <button onClick={resetForm} className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Reset</button>
      </div>

      {hasil && (
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg animate-fade-in">
          <h3 className="text-lg font-bold text-blue-800">Hasil Perhitungan</h3>
          <div className="mt-4 space-y-3">
            <div className="text-center pt-2">
              <p className="text-gray-700">Untuk mencapai target {formatCurrency(hasil.totalTarget)}, Anda perlu berinvestasi sebesar:</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(hasil.investasiBulanan)} / bulan</p>
            </div>
             {hasil.kekuranganDana <= 0 && (
                <p className="text-center text-green-600 font-semibold mt-2">Selamat! Modal awal Anda sudah cukup untuk mencapai target tanpa investasi bulanan.</p>
            )}
          </div>
          <button 
            onClick={handleSave} 
            disabled={hasil.investasiBulanan <= 0}
            className="w-full mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Simpan sebagai Target Finansial
          </button>
        </div>
      )}
    </div>
  );
};

export default InvestasiMasaDepan;
