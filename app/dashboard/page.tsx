"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Truck, LogOut, Package, Search, BarChart3, 
  ArrowRight, Calendar, User as UserIcon, ShieldCheck, 
  ChevronRight, Box
} from "lucide-react";
import { authUtils } from "@/app/utils/auth";
import { authService } from "@/app/services/auth_service";

export default function UserDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // --- LOGIC TETAP SAMA (TIDAK DIUBAH) ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = authUtils.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        setUser(profile.user);
        setIsAuthenticated(true);

        if (profile.user.role === 'admin') {
          window.location.href = '/admin/dashboard';
          return;
        }
      } catch (error) {
        console.error('Failed to get profile:', error);
        authUtils.removeToken();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    authUtils.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/auth/login';
  };
  // --- END OF LOGIC ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
        <p className="mt-4 text-slate-600 font-medium tracking-wide">Syncing your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 max-w-sm w-full border border-slate-100">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Denied</h2>
          <p className="text-slate-500 mb-8 font-medium">Please sign in to your VeloxExpress account to continue.</p>
          <a
            href="/auth/login"
            className="block w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar Modern */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-100">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Velox<span className="text-blue-600">Express</span></h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">User Terminal</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-all font-bold text-sm bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 hover:shadow-md hover:shadow-red-100 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* User Hero Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 mb-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Truck className="w-64 h-64 text-slate-900" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-100">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                Welcome, {user?.name}!
              </h2>
              <p className="text-slate-500 font-bold mt-2 flex items-center justify-center md:justify-start gap-2">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs uppercase tracking-widest">{user?.role || 'Customer'}</span>
                <span className="text-slate-300">•</span>
                <span className="text-sm">{user?.email}</span>
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <Calendar className="w-3.5 h-3.5" />
                  Last login: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Shipments', val: '12', icon: Package, color: 'blue' },
            { label: 'In Transit', val: '03', icon: BarChart3, color: 'amber' },
            { label: 'Delivered', val: '09', icon: ShieldCheck, color: 'emerald' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-7 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-200" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Action Center */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-xs opacity-40">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/packet"
              className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-125 transition-all duration-500">
                <Box className="w-48 h-48 text-slate-900" />
              </div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">Tambah Paket</h4>
                    <p className="text-slate-500 font-medium mt-1">Registrasi pengiriman paket baru Anda.</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-full text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            <Link
              href="/shipments"
              className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-125 transition-all duration-500">
                <Search className="w-48 h-48 text-slate-900" />
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:-rotate-6 transition-transform">
                    <Search className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">Cek Shipments</h4>
                    <p className="text-slate-500 font-medium mt-1">Lacak status real-time kiriman Anda.</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-full text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="mt-12 text-center p-8 bg-slate-100/50 rounded-[2rem] border border-dashed border-slate-200">
          <p className="text-sm font-bold text-slate-500 italic">"Delivering trust, one package at a time."</p>
        </div>
      </main>
    </div>
  );
}