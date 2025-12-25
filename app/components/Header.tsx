'use client';
import React, { useState } from 'react';

interface HeaderProps {
  showTrackingModal: () => void;
  showOrderModal: () => void;
}

export default function Header({ showTrackingModal, showOrderModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Beranda', href: '#home', icon: 'fa-home' },
    { name: 'Layanan', href: '#services', icon: 'fa-box' },
    { name: 'Keunggulan', href: '#benefits', icon: 'fa-star' },
    { name: 'Tentang', href: '#about', icon: 'fa-info-circle' },
    { name: 'Testimoni', href: '#testimonials', icon: 'fa-comments' },
    { name: 'Kontak', href: '#contact', icon: 'fa-envelope' }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    if (mode === 'login') {
      window.location.href = '/auth/login';
    } else {
      window.location.href = '/auth/register';
    }
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="mx-auto px-4 sm:px-6 lg:px-48 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-velox-blue w-10 h-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-velox-blue">VELOX</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-velox-blue transition font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => openAuthModal('register')}
              className="px-6 py-2 text-velox-blue border border-velox-blue rounded-lg hover:bg-velox-light transition"
            >
              Register
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="px-6 py-2 bg-velox-blue text-white rounded-lg hover:bg-velox-dark transition"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={toggleMobileMenu}>
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden mt-4 pb-4 ${mobileMenuOpen ? '' : 'hidden'}`}>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center py-3 text-gray-700 hover:text-velox-blue hover:bg-velox-light px-4 rounded-lg transition"
                onClick={toggleMobileMenu}
              >
                <i className={`fas ${item.icon} mr-3 text-velox-blue w-5`}></i>
                <span>{item.name}</span>
              </a>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <button
              onClick={() => openAuthModal('register')}
              className="w-full px-6 py-2 text-velox-blue border border-velox-blue rounded-lg"
            >
              Register
            </button>
            <button onClick={() => openAuthModal('login')} className="w-full px-6 py-2 bg-velox-blue text-white rounded-lg">
              Login
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}