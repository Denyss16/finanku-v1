import React from 'react';

const ArticleListPage = ({ onNavigate }) => {
  const articles = [
    {
      id: "dana-darurat",
      title: "Pentingnya Dana Darurat dan Cara Menghitungnya",
      excerpt: "Pelajari mengapa dana darurat adalah fondasi keuangan yang sehat dan bagaimana cara mempersiapkannya.",
      file: "dana-darurat.md",
    },
    {
      id: "dana-pendidikan-anak",
      title: "Merencanakan Dana Pendidikan Anak Sejak Dini",
      excerpt: "Simulasi dan strategi terbaik untuk memastikan pendidikan terbaik bagi buah hati Anda tanpa beban utang.",
      file: "dana-pendidikan-anak.md",
    },
    {
      id: "proyeksi-investasi",
      title: "Memahami Proyeksi Investasi untuk Masa Depan",
      excerpt: "Lihat bagaimana investasi Anda dapat bertumbuh dan capai tujuan finansial Anda lebih cepat.",
      file: "proyeksi-investasi.md",
    },
    {
      id: "dana-pensiun",
      title: "Strategi Cerdas Menyiapkan Dana Pensiun",
      excerpt: "Nikmati masa tua yang tenang dan sejahtera dengan perencanaan pensiun yang matang sejak sekarang.",
      file: "dana-pensiun.md",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800">Edukasi Finansial</h1>
        <p className="text-xl text-slate-600 mt-2">Tingkatkan literasi keuangan Anda dengan artikel pilihan dari kami.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{article.title}</h2>
            <p className="text-slate-600 mb-4">{article.excerpt}</p>
            <button
              onClick={() => onNavigate("artikel", { file: article.file })}
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Baca Selengkapnya &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleListPage;
