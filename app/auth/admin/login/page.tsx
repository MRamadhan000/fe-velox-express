"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/app/services/auth_service';
import { Mail, Lock, Loader2, AlertCircle, Truck, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@velox.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand/Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-velox-blue tracking-tight">
            VELOX<span className="text-blue-500">EXPRESS</span>
          </Link>
          <p className="text-gray-500 mt-2 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            Admin Panel - Masuk sebagai Administrator
          </p>
        </div>

        {/* Login Card */}
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

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-5 h-5 text-red-600" />
                Admin Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition disabled:opacity-60"
                placeholder="admin@velox.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-5 h-5 text-red-600" />
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition disabled:opacity-60"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Masuk sebagai Admin
                </>
              )}
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Bukan admin?{' '}
              <Link href="/auth/login" className="text-velox-blue font-bold hover:underline">
                Masuk sebagai User
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-velox-blue transition inline-flex items-center gap-2">
            <span>←</span> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}