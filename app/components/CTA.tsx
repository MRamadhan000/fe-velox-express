interface CTAProps {
  showTrackingModal: () => void;
  showOrderModal: () => void;
}

export default function CTA({ showTrackingModal, showOrderModal }: CTAProps) {
  return (
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
  );
}