"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/app/services/auth_service';
import { User, Mail, Lock, Loader2, AlertCircle, Truck, ArrowLeft, ChevronRight, ShieldCheck } from 'lucide-react';

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

  // --- LOGIC TETAP SAMA ---
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
  // --- END OF LOGIC ---

  return (
    <section className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden py-16">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-100/40 rounded-full blur-[100px]" />

      <div className="w-full max-w-[480px] relative z-10">
        
        {/* Brand/Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 mb-4">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
            JOIN <span className="text-blue-600">VELOX</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Create your shipping account</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50">
          
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
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs font-bold leading-tight">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  name="email"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-xs placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password_confirmation" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                  Confirm
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-xs placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
                    placeholder="Repeat"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60 mt-4 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-xs font-bold">
              Sudah memiliki akun?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 transition-colors">
                Masuk Sekarang
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