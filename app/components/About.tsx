interface AboutProps {
  showOrderModal: () => void;
}

export default function About({ showOrderModal }: AboutProps) {
  return (
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
  );
}