import React, { useState } from "react";
import { formatCurrency, formatNumberInput, parseNumberInput } from '../utils/formatters';

const DanaDarurat = ({ onSaveTarget }) => {
  const [namaTarget, setNamaTarget] = useState('Dana Darurat');
  const [pengeluaran, setPengeluaran] = useState(0);
  const [status, setStatus] = useState("single");
  const [hasil, setHasil] = useState(null);
  const [jangkaWaktu, setJangkaWaktu] = useState(12);

  const handlePengeluaranChange = (e) => {
    const rawValue = e.target.value;
    const numberValue = parseNumberInput(rawValue);
    setPengeluaran(numberValue);
  };

  const hitungDanaDarurat = () => {
    let multiplier = 0;
    if (status === "single") {
      multiplier = 6;
    } else if (status === "menikah") {
      multiplier = 9;
    } else if (status === "menikah-anak") {
      multiplier = 12;
    }
    const total = pengeluaran * multiplier;
    setHasil({
      total,
      pengeluaran,
      status,
      multiplier
    });
  };

  const handleSimpanTarget = () => {
    if (!hasil || !onSaveTarget) return;

    const targetData = {
      nama: namaTarget,
      target: hasil.total,
      terkumpul: 0, // Dana darurat dimulai dari 0
      jangkaWaktu: jangkaWaktu,
    };
    
    onSaveTarget(targetData);
  };

  const resetForm = () => {
    setNamaTarget('Dana Darurat');
    setPengeluaran(0);
    setStatus("single");
    setHasil(null);
    setJangkaWaktu(12);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-cyan-600 mb-4">Kalkulator Dana Darurat</h2>
      <p className="mb-6 text-gray-600">Hitung estimasi dana darurat yang ideal untuk Anda berdasarkan pengeluaran bulanan dan status Anda saat ini.</p>
      
      <div className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Target</label>
          <input type="text" value={namaTarget} onChange={(e) => setNamaTarget(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Contoh: Dana Darurat Utama" />
        </div>
        <div>
          <label htmlFor="pengeluaran" className="block text-sm font-medium text-gray-700 mb-1">
            Pengeluaran Bulanan Anda
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp</span>
            <input
              type="text"
              id="pengeluaran"
              value={formatNumberInput(pengeluaran)}
              onChange={handlePengeluaranChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Contoh: 5.000.000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status Anda
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="single">Single / Belum Menikah</option>
            <option value="menikah">Menikah (Belum punya anak)</option>
            <option value="menikah-anak">Menikah (Sudah punya anak)</option>
          </select>
        </div>

        <div className="flex space-x-4 pt-2">
          <button
            onClick={hitungDanaDarurat}
            className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors shadow-sm"
          >
            Hitung
          </button>
          <button
            onClick={resetForm}
            className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

            {hasil && (
        <div className="mt-6 p-4 bg-cyan-50 border-l-4 border-cyan-500 rounded-r-lg animate-fade-in">
          <h3 className="text-lg font-bold text-cyan-800">Hasil Perhitungan</h3>
          <p className="mt-2 text-gray-700">
            Berdasarkan pengeluaran bulanan sebesar <strong className="font-semibold">{formatCurrency(hasil.pengeluaran)}</strong> dan status Anda, maka estimasi dana darurat yang Anda butuhkan adalah:
          </p>
          <p className="text-3xl font-bold text-cyan-600 mt-4 text-center">
            {formatCurrency(hasil.total)}
          </p>
                    <p className="text-sm text-gray-600 mt-2 text-center">
            (Perhitungan: {formatCurrency(hasil.pengeluaran)} x {hasil.multiplier} bulan)
          </p>

          {/* Bagian Perencanaan Bulanan */}
          <div className="mt-6 pt-6 border-t border-cyan-200">
            <h4 className="text-lg font-bold text-gray-800">Rencanakan Tabungan Anda</h4>
            <div className="mt-4">
                <label htmlFor="jangkaWaktu" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Tercapai Dalam (Bulan)
                </label>
                <input
                    type="number"
                    id="jangkaWaktu"
                    value={jangkaWaktu}
                    onChange={(e) => setJangkaWaktu(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    min="1"
                />
            </div>
            {jangkaWaktu > 0 && (
                <div className="mt-4 text-center bg-white p-4 rounded-lg">
                    <p className="text-gray-700">Anda perlu menabung sebesar:</p>
                    <p className="text-2xl font-bold text-cyan-600">{formatCurrency(hasil.total / jangkaWaktu)} / bulan</p>
                </div>
            )}
            <button
                onClick={handleSimpanTarget}
                className="mt-4 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
                Simpan sebagai Target Finansial
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default DanaDarurat;
