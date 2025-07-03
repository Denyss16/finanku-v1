import React from 'react';

const testimonials = [
  {
    quote: 'Finanku benar-benar mengubah cara saya mengelola keuangan. Kalkulatornya sangat intuitif dan mudah digunakan!',
    name: 'Sarah Larasati',
    title: 'Digital Marketer',
    img: 'https://i.pravatar.cc/150?img=1',
  },
  {
    quote: 'Sebagai seorang freelancer, merencanakan dana darurat itu krusial. Fitur di Finanku sangat membantu saya mencapai target.',
    name: 'Budi Santoso',
    title: 'Freelance Graphic Designer',
    img: 'https://i.pravatar.cc/150?img=3',
  },
  {
    quote: 'Artikel edukasinya penuh wawasan. Saya jadi lebih melek finansial dan percaya diri dalam berinvestasi. Terima kasih, Finanku!',
    name: 'Rina Wijaya',
    title: 'Mahasiswi',
    img: 'https://i.pravatar.cc/150?img=5',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-100 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">Apa Kata Mereka?</h2>
        <p className="text-center text-slate-600 mb-12">Dengarkan cerita dari para pengguna yang telah merasakan manfaat Finanku.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
              <img src={testimonial.img} alt={testimonial.name} className="w-24 h-24 rounded-full mb-4 border-4 border-slate-200" />
              <p className="text-slate-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="font-bold text-slate-800">{testimonial.name}</p>
              <p className="text-sm text-slate-500">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
