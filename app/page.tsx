'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const menuItems = [
    { name: 'Beranda', href: '#home', icon: 'fa-home' },
    { name: 'Layanan', href: '#services', icon: 'fa-box' },
    { name: 'Keunggulan', href: '#benefits', icon: 'fa-star' },
    { name: 'Tentang', href: '#about', icon: 'fa-info-circle' },
    { name: 'Testimoni', href: '#testimonials', icon: 'fa-comments' },
    { name: 'Kontak', href: '#contact', icon: 'fa-envelope' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showTrackingModal = () => {
    // Implement tracking modal
    alert('Tracking modal - to be implemented');
  };

  const showOrderModal = () => {
    // Implement order modal
    alert('Order modal - to be implemented');
  };

  return (
    <div className="bg-gray-50">
      {/* Header/Navbar */}
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
                onClick={showTrackingModal}
                className="px-6 py-2 text-velox-blue border border-velox-blue rounded-lg hover:bg-velox-light transition"
              >
                Lacak Paket
              </button>
              <button
                onClick={showOrderModal}
                className="px-6 py-2 bg-velox-blue text-white rounded-lg hover:bg-velox-dark transition"
              >
                Kirim Sekarang
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
                onClick={showTrackingModal}
                className="w-full px-6 py-2 text-velox-blue border border-velox-blue rounded-lg"
              >
                Lacak Paket
              </button>
              <button onClick={showOrderModal} className="w-full px-6 py-2 bg-velox-blue text-white rounded-lg">
                Kirim Sekarang
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 gradient-bg text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-48">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Image */}
            <div className="relative hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600" alt="Delivery" className="rounded-lg" />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                Cepat Sampai,<br />
                <span className="text-white/90">Pasti Aman</span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100">
                Pengiriman ekspres terpercaya dengan teknologi tracking real-time.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">500K+</div>
                  <div className="text-blue-200 text-xs sm:text-sm">Paket/Hari</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">98%</div>
                  <div className="text-blue-200 text-xs sm:text-sm">Tepat Waktu</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">1000+</div>
                  <div className="text-blue-200 text-xs sm:text-sm">Mitra</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={showOrderModal}
                  className="px-6 sm:px-8 py-3 bg-white text-velox-blue rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Mulai Kirim
                </button>
                <button
                  onClick={showTrackingModal}
                  className="px-6 sm:px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  Lacak Paket
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-48">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Layanan Kami</h2>
            <p className="text-gray-600 text-base sm:text-lg">Pilih layanan sesuai kebutuhan Anda</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Service 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 hover-lift">
              <div className="w-14 h-14 bg-velox-light rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-bolt text-velox-blue text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">VELOX Instant</h3>
              <p className="text-gray-600 mb-4">2-4 Jam Sampai</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700 text-sm sm:text-base">
                  <i className="fas fa-check text-velox-blue mr-3"></i>
                  Pengiriman dalam kota
                </li>
                <li className="flex items-center text-gray-700 text-sm sm:text-base">
                  <i className="fas fa-check text-velox-blue mr-3"></i>
                  Real-time tracking
                </li>
                <li className="flex items-center text-gray-700 text-sm sm:text-base">
                  <i className="fas fa-check text-velox-blue mr-3"></i>
                  Asuransi gratis
                </li>
              </ul>
              <button
                onClick={showOrderModal}
                className="w-full py-3 bg-velox-blue text-white rounded-lg hover:bg-velox-dark transition"
              >
                Pilih Layanan
              </button>
            </div>

            {/* Service 2 - Featured */}
            <div className="bg-velox-blue text-white rounded-xl p-6 sm:p-8 hover-lift relative">
              <div className="absolute top-4 right-4 bg-white text-velox-blue text-xs font-bold px-3 py-1 rounded-full">
                POPULER
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-shipping-fast text-white text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">VELOX Express</h3>
              <p className="text-blue-100 mb-4">Same Day / Next Day</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm sm:text-base">
                  <i className="fas fa-check mr-3"></i>
                  1 hari sampai tujuan
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <i className="fas fa-check mr-3"></i>
                  Layanan premium
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <i className="fas fa-check mr-3"></i>
                  Asuransi penuh
                </li>
              </ul>
              <button
                onClick={showOrderModal}
                className="w-full py-3 bg-white text-velox-blue rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Pilih Layanan
              </button>
            </div>

            {/* Service 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 hover-lift">
              <div className="w-14 h-14 bg-velox-light rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-box text-velox-blue text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">VELOX Regular</h3>
              <p className="text-gray-600 mb-4">2-3 Hari</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700 text-sm sm:text-base">
                  <i className="fas fa-check text-velox-blue mr-3"></i>
                  Ekonomis & terpercaya
                </li>
                <li className="flex items-center text-gray-700 text-sm sm:text-base">
                  <i className="fas fa-check text-velox-blue mr-3"></i>
                  Ke seluruh Indonesia
                </li>
                <li className="flex items-center text-gray-700 text-sm sm:text-base">
                  <i className="fas fa-check text-velox-blue mr-3"></i>
                  Jaminan aman
                </li>
              </ul>
              <button
                onClick={showOrderModal}
                className="w-full py-3 bg-velox-blue text-white rounded-lg hover:bg-velox-dark transition"
              >
                Pilih Layanan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section-padding bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-48">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Mengapa Pilih VELOX?</h2>
            <p className="text-gray-600 text-base sm:text-lg">Keunggulan yang membuat kami berbeda</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="w-14 h-14 bg-velox-light rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-rocket text-velox-blue text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Super Cepat</h3>
              <p className="text-gray-600 text-sm sm:text-base">Pengiriman same day delivery dalam 2-4 jam untuk area tertentu</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="w-14 h-14 bg-velox-light rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-velox-blue text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Asuransi Gratis</h3>
              <p className="text-gray-600 text-sm sm:text-base">Semua paket otomatis diasuransikan tanpa biaya tambahan</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="w-14 h-14 bg-velox-light rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-map-marked-alt text-velox-blue text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Real-Time Tracking</h3>
              <p className="text-gray-600 text-sm sm:text-base">Pantau posisi paket Anda setiap detik dengan teknologi GPS</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="w-14 h-14 bg-velox-light rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-headset text-velox-blue text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">CS 24/7</h3>
              <p className="text-gray-600 text-sm sm:text-base">Customer service siap membantu Anda kapan saja</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="w-14 h-14 bg-velox-light rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-leaf text-velox-blue text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Ramah Lingkungan</h3>
              <p className="text-gray-600 text-sm sm:text-base">Armada kendaraan listrik untuk pengiriman yang eco-friendly</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="w-14 h-14 bg-velox-light rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-box text-velox-blue text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Smart Locker</h3>
              <p className="text-gray-600 text-sm sm:text-base">Ambil paket 24/7 di locker otomatis terdekat</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-48">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600" alt="About VELOX" className="rounded-2xl shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Tentang VELOX Express</h2>
              <p className="text-gray-600 text-base sm:text-lg mb-6">
                VELOX Express adalah perusahaan pengiriman modern yang menggabungkan kecepatan,
                keamanan, dan teknologi terkini untuk memberikan pengalaman pengiriman terbaik.
              </p>

              <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-velox-blue">5+</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Tahun</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-velox-blue">100+</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Kota</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-velox-blue">5M+</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Paket</div>
                </div>
              </div>

              <button
                onClick={showOrderModal}
                className="px-6 sm:px-8 py-3 bg-velox-blue text-white rounded-lg hover:bg-velox-dark transition"
              >
                Mulai Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-48">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Testimoni Pelanggan</h2>
            <p className="text-gray-600 text-base sm:text-lg">Apa kata mereka tentang VELOX Express</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="flex text-yellow-400 mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-600 mb-6 italic text-sm sm:text-base">
                "VELOX Express sangat membantu bisnis saya! Pengiriman cepat dan pelanggan selalu puas."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-velox-light rounded-full flex items-center justify-center text-velox-blue font-bold mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Andi Wijaya</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Pemilik Toko Online</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="flex text-yellow-400 mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-600 mb-6 italic text-sm sm:text-base">
                "Saya sering kirim paket ke keluarga. VELOX selalu tepat waktu dan paket sampai dengan aman."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-velox-light rounded-full flex items-center justify-center text-velox-blue font-bold mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Siti Nurhaliza</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Ibu Rumah Tangga</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-xl hover-lift">
              <div className="flex text-yellow-400 mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-600 mb-6 italic text-sm sm:text-base">
                "Layanan VELOX Instant sangat membantu untuk pengiriman dokumen penting. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-velox-light rounded-full flex items-center justify-center text-velox-blue font-bold mr-4">
                  B
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Budi Santoso</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Pengusaha</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="mt-12 sm:mt-16 bg-white rounded-2xl p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-velox-blue mb-2">4.9</div>
                <div className="flex justify-center text-yellow-400 mb-2">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Rating</p>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-velox-blue mb-2">50K+</div>
                <p className="text-gray-600 text-sm sm:text-base">Total Review</p>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-velox-blue mb-2">98%</div>
                <p className="text-gray-600 text-sm sm:text-base">Kepuasan</p>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-velox-blue mb-2">99%</div>
                <p className="text-gray-600 text-sm sm:text-base">Rekomendasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-48">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
            <p className="text-gray-600 text-base sm:text-lg">Ada pertanyaan? Tim kami siap membantu</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-velox-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-velox-blue"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Alamat</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Jl. Sudirman No. 123<br />
                    Jakarta Pusat, DKI Jakarta 10220
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-velox-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-phone text-velox-blue"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Telepon</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    CS: 1500-VELOX<br />
                    WA: +62 812-3456-7890
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-velox-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-envelope text-velox-blue"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    info@veloxexpress.com<br />
                    support@veloxexpress.com
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-velox-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-clock text-velox-blue"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Jam Operasional</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Senin - Jumat: 08.00 - 20.00<br />
                    Sabtu - Minggu: 09.00 - 17.00
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
              <form className="space-y-4">
                <div>
                  <input type="text" placeholder="Nama Lengkap" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-velox-blue text-sm sm:text-base" />
                </div>
                <div>
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-velox-blue text-sm sm:text-base" />
                </div>
                <div>
                  <input type="tel" placeholder="Nomor Telepon" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-velox-blue text-sm sm:text-base" />
                </div>
                <div>
                  <textarea rows={4} placeholder="Pesan Anda" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-velox-blue text-sm sm:text-base"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-velox-blue text-white rounded-lg font-semibold hover:bg-velox-dark transition">
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-48 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Siap Mengirim Paket Anda?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan jutaan pelanggan yang telah mempercayai VELOX Express
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={showOrderModal}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-velox-blue rounded-lg font-semibold hover:bg-gray-100 transition text-base sm:text-lg"
            >
              <i className="fas fa-box mr-2"></i>
              Kirim Paket Sekarang
            </button>
            <button
              onClick={showTrackingModal}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition text-base sm:text-lg"
            >
              <i className="fas fa-search mr-2"></i>
              Lacak Paket
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-48">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-velox-blue w-10 h-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-bolt text-white"></i>
                </div>
                <span className="text-2xl font-bold">VELOX</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Cepat Sampai, Pasti Aman.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-velox-blue transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-velox-blue transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-velox-blue transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-velox-blue transition">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#services" className="hover:text-white transition">VELOX Instant</a></li>
                <li><a href="#services" className="hover:text-white transition">VELOX Express</a></li>
                <li><a href="#services" className="hover:text-white transition">VELOX Regular</a></li>
                <li><a href="#services" className="hover:text-white transition">VELOX Cargo</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition">Lacak Paket</a></li>
                <li><a href="#" className="hover:text-white transition">Cek Tarif</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#contact" className="hover:text-white transition">Hubungi Kami</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#about" className="hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition">Karir</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Mitra Bisnis</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs sm:text-sm">
              <p className="mb-4 md:mb-0">
                © 2025 VELOX Express. All rights reserved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <a href="#" className="hover:text-white transition">Syarat & Ketentuan</a>
                <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-velox-blue text-white w-12 h-12 rounded-full shadow-lg hover:bg-velox-dark transition z-50 ${showScrollTop ? 'flex' : 'hidden'} items-center justify-center`}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  );
}