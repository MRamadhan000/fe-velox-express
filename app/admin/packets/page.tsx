"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { packetService } from '@/app/services/packet_service';
import { authUtils } from '@/app/utils/auth';
import { authService } from '@/app/services/auth_service';
import { PacketPayload } from '@/app/types/packet';
import {
  Package, Plus, Edit, Trash2, Search, Loader2, AlertCircle,
  CheckCircle, X, User, Phone, MapPin, Scale, ArrowLeft, ChevronRight, MoreVertical, Upload
} from 'lucide-react';

interface Packet {
  id: number;
  uuid: string;
  receipt_number: string;
  sender_name: string;
  sender_phone: string;
  pickup_address: string;
  receiver_name: string;
  receiver_phone: string;
  destination_address: string;
  weight: number;
  packet_image: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export default function AdminPacketsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPacket, setEditingPacket] = useState<Packet | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packetToDelete, setPacketToDelete] = useState<Packet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<PacketPayload>({
    sender_name: '',
    sender_phone: '',
    pickup_address: '',
    receiver_name: '',
    receiver_phone: '',
    destination_address: '',
    weight: 0,
    packet_image: null
  });

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
        await fetchPackets();
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

  const fetchPackets = async () => {
    try {
      const data = await packetService.getAllPacketsAdmin();
      setPackets(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch packets');
    }
  };

  const filteredPackets = packets.filter(packet =>
    packet.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    packet.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    packet.receiver_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      sender_name: '',
      sender_phone: '',
      pickup_address: '',
      receiver_name: '',
      receiver_phone: '',
      destination_address: '',
      weight: 0,
      packet_image: null
    });
    setEditingPacket(null);
  };

  const openModal = (packet?: Packet) => {
    if (packet) {
      setEditingPacket(packet);
      setFormData({
        sender_name: packet.sender_name,
        sender_phone: packet.sender_phone,
        pickup_address: packet.pickup_address,
        receiver_name: packet.receiver_name,
        receiver_phone: packet.receiver_phone,
        destination_address: packet.destination_address,
        weight: packet.weight,
        packet_image: null // Keep existing image
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    const submitData = new FormData();
    submitData.append('sender_name', formData.sender_name);
    submitData.append('sender_phone', formData.sender_phone);
    submitData.append('pickup_address', formData.pickup_address);
    submitData.append('receiver_name', formData.receiver_name);
    submitData.append('receiver_phone', formData.receiver_phone);
    submitData.append('destination_address', formData.destination_address);
    submitData.append('weight', formData.weight.toString());
    if (formData.packet_image) {
      submitData.append('packet_image', formData.packet_image);
    }

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    if (editingPacket) {
      console.log('Updating packet:', editingPacket.id);
      if (formData.packet_image) {
        await packetService.update(editingPacket.id, submitData, true);
      } else {
        // Convert FormData to object for JSON request
        const jsonData = {
          sender_name: formData.sender_name,
          sender_phone: formData.sender_phone,
          pickup_address: formData.pickup_address,
          receiver_name: formData.receiver_name,
          receiver_phone: formData.receiver_phone,
          destination_address: formData.destination_address,
          weight: formData.weight
        };
        await packetService.update(editingPacket.id, jsonData, false);
      }
      setSuccess('Packet updated successfully');
    } else {
      await packetService.store(submitData);
      setSuccess('Packet created successfully');
    }

    await fetchPackets();
    closeModal();
  } catch (error: any) {
    console.error('Submit error:', error);
    setError(error.message || 'Failed to save packet');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleDelete = async () => {
    if (!packetToDelete) return;

    setIsSubmitting(true);
    try {
      await packetService.delete(packetToDelete.id);
      setSuccess('Packet deleted successfully');
      await fetchPackets();
      setShowDeleteModal(false);
      setPacketToDelete(null);
    } catch (error: any) {
      setError(error.message || 'Failed to delete packet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, packet_image: file }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
        <p className="mt-4 text-slate-600 font-medium tracking-wide">Loading Packets...</p>
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
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Packet Management</p>
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
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header with Search and Add Button */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Packet Management</h2>
              <p className="text-slate-600 font-medium">Manage all delivery packets in the system</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search packets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add Packet
              </button>
            </div>
          </div>
        </div>

        {/* Packets Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-100/50 overflow-hidden">
          {filteredPackets.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No packets found</h3>
              <p className="text-slate-600 mb-6">Get started by adding your first delivery packet</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Packet
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Receipt</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Sender</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Receiver</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Weight</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Created</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPackets.map((packet) => (
                    <tr key={packet.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-blue-600 uppercase tracking-tighter mb-1">Receipt ID</span>
                          <span className="text-slate-900 font-bold font-mono tracking-tight">{packet.receipt_number}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 leading-none">{packet.sender_name}</span>
                          <span className="text-xs text-slate-500 leading-none mt-1">{packet.sender_phone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 leading-none">{packet.receiver_name}</span>
                          <span className="text-xs text-slate-500 leading-none mt-1">{packet.receiver_phone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-slate-900">{packet.weight} kg</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{new Date(packet.created_at).toLocaleDateString()}</span>
                          <span className="text-[10px] font-medium text-slate-400">{new Date(packet.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openModal(packet)}
                            className="p-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group-hover:shadow-md active:scale-95"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => {
                              setPacketToDelete(packet);
                              setShowDeleteModal(true);
                            }}
                            className="p-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all group-hover:shadow-md active:scale-95"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{editingPacket ? 'Edit Packet' : 'Add New Packet'}</h3>
                <p className="text-sm text-slate-400 font-medium">{editingPacket ? `Editing ${editingPacket.receipt_number}` : 'Create a new delivery packet'}</p>
              </div>
              <button onClick={closeModal} className="p-2.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Sender Information
                  </h4>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Sender Name</label>
                    <input
                      type="text"
                      value={formData.sender_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, sender_name: e.target.value }))}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Sender Phone</label>
                    <input
                      type="tel"
                      value={formData.sender_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, sender_phone: e.target.value }))}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Pickup Address</label>
                    <textarea
                      value={formData.pickup_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, pickup_address: e.target.value }))}
                      rows={3}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Receiver Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Receiver Information
                  </h4>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Receiver Name</label>
                    <input
                      type="text"
                      value={formData.receiver_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, receiver_name: e.target.value }))}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Receiver Phone</label>
                    <input
                      type="tel"
                      value={formData.receiver_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, receiver_phone: e.target.value }))}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Destination Address</label>
                    <textarea
                      value={formData.destination_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination_address: e.target.value }))}
                      rows={3}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Package Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Package Image</label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="packet_image"
                      />
                      <label
                        htmlFor="packet_image"
                        className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="font-bold text-slate-700">
                          {formData.packet_image ? formData.packet_image.name : 'Choose image...'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[1.5] px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editingPacket ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {editingPacket ? 'Update Packet' : 'Create Packet'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && packetToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Delete Packet</h3>
                  <p className="text-sm text-slate-400 font-medium">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <p className="text-slate-700 font-medium mb-6">
                Are you sure you want to delete packet <span className="font-bold text-slate-900">{packetToDelete.receipt_number}</span>?
                This will permanently remove the packet and cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 disabled:opacity-50 shadow-xl shadow-red-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
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