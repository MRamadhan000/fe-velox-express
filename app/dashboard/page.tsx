"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, LogOut, Package, Search, BarChart3 } from "lucide-react";
import { authUtils } from "@/app/utils/auth";
import { authService } from "@/app/services/auth_service";

export default function UserDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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

        // Jika user adalah admin, redirect ke admin dashboard
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need to login to access this page.</p>
          <a
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
                <p className="text-sm text-gray-600">VeloxExpress User Panel</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-600">User • {user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Last login: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Search className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/packet"
              className="flex items-center gap-3 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
            >
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Tambah Paket</span>
                <p className="text-sm text-gray-600">Kirim paket baru</p>
              </div>
            </Link>

            <Link
              href="/shipments"
              className="flex items-center gap-3 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Cek Shipments</span>
                <p className="text-sm text-gray-600">Lihat status pengiriman</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
