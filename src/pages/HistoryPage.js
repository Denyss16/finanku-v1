import React from 'react';

export default function HistoryPage({ completedTargets, onNavigate }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Riwayat Target Selesai</h2>
          {completedTargets && completedTargets.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {completedTargets.map((target, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg hover:border-green-600 transition-all duration-200 cursor-pointer"
                  onClick={() => onNavigate('report', target)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-slate-700">{target.nama}</h4>
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">Selesai</span>
                  </div>
                  <p className="text-green-600 font-bold text-2xl mt-2">Congrats!</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Target: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(target.target)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-slate-500">Belum ada target yang selesai.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
