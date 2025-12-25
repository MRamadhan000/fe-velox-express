interface HeroProps {
  showTrackingModal: () => void;
  showOrderModal: () => void;
}

export default function Hero({ showTrackingModal, showOrderModal }: HeroProps) {
  return (
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
  );
}