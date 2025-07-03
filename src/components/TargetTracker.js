import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

// Sub-komponen untuk menampilkan satu target dengan checklist bulanan
const MonthlyTargetCard = ({ target, onUpdateTarget }) => {
  // Gunakan jangkaWaktu dari target, atau default ke 12 jika tidak ada atau tidak valid.
  const jangkaWaktuBulan = parseInt(target.jangkaWaktu, 10) > 0 ? parseInt(target.jangkaWaktu, 10) : 12;
  const totalTarget = parseFloat(target.target) || 0;
  const terkumpul = parseFloat(target.terkumpul) || 0;

  if (totalTarget === 0) return null; // Jangan render jika tidak ada target

  const targetBulanan = totalTarget / jangkaWaktuBulan;
  const bulanSelesai = targetBulanan > 0 ? Math.floor(terkumpul / targetBulanan) : 0;

  const handleChecklistChange = (bulanIndex) => {
    // Pengguna hanya bisa menceklis/menghapus ceklis bulan terakhir yang berurutan
    if (bulanIndex !== bulanSelesai && bulanIndex !== bulanSelesai - 1) {
      return;
    }

    let jumlahTerkumpulBaru;
    // Jika menceklis bulan berikutnya
    if (bulanIndex === bulanSelesai) {
      jumlahTerkumpulBaru = (bulanIndex + 1) * targetBulanan;
    } 
    // Jika menghapus ceklis bulan terakhir
    else {
      jumlahTerkumpulBaru = bulanIndex * targetBulanan;
    }
    
    // Pastikan tidak melebihi total target
    if (jumlahTerkumpulBaru > totalTarget) {
        jumlahTerkumpulBaru = totalTarget;
    }

    const updatedTarget = { ...target, terkumpul: jumlahTerkumpulBaru };
    onUpdateTarget(updatedTarget);
  };
  
  const progressPercentage = totalTarget > 0 ? (terkumpul / totalTarget) * 100 : 0;

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
      <h4 className="text-xl font-bold text-blue-600 mb-4">{target.nama}</h4>
      
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-slate-600">Terkumpul: {formatCurrency(terkumpul)}</span>
            <span className="text-slate-800 font-bold">Target: {formatCurrency(totalTarget)}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}
            ></div>
        </div>
        <p className="text-right text-sm font-semibold text-slate-600 mt-1">{Math.round(progressPercentage)}% Selesai</p>
      </div>

      <div>
        <h5 className="font-bold text-slate-700 mb-3">Progres Bulanan (Target: {formatCurrency(targetBulanan)}/bulan)</h5>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Array.from({ length: jangkaWaktuBulan }).map((_, index) => {
            const isChecked = index < bulanSelesai;
            const isDisabled = index > bulanSelesai; // Hanya bisa menceklis yang berikutnya

            return (
              <label 
                key={index} 
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                  isDisabled 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                    : 'bg-blue-50 cursor-pointer hover:bg-blue-100'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleChecklistChange(index)}
                  disabled={isDisabled}
                  className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium">Bulan {index + 1}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};


const TargetTracker = ({ targets, onUpdateTarget }) => {
  if (!targets || targets.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Target Aktif</h3>
        <p className="text-slate-600">Anda belum memiliki target finansial. Mulai rencanakan di halaman kalkulator!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-8 h-8 text-blue-500 mr-4" />
        <h3 className="text-2xl font-bold text-slate-800">Target Finansial Aktif</h3>
      </div>
      <div className="space-y-6">
        {targets.map(target => (
          <MonthlyTargetCard 
            key={target.nama} 
            target={target} 
            onUpdateTarget={onUpdateTarget} 
          />
        ))}
      </div>
    </div>
  );
};

export default TargetTracker;
