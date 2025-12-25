"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { authUtils } from "@/app/utils/auth";
import { authService } from "@/app/services/auth_service";
import { packetService } from "@/app/services/packet_service";
import {
  Truck,
  Package,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Calendar,
  Weight,
  Hash,
  ChevronRight,
  Clock,
  ExternalLink
} from "lucide-react";

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

export default function PacketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const packetId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [packet, setPacket] = useState<Packet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIC TETAP SAMA ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = authUtils.getToken();
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const profile = await authService.getProfile();
        if (profile.user.role !== "user") {
          router.push("/admin/dashboard");
          return;
        }
        setUser(profile.user);
        await fetchPacketDetail();
      } catch (error) {
        console.error("Failed to get profile:", error);
        authUtils.removeToken();
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, packetId]);

  const fetchPacketDetail = async () => {
    try {
      const packetData = await packetService.getById(parseInt(packetId));
      setPacket(packetData);
    } catch (error: any) {
      setError(error.message || "Failed to fetch packet details");
    }
  };
  // --- END OF LOGIC ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Fetching detail...</p>
      </div>
    );
  }

  if (!user || !packet) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar Premium */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/shipments" className="p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="h-6 w-[1px] bg-slate-200"></div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Manifest Details</h1>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Order Tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-600">{user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3 animate-bounce">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visual & Status Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 overflow-hidden group">
              <div className="aspect-square bg-slate-50 rounded-[2rem] flex items-center justify-center overflow-hidden border border-slate-100 relative">
                {packet.packet_image ? (
                  <img
                    src={`http://127.0.0.1:8001${packet.packet_image}`}
                    alt="Package"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Image Captured</p>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <Weight className="w-3 h-3" /> {packet.weight} KG
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Truck className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Receipt Number</p>
                  <h2 className="text-3xl font-black tracking-tighter mb-6">{packet.receipt_number}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <p className="text-xs font-medium">Manifest created at {new Date(packet.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Detailed Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Sender & Receiver Card */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Logistics Route</h3>
                </div>

                <div className="relative space-y-12">
                  {/* Decorative Vertical Line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 border-l-2 border-dashed border-slate-200"></div>

                  {/* Sender Section */}
                  <div className="relative flex gap-6">
                    <div className="z-10 w-10 h-10 bg-white border-4 border-blue-600 rounded-full flex-shrink-0"></div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Origin / Sender</span>
                      <h4 className="font-black text-slate-900 text-lg leading-none mb-2">{packet.sender_name}</h4>
                      <div className="space-y-2 mt-3">
                         <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                           <Phone className="w-3.5 h-3.5 text-blue-500" /> {packet.sender_phone}
                         </p>
                         <p className="text-sm font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           {packet.pickup_address}
                         </p>
                      </div>
                    </div>
                  </div>

                  {/* Receiver Section */}
                  <div className="relative flex gap-6">
                    <div className="z-10 w-10 h-10 bg-white border-4 border-emerald-500 rounded-full flex-shrink-0"></div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Destination / Receiver</span>
                      <h4 className="font-black text-slate-900 text-lg leading-none mb-2">{packet.receiver_name}</h4>
                      <div className="space-y-2 mt-3">
                         <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                           <Phone className="w-3.5 h-3.5 text-emerald-500" /> {packet.receiver_phone}
                         </p>
                         <p className="text-sm font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           {packet.destination_address}
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Date</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(packet.created_at).toLocaleDateString()}</p>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System UUID</p>
                    <p className="text-[10px] font-mono font-bold text-slate-900 truncate max-w-[120px]">{packet.uuid}</p>
                  </div>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/shipments"
                className="flex-1 bg-white text-slate-900 font-black text-xs uppercase tracking-widest py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Fleet
              </Link>
              <Link
                href="/packet"
                className="flex-1 bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95"
              >
                <Package className="w-4 h-4" />
                New Packet
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}