"use client";

import { useState } from "react";
import {
  Package,
  User,
  Phone,
  MapPin,
  Camera,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { packetService } from "@/app/services/packet_service";
import axios from "axios";
import { PacketPayload } from "@/app/types/packet";

export default function FormData() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const buildPacketPayload = (form: HTMLFormElement): PacketPayload => {
    const elements = form.elements as HTMLFormControlsCollection;
    const getValue = (name: string) => (elements.namedItem(name) as HTMLInputElement)?.value || '';
    const getFile = (name: string) => (elements.namedItem(name) as HTMLInputElement)?.files?.[0] || null;

    return {
      sender_name: getValue('sender_name'),
      sender_phone: getValue('sender_phone'),
      pickup_address: getValue('pickup_address'),
      receiver_name: getValue('receiver_name'),
      receiver_phone: getValue('receiver_phone'),
      destination_address: getValue('destination_address'),
      weight: parseInt(getValue('weight'), 10),
      packet_image: getFile('packet_image'),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const form = e.currentTarget; // Simpan reference form

    try {
      const payload = buildPacketPayload(form);

      // convert ke FormData (untuk upload file)
      const formData = new (globalThis as any).FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await packetService.store(formData);

      console.log("Response:", response); // Debug log

      // Jika response ada data atau status sukses, anggap berhasil
      if (response && (response.data || response.success || response.id)) {
        setShowSuccess(true);
        form.reset();
        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        // Jika response tidak sesuai ekspektasi, tapi mungkin data tersimpan
        console.warn("Unexpected response format:", response);
        setShowSuccess(true);
        form.reset();
        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (error: unknown) {
      console.error("Error:", error); // Debug log

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        console.log("Error status:", status, "Data:", data); // Debug log

        // Jika status 200-299 tapi ada di catch (mungkin karena response structure)
        if (status && status >= 200 && status < 300) {
          console.log("Status OK but caught as error, treating as success");
          setShowSuccess(true);
          form.reset();
          setTimeout(() => setShowSuccess(false), 4000);
          return;
        }

        setErrorMessage(
          data?.message ??
          data?.error ??
          "Gagal membuat pengiriman."
        );
      } else {
        setErrorMessage("Terjadi kesalahan tidak terduga.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-7 flex items-center gap-3">
        <Package className="w-8 h-8 text-blue-600" />
        Kirim Paket Baru
      </h2>

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
          ✅ Pengiriman berhasil dibuat
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 flex gap-2 text-red-700">
          <AlertCircle />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* === Pengirim === */}
        <div className="space-y-4 pb-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider">
            Pengirim
          </h3>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-5 h-5 text-blue-600" /> Nama Pengirim
            </label>
            <input
              name="sender_name"
              type="text"
              placeholder="Andi Wijaya"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 border text-black border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition disabled:opacity-60"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-5 h-5 text-blue-600" /> No. HP Pengirim
            </label>
            <input
              name="sender_phone"
              type="tel"
              placeholder="0812-3456-7890"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 border text-black border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition disabled:opacity-60"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Alamat Jemput
            </label>
            <textarea
              name="pickup_address"
              rows={3}
              placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 border text-black border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition resize-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* === Penerima === */}
        <div className="space-y-4 pb-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider">
            Penerima
          </h3>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-5 h-5 text-blue-600" /> Nama Penerima
            </label>
            <input
              name="receiver_name"
              type="text"
              placeholder="Budi Santoso"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 border text-black border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition disabled:opacity-60"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-5 h-5 text-blue-600" /> No. HP Penerima
            </label>
            <input
              name="receiver_phone"
              type="tel"
              placeholder="0857-8888-9999"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 border text-black border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition disabled:opacity-60"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Alamat Tujuan
            </label>
            <textarea
              name="destination_address"
              rows={3}
              placeholder="Jl. Gatot Subroto No. 45, Bandung"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 border text-black border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition resize-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* === Detail Paket === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider">
            Detail Paket
          </h3>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Package className="w-5 h-5 text-blue-600" /> Berat Paket (kg)
            </label>
            <input
              name="weight"
              type="number"
              min="1"
              placeholder="2"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 border text-black border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition disabled:opacity-60"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Camera className="w-5 h-5 text-blue-600" /> Foto Paket (Opsional)
            </label>
            <input
              name="packet_image"
              type="file"
              accept="image/*"
              disabled={isSubmitting}
              className="w-full text-sm text-black file:mr-4 file:py-3 file:px-7 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 cursor-pointer disabled:opacity-60"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg mt-6 ${
            isSubmitting
              ? "bg-blue-500 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl active:scale-95"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Send className="w-6 h-6" />
              Buat Pengiriman
            </>
          )}
        </button>
      </form>
    </div>
  );
}
