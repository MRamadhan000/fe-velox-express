"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { packetService } from '@/app/services/packet_service';
import { authUtils } from '@/app/utils/auth';
import { authService } from '@/app/services/auth_service';
import {
  Package, Edit, Search, Loader2, ArrowLeft
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
      console.error('Failed to fetch packets:', error);
    }
  };

  const filteredPackets = packets.filter(packet =>
    packet.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    packet.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    packet.receiver_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            </div>
          </div>
        </div>

        {/* Packets Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-100/50 overflow-hidden">
          {filteredPackets.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No packets found</h3>
              <p className="text-slate-600 mb-6">No delivery packets available at the moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Receipt</th>
                    <th className="px-8 py-5 text-[11px] uppercase tracking-[0.15em] font-black text-slate-400">Image</th>
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
                        {packet.packet_image ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                            <img
                              src={`http://localhost:8001${packet.packet_image}`}
                              alt="Packet"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.png'; // Fallback image
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                            <Package className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
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
                            onClick={() => router.push(`/admin/packets/edit/${packet.id}`)}
                            className="p-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group-hover:shadow-md active:scale-95"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          {/* <button
                            onClick={() => {
                              setPacketToDelete(packet);
                              setShowDeleteModal(true);
                            }}
                            className="p-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all group-hover:shadow-md active:scale-95"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button> */}
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
    </div>
  );
}