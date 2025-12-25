export default function Footer() {
  return (
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
  );
}