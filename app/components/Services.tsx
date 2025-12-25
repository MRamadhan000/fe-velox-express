interface ServicesProps {
  showOrderModal: () => void;
}

export default function Services({ showOrderModal }: ServicesProps) {
  return (
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
  );
}