'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-velox-blue text-white w-12 h-12 rounded-full shadow-lg hover:bg-velox-dark transition z-50 ${showScrollTop ? 'flex' : 'hidden'} items-center justify-center`}
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}