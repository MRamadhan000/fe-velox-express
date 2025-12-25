"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { shipmentService, Shipment } from '@/app/services/shipment_service';
import { driverService, Driver } from '@/app/services/driver_service';
import { authUtils } from '@/app/utils/auth';
import { authService } from '@/app/services/auth_service';
import {
  Truck, Package, User, Search, Loader2, AlertCircle,
  CheckCircle, Clock, ArrowLeft, Edit, Save, X, 
  MapPin, Calendar, Scale, ChevronRight, Trash2
} from 'lucide-react';

export default function AdminShipmentsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

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
        if (profile.user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setUser(profile.user);
        await Promise.all([fetchShipments(), fetchDrivers()]);
      } catch (error) {
        console.error('Failed to get profile:', error);
        authUtils.removeToken();
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchShipments = async () => {
    try {
      const data = await shipmentService.getAllShipments();
      setShipments(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch shipments');
    }
  };

  const fetchDrivers = async () => {
    try {
      const data = await driverService.getAllDrivers();
      setDrivers(data);
    } catch (error: any) {
      console.error('Failed to fetch drivers:', error);
    }
  };

  const validateDriverCapacity = (driverId: number | null, shipment: Shipment): boolean => {
    if (!driverId) return true;
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return false;
    return driver.current_capacity >= shipment.packet.weight;
  };

  const handleUpdateShipment = async () => {
    if (!selectedShipment) return;

    if (selectedDriver && !validateDriverCapacity(selectedDriver, selectedShipment)) {
      const driver = drivers.find(d => d.id === selectedDriver);
      setModalError(`Driver ${driver?.driver_name} doesn't have enough capacity. Required: ${selectedShipment.packet.weight}kg, Available: ${driver?.current_capacity}kg`);
      return;
    }

    setUpdating(true);
    setModalError(null);

    try {
      await shipmentService.updateShipmentStatusAndDriver(
        selectedShipment.id,
        selectedStatus,
        selectedDriver
      );

      await fetchShipments();
      setShowDriverModal(false);
      setSelectedShipment(null);
      setSelectedDriver(null);
      setSelectedStatus('');
    } catch (error: any) {
      if (error.message.includes('Kapasitas Driver') || error.message.includes('kapasitas')) {
        setModalError(error.message);
      } else {
        setError(error.message || 'Failed to update shipment');
        setShowDriverModal(false);
        setSelectedShipment(null);
        setSelectedDriver(null);
        setSelectedStatus('');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteShipment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this shipment? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      await shipmentService.deleteShipment(id);
      await fetchShipments();
    } catch (error: any) {
      setError(error.message || 'Failed to delete shipment');
    } finally {
      setDeleting(null);
    }
  };

  const openDriverModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setSelectedDriver(shipment.driver_id);
    setSelectedStatus(shipment.status);
    setShowDriverModal(true);
  };

  const closeDriverModal = () => {
    setShowDriverModal(false);
    setSelectedShipment(null);
    setSelectedDriver(null);
    setSelectedStatus('');
    setModalError(null);
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.packet.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.packet.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.packet.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shipment.driver?.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );
  // --- END OF LOGIC ---

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10';
      case 'Pickup':
        return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100 ring-slate-500/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
        <p className="mt-4 text-slate-600 font-medium tracking-wide">Accessing Shipment Logs...</p>
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
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Velox<span className="text-blue-600">Admin</span></h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Logistics Control</p>
              </div>
            </div>
            
            <Link
              href="/admin/dashboard"
              className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shipment Manifest</h2>
            <p className="text-slate-500 mt-2 font-medium">Monitor active deliveries, assign logistical personnel, and track fulfillment status across the network.</p>
            
            <div className="relative mt-6 group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by receipt, names, status or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
              />
            </div>
          </div>
          
          <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-4 py-2 text-center border-r border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400">Total</p>
              <p className="text-xl font-bold text-slate-900">{shipments.length}</p>
            </div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black uppercase text-blue-500">Active</p>
              <p className="text-xl font-bold text-blue-600">{shipments.filter(s => s.status !== 'Delivered').length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Desktop Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {filteredShipments.length === 0 ? (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Records Found</h3>
              <p className="text-slate-500 mt-2 font-medium">No shipments match your current filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Shipment Info</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Route Details</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Driver Assignment</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Created At</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-blue-600 uppercase tracking-tighter mb-1">Receipt ID</span>
                          <span className="text-slate-900 font-bold font-mono tracking-tight">{shipment.packet.receipt_number}</span>
                          <div className="flex items-center gap-1.5 mt-2 text-slate-500">
                             <Scale className="w-3.5 h-3.5" />
                             <span className="text-xs font-bold">{shipment.packet.weight} kg</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ring-1 ${getStatusStyles(shipment.status)}`}>
                          {shipment.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                          {shipment.status === 'Pickup' && <Truck className="w-3.5 h-3.5" />}
                          {shipment.status === 'Delivered' && <CheckCircle className="w-3.5 h-3.5" />}
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ring-4 ring-slate-100"></div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase leading-none mb-1">Sender</p>
                                <p className="text-sm font-bold text-slate-800 leading-none">{shipment.packet.sender_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase leading-none mb-1">Receiver</p>
                                <p className="text-sm font-bold text-slate-800 leading-none">{shipment.packet.receiver_name}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {shipment.driver ? (
                          <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-xl w-fit pr-4 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                              {shipment.driver.driver_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 leading-none">{shipment.driver.driver_name}</p>
                              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{shipment.driver.driver_license_number}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs font-bold italic bg-slate-100 px-3 py-1.5 rounded-lg border border-dashed border-slate-200">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-700">{new Date(shipment.created_at).toLocaleDateString()}</span>
                           <span className="text-[10px] font-medium text-slate-400">{new Date(shipment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openDriverModal(shipment)}
                            className="p-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group-hover:shadow-md active:scale-95"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteShipment(shipment.id)}
                            disabled={deleting === shipment.id}
                            className="p-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all group-hover:shadow-md active:scale-95 disabled:opacity-50"
                          >
                            {deleting === shipment.id ? (
                              <Loader2 className="w-4.5 h-4.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-4.5 h-4.5" />
                            )}
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

      {/* Driver Assignment Modal */}
      {showDriverModal && selectedShipment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
               <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Shipment Controls</h3>
                  <p className="text-sm text-slate-400 font-medium">Managing Receipt: {selectedShipment.packet.receipt_number}</p>
               </div>
               <button onClick={closeDriverModal} className="p-2.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-8 space-y-6">
              {/* Info Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 grid grid-cols-2 gap-4">
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Sender</p>
                    <p className="text-sm font-bold text-slate-800">{selectedShipment.packet.sender_name}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Receiver</p>
                    <p className="text-sm font-bold text-slate-800">{selectedShipment.packet.receiver_name}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Weight Load</p>
                    <p className="text-sm font-black text-blue-600">{selectedShipment.packet.weight} KG</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Current Status</p>
                    <p className="text-sm font-bold text-slate-800">{selectedShipment.status}</p>
                 </div>
              </div>

              {modalError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in shake-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-700 leading-relaxed">{modalError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Logistics Personnel</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={selectedDriver || ''}
                      onChange={(e) => setSelectedDriver(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                    >
                      <option value="">-- No Personnel Assigned --</option>
                      {drivers.map((driver) => {
                        const hasCapacity = selectedShipment ? driver.current_capacity >= selectedShipment.packet.weight : true;
                        return (
                          <option
                            key={driver.id}
                            value={driver.id}
                            disabled={!hasCapacity}
                          >
                            {driver.driver_name} (Avail: {driver.current_capacity}kg) {!hasCapacity ? ' - INSUFFICIENT' : ''}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Workflow Status</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeDriverModal}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateShipment}
                  disabled={updating}
                  className="flex-[1.5] px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}