"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { packetService } from '@/app/services/packet_service';
import { authUtils } from '@/app/utils/auth';
import { authService } from '@/app/services/auth_service';
import { PacketPayload } from '@/app/types/packet';
import {
  Package, ArrowLeft, Save, Loader2, AlertCircle, CheckCircle,
  X, Upload, User, Phone, MapPin, Scale, Image as ImageIcon
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

export default function EditPacketPage() {
  const router = useRouter();
  const params = useParams();
  const packetId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [packet, setPacket] = useState<Packet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const [currentImage, setCurrentImage] = useState<string>('');

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
        await fetchPacket();
      } catch (error) {
        console.error('Failed to get profile:', error);
        authUtils.removeToken();
        router.push('/auth/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, packetId]);

  const fetchPacket = async () => {
    try {
      const data = await packetService.getById(parseInt(packetId));
      setPacket(data);
      setCurrentImage(data.packet_image);

      // Populate form
      setFormData({
        sender_name: data.sender_name,
        sender_phone: data.sender_phone,
        pickup_address: data.pickup_address,
        receiver_name: data.receiver_name,
        receiver_phone: data.receiver_phone,
        destination_address: data.destination_address,
        weight: data.weight,
        packet_image: null // Will be set if user uploads new image
      });
    } catch (error: any) {
      setError(error.message || 'Failed to fetch packet');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const submitData = new FormData();

      // Only append non-empty fields
      if (formData.sender_name.trim()) submitData.append('sender_name', formData.sender_name.trim());
      if (formData.sender_phone.trim()) submitData.append('sender_phone', formData.sender_phone.trim());
      if (formData.pickup_address.trim()) submitData.append('pickup_address', formData.pickup_address.trim());
      if (formData.receiver_name.trim()) submitData.append('receiver_name', formData.receiver_name.trim());
      if (formData.receiver_phone.trim()) submitData.append('receiver_phone', formData.receiver_phone.trim());
      if (formData.destination_address.trim()) submitData.append('destination_address', formData.destination_address.trim());
      if (formData.weight > 0) submitData.append('weight', formData.weight.toString());

      if (formData.packet_image) {
        submitData.append('packet_image', formData.packet_image);
      }

      await packetService.update(parseInt(packetId), submitData);
      setSuccess('Packet updated successfully');

      // Redirect back to packets list after a short delay
      setTimeout(() => {
        router.push('/admin/packets');
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to update packet');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, packet_image: file }));
  };

  const handleInputChange = (field: keyof PacketPayload, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
        <p className="mt-4 text-slate-600 font-medium tracking-wide">Loading Packet...</p>
      </div>
    );
  }

  if (!user || !packet) return null;

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
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Edit Packet</p>
              </div>
            </div>

            <Link
              href="/admin/packets"
              className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Packets
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{success}</p>
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

        {/* Packet Info Header */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Packet</h2>
              <p className="text-slate-600 font-medium">Receipt: <span className="font-mono font-bold text-blue-600">{packet.receipt_number}</span></p>
            </div>
          </div>

          {/* Current Image Display */}
          {currentImage && (
            <div className="mb-6">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Current Image</h3>
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                <img
                  src={`http://localhost:8001${currentImage}`}
                  alt="Current packet image"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sender Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">Sender Information</h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Sender Name</label>
                <input
                  type="text"
                  value={formData.sender_name}
                  onChange={(e) => handleInputChange('sender_name', e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                  placeholder="Enter sender name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Sender Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.sender_phone}
                    onChange={(e) => handleInputChange('sender_phone', e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                    placeholder="Enter sender phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Pickup Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                  <textarea
                    value={formData.pickup_address}
                    onChange={(e) => handleInputChange('pickup_address', e.target.value)}
                    rows={3}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 resize-none"
                    placeholder="Enter pickup address"
                  />
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-black text-slate-900">Receiver Information</h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Receiver Name</label>
                <input
                  type="text"
                  value={formData.receiver_name}
                  onChange={(e) => handleInputChange('receiver_name', e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                  placeholder="Enter receiver name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Receiver Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.receiver_phone}
                    onChange={(e) => handleInputChange('receiver_phone', e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                    placeholder="Enter receiver phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Destination Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                  <textarea
                    value={formData.destination_address}
                    onChange={(e) => handleInputChange('destination_address', e.target.value)}
                    rows={3}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 resize-none"
                    placeholder="Enter destination address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-black text-slate-900">Package Details</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Weight (kg)</label>
                  <div className="relative">
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700"
                      placeholder="Enter weight"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-black text-slate-900">Package Image</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Upload New Image (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="packet-image"
                    />
                    <label
                      htmlFor="packet-image"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-600">Click to upload image</p>
                        <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
                      </div>
                    </label>
                  </div>
                  {formData.packet_image && (
                    <p className="text-sm text-green-600 font-medium">New image selected: {formData.packet_image.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8 pt-8 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Packet
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}