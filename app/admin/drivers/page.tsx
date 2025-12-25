"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { driverService, Driver, CreateDriverData, UpdateDriverData } from '@/app/services/driver_service';
import { authUtils } from '@/app/utils/auth';
import { authService } from '@/app/services/auth_service';
import {
  Truck, Plus, Edit, Trash2, Search, Loader2, AlertCircle,
  CheckCircle, X, User, CreditCard, Package, ArrowLeft, ChevronRight, MoreVertical
} from 'lucide-react';

export default function AdminDriversPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    driver_name: '',
    driver_license_number: '',
    current_capacity: 0
  });

  // --- LOGIC TETAP SAMA (TIDAK DIUBAH) ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = authUtils.getToken();
      if (!token) {
        router.push('/auth/admin/login');
        return;
      }
      try {
        const profile = await authService.getProfile();
        if (profile.user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setUser(profile.user);
      } catch (error) {
        console.error('Failed to get profile:', error);
        authUtils.removeToken();
        router.push('/auth/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDrivers();
    }
  }, [user]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await driverService.getAllDrivers();
      setDrivers(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.driver_license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingDriver(null);
    setFormData({ driver_name: '', driver_license_number: '', current_capacity: 0 });
    setShowModal(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      driver_name: driver.driver_name,
      driver_license_number: driver.driver_license_number,
      current_capacity: driver.current_capacity
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDriver(null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      if (editingDriver) {
        const updateData: UpdateDriverData = {
          driver_name: formData.driver_name,
          driver_license_number: formData.driver_license_number,
          current_capacity: formData.current_capacity
        };
        await driverService.updateDriver(editingDriver.id, updateData);
        setSuccess('Driver updated successfully!');
      } else {
        const createData: CreateDriverData = {
          driver_name: formData.driver_name,
          driver_license_number: formData.driver_license_number,
          current_capacity: formData.current_capacity
        };
        await driverService.createDriver(createData);
        setSuccess('Driver created successfully!');
      }
      await fetchDrivers();
      setTimeout(() => { closeModal(); }, 1500);
    } catch (error: any) {
      setError(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (driver: Driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!driverToDelete) return;
    try {
      await driverService.deleteDriver(driverToDelete.id);
      setSuccess('Driver deleted successfully!');
      await fetchDrivers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to delete driver');
      setTimeout(() => setError(null), 3000);
    } finally {
      setShowDeleteModal(false);
      setDriverToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDriverToDelete(null);
  };
  // --- END OF LOGIC ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
        <p className="mt-4 text-slate-600 font-medium">Synchronizing Driver Database...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-100">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Driver <span className="text-blue-600">Assets</span></h1>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Fleet Management System</p>
              </div>
            </div>
            
            <Link
              href="/admin/dashboard"
              className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Panel
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome & Search Bar Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Fleet Directory</h2>
            <p className="text-slate-500 mt-2 font-medium">Manage your logistical personnel, verify licenses, and monitor cargo capacities in real-time.</p>
            
            <div className="relative mt-6 group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Find driver by name or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700"
              />
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 font-bold"
          >
            <Plus className="w-5 h-5" />
            Register New Driver
          </button>
        </div>

        {/* Feedback Alerts */}
        {(error || success) && (
          <div className={`mb-8 animate-in fade-in slide-in-from-top-4 duration-300`}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 flex items-center gap-3 shadow-sm">
                <CheckCircle className="w-5 h-5" />
                <p className="font-semibold">{success}</p>
              </div>
            )}
          </div>
        )}

        {/* Table/Content Area */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden transition-all">
          {filteredDrivers.length === 0 ? (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Personnel Found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search or add a new driver to the fleet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-500">Driver Information</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-500">Identity Details</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-500">Cargo Capacity</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors font-bold text-lg">
                            {driver.driver_name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-slate-900 font-bold">{driver.driver_name}</div>
                            <div className="text-xs text-slate-500 font-medium tracking-wide">Registered {new Date(driver.created_at || '').toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-mono font-bold text-slate-700">{driver.driver_license_number}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${Math.min((driver.current_capacity / 50) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-slate-700">{driver.current_capacity} <span className="text-slate-400 font-medium text-xs uppercase ml-1 tracking-tighter font-sans">Units</span></span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(driver)}
                            className="p-2.5 bg-white border border-slate-200 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(driver)}
                            className="p-2.5 bg-white border border-slate-200 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* --- Modals (Logic Remains Same, UI Updated) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {editingDriver ? 'Update Profile' : 'Personnel Registration'}
                </h3>
                <p className="text-slate-500 text-sm mt-1">Fill in the required fleet information</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text" required value={formData.driver_name}
                    onChange={(e) => setFormData({...formData, driver_name: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 text-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="Enter driver's full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Driver's License (SIM)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text" required value={formData.driver_license_number}
                    onChange={(e) => setFormData({...formData, driver_license_number: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 text-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono font-bold"
                    placeholder="E.g. 9801234455"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Vehicle Capacity</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number" required min="0" value={formData.current_capacity}
                    onChange={(e) => setFormData({...formData, current_capacity: parseInt(e.target.value) || 0})}
                    className="w-full pl-11 pr-4 py-3.5 text-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingDriver ? 'Commit Changes' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation UI */}
      {showDeleteModal && driverToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] max-w-sm w-full p-8 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Remove Driver?</h3>
            <p className="text-slate-500 mt-2 font-medium">
              You are about to remove <span className="text-slate-900 font-bold underline decoration-red-200">{driverToDelete.driver_name}</span> from the fleet. This cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button onClick={cancelDelete} className="px-4 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-3.5 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}