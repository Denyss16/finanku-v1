import React from 'react';

export default function HeroSection() {
  const handleScrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
      <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Kesulitan Mengatur Keuangan & Investasi?
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Kami siap membantu mengatasi masalah keuangan Anda melalui edukasi dan alat bantu finansial menuju masa depan keuangan yang lebih terarah.
          </p>
          <button
            onClick={handleScrollToFeatures}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Lihat Fitur Kami
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          {/* SVG Illustration from previous steps */}
          <svg width="100%" viewBox="0 0 450 300" xmlns="http://www.w3.org/2000/svg" className="max-w-md">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"></feGaussianBlur>
                <feMerge>
                  <feMergeNode in="coloredBlur"></feMergeNode>
                  <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
              </filter>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDBA74"></stop>
                <stop offset="100%" stopColor="#F97316"></stop>
              </linearGradient>
            </defs>
            <g strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              {/* Main wave line */}
              <path d="M 50 280 C 120 280, 150 100, 250 100 S 350 120, 400 200" stroke="#A5F3FC" fill="none" strokeWidth="8" filter="url(#glow)"></path>
              
              {/* Bar chart */}
              <rect x="150" y="200" width="20" height="60" fill="#67E8F9" rx="4"></rect>
              <rect x="180" y="180" width="20" height="80" fill="#A5F3FC" rx="4"></rect>
              <rect x="210" y="220" width="20" height="40" fill="#22D3EE" rx="4"></rect>

              {/* Rupiah Coin */}
              <circle cx="350" cy="60" r="25" fill="url(#orangeGradient)" filter="url(#glow)"></circle>
              <text x="350" y="65" fontFamily="Arial, sans-serif" fontSize="18" fill="white" textAnchor="middle" fontWeight="bold">Rp</text>
              
              {/* Pie chart */}
              <circle cx="300" cy="150" r="20" fill="white" stroke="#22D3EE" strokeWidth="3"></circle>
              <path d="M 300 150 L 300 130 A 20 20 0 0 1 317.32 140 Z" fill="#67E8F9"></path>

              {/* Arrow Up */}
              <path d="M 380 250 L 380 220 M 370 230 L 380 220 L 390 230" stroke="white" strokeWidth="4" fill="none"></path>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
