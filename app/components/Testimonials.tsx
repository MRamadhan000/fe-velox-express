export default function Testimonials() {
  return (
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
  );
}