"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/app/services/auth_service';
import { Mail, Lock, Loader2, AlertCircle, Truck, Shield, ArrowLeft, ChevronRight, LockKeyhole } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@velox.com');
  const [password, setPassword] = useState('admin123');
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
      const response = await authService.adminLogin({ email, password });
      setSuccessMessage('Admin login successful! Redirecting...');

      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 2000);
    } catch (error: any) {
      console.error('Admin login error:', error);
      setErrorMessage(
        error.message ||
        error.error ||
        'Admin login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- END OF LOGIC ---

  return (
    <section className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns khas Admin (Dark Theme) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Admin Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-red-600 to-red-500 rounded-[2rem] shadow-2xl shadow-red-900/20 mb-6 border-4 border-white/10">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter italic">
            VELOX<span className="text-red-500 not-italic">ADMIN</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="h-[1px] w-8 bg-red-500/50"></span>
            <p className="text-red-400 font-bold text-[10px] uppercase tracking-[0.3em]">Authorized Access Only</p>
            <span className="h-[1px] w-8 bg-red-500/50"></span>
          </div>
        </div>

        {/* Login Card (Dark Glassmorphism) */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-3xl shadow-black">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">Control Center</h2>
            <p className="text-sm font-medium text-slate-400 mt-2">Masukkan kredensial administrator Anda.</p>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-bold">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-black">✓</span>
              </div>
              <p className="text-xs font-bold">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Admin Identifier
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-sm placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/50 focus:bg-white/10 transition-all disabled:opacity-60"
                  placeholder="admin@velox.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors">
                  <LockKeyhole className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-sm placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/50 focus:bg-white/10 transition-all disabled:opacity-60"
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
              className="w-full py-4 bg-red-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-red-500 transition-all shadow-xl shadow-red-900/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60 relative group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Access Terminal
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              Bukan Administrator?{' '}
              <Link href="/auth/login" className="text-red-500 hover:text-red-400 transition-colors ml-1">
                User Portal
              </Link>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="group inline-flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Beranda Utama
          </Link>
        </div>
      </div>
    </section>
  );
}