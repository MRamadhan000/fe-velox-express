"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authUtils } from '@/app/utils/auth';
import { authService } from '@/app/services/auth_service';
import { 
  LogOut, Shield, User, Settings, BarChart3, Package, 
  Truck, Users, Activity, ChevronRight, Bell
} from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authUtils.getToken();
      if (!token) {
        window.location.href = '/auth/admin/login';
        return;
      }

      try {
        const profile = await authService.getProfile();
        if (profile.user.role !== 'admin') {
          window.location.href = '/dashboard';
          return;
        }
        setUser(profile.user);
      } catch (error) {
        console.error('Failed to get profile:', error);
        authUtils.removeToken();
        window.location.href = '/auth/admin/login';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    authUtils.removeToken();
    window.location.href = '/auth/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-red-600"></div>
          <p className="mt-4 text-slate-600 font-medium animate-pulse">Initializing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Velox<span className="text-red-600">Admin</span></h1>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">System Online</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="p-2 text-slate-400 hover:text-slate-600 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 mb-10 shadow-2xl">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-red-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-orange-400 rounded-2xl flex items-center justify-center shadow-inner">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-slate-900 w-8 h-8 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    Welcome back, {user.name.split(' ')[0]}!
                  </h2>
                  <p className="text-slate-400 font-medium">{user.email}</p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider">
                    Super Administrator
                  </div>
                </div>
              </div>
              
              <div className="text-right hidden md:block border-l border-white/10 pl-8">
                <p className="text-slate-500 text-xs font-bold uppercase">System Status</p>
                <p className="text-white font-mono text-lg font-bold">STABLE</p>
                <p className="text-slate-500 text-[10px] mt-1 italic">Last Refreshed: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
                { label: 'Total Shipments', val: '1,284', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Drivers', val: '42', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'System Reach', val: '98.2%', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Total Users', val: '850', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                    <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 text-sm font-semibold">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stat.val}</p>
                </div>
            ))}
        </div>

        {/* Action Grid */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Control Center</h3>
                <p className="text-slate-500 font-medium">Manage your logistics ecosystem efficiently</p>
            </div>
            <BarChart3 className="w-8 h-8 text-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/drivers"
              className="group flex flex-col p-6 bg-slate-50 border border-slate-200 rounded-[2rem] hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-bold text-slate-900 group-hover:text-white text-lg">Manage Drivers</span>
              <p className="text-slate-500 group-hover:text-blue-100 text-sm mt-2">Registration and performance tracking</p>
              <ChevronRight className="w-5 h-5 mt-6 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all" />
            </Link>

            <Link
              href="/admin/shipments"
              className="group flex flex-col p-6 bg-slate-50 border border-slate-200 rounded-[2rem] hover:bg-purple-600 hover:border-purple-600 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-bold text-slate-900 group-hover:text-white text-lg">Shipment Center</span>
              <p className="text-slate-500 group-hover:text-purple-100 text-sm mt-2">Real-time tracking and dispatch</p>
              <ChevronRight className="w-5 h-5 mt-6 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all" />
            </Link>

            <Link
              href="/admin/packets"
              className="group flex flex-col p-6 bg-slate-50 border border-slate-200 rounded-[2rem] hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="font-bold text-slate-900 group-hover:text-white text-lg">Manage Packets</span>
              <p className="text-slate-500 group-hover:text-emerald-100 text-sm mt-2">Create and manage delivery packets</p>
              <ChevronRight className="w-5 h-5 mt-6 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}