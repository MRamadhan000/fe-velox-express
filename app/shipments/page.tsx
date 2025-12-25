"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { shipmentService, Shipment } from '@/app/services/shipment_service';
import { authUtils } from '@/app/utils/auth';
import { authService } from '@/app/services/auth_service';
import {
  Truck,
  Package,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  Filter,
  PackagePlus,
  CalendarDays
} from 'lucide-react';

export default function ShipmentsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // --- LOGIC TETAP SAMA ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = authUtils.getToken();
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const profile = await authService.getProfile();
        if (profile.user.role !== 'user') {
          router.push('/admin/dashboard');
          return;
        }
        setUser(profile.user);
        await fetchShipments();
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
      const data = await shipmentService.getUserShipments();
      setShipments(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch shipments');
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.packet.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.packet.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.packet.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // --- END OF LOGIC ---

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100 ring-amber-500/10';
      case 'Pickup':
        return 'bg-blue-50 text-blue-600 border-blue-100 ring-blue-500/10';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/10';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100 ring-slate-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3.5 h-3.5" />;
      case 'Pickup': return <Truck className="w-3.5 h-3.5" />;
      case 'Delivered': return <CheckCircle className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
          <Package className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-500 font-bold tracking-widest text-xs uppercase">Retrieving Shipments</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Track Shipments</h1>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">VeloxExpress</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</span>
                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <span className="text-slate-600 font-black text-xs">{user?.name?.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Shipments</h2>
            <p className="text-slate-500 font-medium mt-1">You have {shipments.length} total deliveries registered.</p>
          </div>
          <Link
            href="/packet"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 text-sm"
          >
            <PackagePlus className="w-4 h-4" />
            New Delivery
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative mb-8 group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search by receipt number, names, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <Filter className="w-5 h-5 text-slate-300" />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Shipments Display */}
        {filteredShipments.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No shipments found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">
              {searchTerm ? 'Try adjusting your search terms to find what you are looking for.' : 'Start by adding your first shipment package.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Table Header (Hidden on Mobile) */}
            <div className="hidden md:grid grid-cols-12 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <div className="col-span-4">Package Details</div>
              <div className="col-span-3">Shipment Status</div>
              <div className="col-span-3">Date Registered</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {/* List Items */}
            {filteredShipments.map((shipment) => (
              <div 
                key={shipment.id} 
                className="group bg-white rounded-[2rem] border border-slate-100 p-6 md:p-4 md:px-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all md:grid md:grid-cols-12 md:items-center gap-4"
              >
                <div className="col-span-4 flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-blue-100">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Receipt No.</p>
                    <h4 className="font-black text-slate-900 tracking-tight">{shipment.packet.receipt_number}</h4>
                  </div>
                </div>

                <div className="col-span-3 mb-4 md:mb-0">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border ring-4 ring-transparent transition-all ${getStatusStyles(shipment.status)}`}>
                    {getStatusIcon(shipment.status)}
                    {shipment.status.toUpperCase()}
                  </span>
                </div>

                <div className="col-span-3 flex items-center gap-3 text-slate-500 mb-6 md:mb-0">
                  <CalendarDays className="w-4 h-4 text-slate-300" />
                  <div className="text-sm font-bold">
                    <p className="text-slate-900 leading-none">{new Date(shipment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(shipment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="col-span-2 text-right flex items-center justify-between md:justify-end gap-4">
                  <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-widest">Details</span>
                  <Link
                    href={`/packet/${shipment.packet.id}`}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-blue-600 transition-all group/btn shadow-lg shadow-slate-200"
                  >
                    View Info
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Bottom Support */}
        <div className="mt-10 flex justify-center">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">All systems operational • Encrypted Tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}