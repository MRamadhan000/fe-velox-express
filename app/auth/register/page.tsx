"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/app/services/auth_service';
import { User, Mail, Lock, Loader2, AlertCircle, Truck } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await authService.register(formData);
      setSuccessMessage('Registration successful! You can now login.');

      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(
        error.message ||
        error.error ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    // Background diganti menjadi abu-abu sangat muda agar card putih terlihat kontras
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Brand/Logo - Sekarang menggunakan warna Biru Utama */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-velox-blue tracking-tight">
            VELOX<span className="text-blue-500">EXPRESS</span>
          </Link>
          <p className="text-gray-500 mt-2">Daftar akun untuk mulai mengirim paket</p>
        </div>

        {/* Register Card - Putih Bersih dengan Shadow Halus */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              ✅ {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition disabled:opacity-60"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition disabled:opacity-60"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition disabled:opacity-60"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="password_confirmation" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Konfirmasi Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition disabled:opacity-60"
                placeholder="Ulangi password"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button - Sekarang menggunakan background Biru */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Daftar Akun'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-x-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-velox-blue transition">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}