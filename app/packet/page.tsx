"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Truck, ArrowLeft, LogOut, PackagePlus, 
  ShieldCheck, HelpCircle, Box
} from "lucide-react";
import FormData from "@/app/components/FormData";
import { authUtils } from "@/app/utils/auth";
import { authService } from "@/app/services/auth_service";

export default function PacketPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // --- LOGIC TETAP SAMA (TIDAK DIUBAH) ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = authUtils.getToken();
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const profile = await authService.getProfile();
        setUser(profile.user);
        setIsAuthenticated(true);

        if (profile.user.role === 'admin') {
          router.push('/admin/dashboard');
          return;
        }
      } catch (error) {
        console.error('Failed to get profile:', error);
        authUtils.removeToken();
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    authUtils.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/auth/login');
  };
  // --- END OF LOGIC ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
        <p className="mt-4 text-slate-600 font-medium tracking-wide">Preparing shipment form...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Dynamic Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </Link>
              <div className="hidden md:block h-6 w-[1px] bg-slate-200"></div>
              <div className="hidden md:flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-100">
                  <Box className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-slate-900 tracking-tight uppercase text-xs">New Shipment</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active User</span>
                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                title="Logout Account"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Hero Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <PackagePlus className="w-3 h-3" />
                Logistics Module
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tambah Paket Baru</h1>
              <p className="text-slate-500 mt-2 font-medium text-lg">Lengkapi detail informasi pengiriman di bawah ini untuk memulai proses logistik.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Container */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-600"></div>
              
              <div className="p-8 md:p-12">
                <FormData />
              </div>
            </div>
          </div>

          {/* Sidebar Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Keamanan Terjamin</h3>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Setiap paket yang Anda daftarkan akan mendapatkan nomor resi unik untuk pelacakan real-time hingga ke tangan penerima.
              </p>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Truck className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <HelpCircle className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
                <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                  Tim support kami siap membantu kendala teknis dalam pengisian form pengiriman Anda 24/7.
                </p>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  Contact Support
                </button>
              </div>
            </div>

            <div className="px-6">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                 VeloxExpress System v2.0
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}