"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/app/services/auth_service';
import { Mail, Lock, Loader2, AlertCircle, Truck, ArrowLeft, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- LOGIC TETAP SAMA (TIDAK DIUBAH) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await authService.login({ email, password });
      setSuccessMessage('Login successful! Redirecting...');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(
        error.message ||
        error.error ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- END OF LOGIC ---

  return (
    <section className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Brand/Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-200 mb-6 transform hover:rotate-12 transition-transform duration-500">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">
            VELOX<span className="text-blue-600 not-italic">EXPRESS</span>
          </h1>
          <p className="text-slate-500 font-medium mt-3">Logistik modern untuk bisnis masa depan.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/60">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Selamat Datang</h2>
            <p className="text-sm font-medium text-slate-400 mt-1">Silakan masuk untuk mengelola pengiriman.</p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-bold leading-tight">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-black">✓</span>
              </div>
              <p className="text-xs font-bold leading-tight">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                  Lupa?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60 overflow-hidden relative group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Masuk Sekarang
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-xs font-bold">
              Belum memiliki akun?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 transition-colors">
                Daftar Gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link href="/" className="group inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}