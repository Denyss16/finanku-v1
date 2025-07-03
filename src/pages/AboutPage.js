import React from 'react';
import { Eye, Rocket, TrendingUp } from 'lucide-react';
import heroImage from '../assets/hero-financial.jpg'; // Impor gambar lokal

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-80"
        // Gambar baru bertema finansial
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Mengenal FinanKu Lebih Dekat</h1>
            <p className="mt-4 text-lg md:text-xl font-light">Mewujudkan Kebebasan Finansial Anda</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* About FinanKu Section */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Ikon baru: statistik/trending */}
          <TrendingUp className="w-12 h-12 mx-auto text-blue-600" />
          <h2 className="mt-4 text-4xl font-bold text-slate-800">Apa itu FinanKu?</h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            FinanKu adalah sebuah aplikasi web inovatif yang dirancang untuk membantu Anda mengelola keuangan pribadi dengan lebih cerdas dan terarah. Kami menyediakan alat kalkulator finansial yang mudah digunakan untuk merencanakan tabungan, investasi, dan tujuan keuangan lainnya, serta menyajikan artikel edukatif untuk meningkatkan literasi finansial Anda.
          </p>
        </div>

        {/* Visi & Misi Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-x-12 gap-y-16">
          {/* Visi Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="ml-4 text-3xl font-bold text-slate-700">Visi Kami</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Menjadi platform literasi dan perencanaan keuangan terdepan di Indonesia yang memberdayakan setiap individu untuk mencapai kebebasan finansial.
            </p>
          </div>

          {/* Misi Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Rocket className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="ml-4 text-3xl font-bold text-slate-700">Misi Kami</h3>
            </div>
            <ul className="list-disc list-inside text-slate-600 leading-relaxed space-y-2 pl-2">
              <li>Menyediakan alat perencanaan keuangan yang akurat, mudah diakses, dan gratis.</li>
              <li>Menyajikan konten edukasi finansial yang relevan, terpercaya, dan mudah dipahami.</li>
              <li>Membangun komunitas yang saling mendukung untuk belajar dan bertumbuh dalam hal keuangan.</li>
              <li>Berinovasi secara berkelanjutan untuk memenuhi kebutuhan finansial pengguna.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
