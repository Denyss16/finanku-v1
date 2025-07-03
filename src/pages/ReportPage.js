import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportPage({ currentUser, target, onBack }) {
  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Laporan Target Finansial Selesai", 14, 22);

    // User Info
    doc.setFontSize(12);
    doc.text(`Nama: ${currentUser?.name}`, 14, 32);
    doc.text(`Email: ${currentUser?.email}`, 14, 38);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [['Nama Target', 'Target (Rp)', 'Terkumpul (Rp)', 'Status']],
      body: [
        [
          target.nama,
          new Intl.NumberFormat('id-ID').format(target.target),
          new Intl.NumberFormat('id-ID').format(target.terkumpul),
          'Selesai'
        ],
      ],
      headStyles: { fillColor: [41, 128, 185] }, // Blue color for header
      theme: 'grid',
    });

    doc.save(`laporan-${target.nama.toLowerCase().replace(/\s/g, '-')}.pdf`);
  };

  if (!target) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-500">Target tidak ditemukan.</p>
        <button onClick={onBack} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-md transition duration-300">Kembali ke Riwayat</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="p-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Laporan Target Finansial Selesai</h2>
            <div className="mb-6">
              <p className="text-slate-600"><span className="font-semibold">Nama:</span> {currentUser?.name}</p>
              <p className="text-slate-600"><span className="font-semibold">Email:</span> {currentUser?.email}</p>
            </div>
            <table className="w-full text-left table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2">Nama Target</th>
                  <th className="px-4 py-2">Target (Rp)</th>
                  <th className="px-4 py-2">Terkumpul (Rp)</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">{target.nama}</td>
                  <td className="px-4 py-3">{new Intl.NumberFormat('id-ID').format(target.target)}</td>
                  <td className="px-4 py-3">{new Intl.NumberFormat('id-ID').format(target.terkumpul)}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">Selesai</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-8 space-x-4">
            <button onClick={onBack} className="bg-slate-500 hover:bg-slate-600 text-white font-bold px-4 py-2 rounded-md transition duration-300">Kembali</button>
            <button onClick={handleDownloadPdf} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-md transition duration-300">Unduh Laporan (PDF)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
