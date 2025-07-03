import React from 'react';
import { ShieldCheck, GraduationCap, BarChart, Sun } from 'lucide-react';

const features = [
  {
    id: "danaDarurat",
    icon: (props) => <ShieldCheck {...props} />,
    title: "Perencanaan Dana Darurat",
    description: "Hitung dan siapkan dana darurat Anda dengan kalkulator interaktif kami.",
    color: "text-blue-500",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    id: "pendidikanAnak",
    icon: (props) => <GraduationCap {...props} />,
    title: "Perencanaan Dana Pendidikan",
    description: "Rencanakan masa depan pendidikan anak-anak Anda tanpa khawatir soal biaya.",
    color: "text-purple-500",
    hoverColor: "group-hover:text-purple-600",
  },
  {
    id: "investasiMasaDepan",
    icon: (props) => <BarChart {...props} />,
    title: "Proyeksi Investasi Masa Depan",
    description: "Lihat potensi pertumbuhan investasi Anda untuk mencapai tujuan finansial.",
    color: "text-green-500",
    hoverColor: "group-hover:text-green-600",
  },
  {
    id: "danaPensiun",
    icon: (props) => <Sun {...props} />,
    title: "Perencanaan Dana Pensiun",
    description: "Pastikan masa tua yang nyaman dan sejahtera dengan perencanaan yang matang.",
    color: "text-yellow-500",
    hoverColor: "group-hover:text-yellow-600",
  },
];

export default function Features({ onNavigate }) {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Satu Aplikasi, Semua Solusi Finansial</h2>
          <p className="text-lg text-gray-600 mt-2">Mulai rencanakan masa depan keuangan Anda dengan alat yang tepat.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="group bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onNavigate('kalkulator', { calculatorId: feature.id })}
              >
                <div className={`flex justify-center mb-4`}>
                  <Icon className={`w-12 h-12 transition-colors duration-300 ${feature.color} ${feature.hoverColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <p className="font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Coba Kalkulator &rarr;
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
