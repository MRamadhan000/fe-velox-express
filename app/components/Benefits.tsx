export default function Benefits() {
  return (
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
  );
}