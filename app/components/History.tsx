"use client";

// Data Dummy (contoh riwayat)
const dummyHistory = [
  {
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    receipt_number: "VLX-20251224-K9P2MX",
    status: "Pending",
    packet: {
      customer_name: "Andi Wijaya",
      weight: 5,
    },
    driver: {
      driver_name: "Ahmad Subarjo",
    },
  },
];

import { Package, Clock } from "lucide-react";

export default function History() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-blue-600 text-white px-8 py-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Clock className="w-8 h-8" />
          Riwayat Pengiriman
        </h2>
      </div>

      <div className="p-8">
        {dummyHistory.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg italic">
              Belum ada riwayat pengiriman.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Kirim paket pertama Anda sekarang!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dummyHistory.map((h) => (
              <div
                key={h.uuid}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-6">
                  <div>
                    <div className="font-mono text-2xl font-bold text-blue-700">
                      {h.receipt_number}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {h.uuid}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Pengirim</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {h.packet.customer_name}
                      </p>
                      <p className="text-gray-500">{h.packet.weight} kg</p>
                    </div>

                    <div>
                      <p className="text-gray-600 font-medium">Kurir</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {h.driver.driver_name}
                      </p>
                    </div>

                    <div className="flex items-center justify-start sm:justify-end">
                      <span className="px-5 py-2 rounded-full text-sm font-bold uppercase bg-yellow-100 text-yellow-800">
                        {h.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}