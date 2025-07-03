import React from 'react';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';

export default function HomePage({ onNavigate }) {
  return (
    <main>
      <HeroSection />
            <Features onNavigate={onNavigate} />
      <Testimonials />
    </main>
  );
}
