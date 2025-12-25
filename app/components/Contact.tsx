export default function Contact() {
  return (
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
  );
}