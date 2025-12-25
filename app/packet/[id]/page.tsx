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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || !packet) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  VeloxExpress
                </h1>
                <p className="text-sm text-gray-500">Package Details</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <Link
                href="/shipments"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Shipments
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Package Details
              </h2>
              <p className="text-gray-600 mt-1">
                Receipt: {packet.receipt_number}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Package Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Package Information
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Package Image */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Package Image
                </h4>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                  {packet.packet_image ? (
                    <img
                      src={`http://127.0.0.1:8001${packet.packet_image}`}
                      alt="Package"
                      className="max-w-full max-h-48 object-contain rounded"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>No image available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Details */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Package Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Receipt Number</p>
                    <p className="font-semibold text-gray-900">
                      {packet.receipt_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold text-gray-900">
                      {packet.weight} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(packet.created_at).toLocaleDateString()} at{" "}
                      {new Date(packet.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(packet.updated_at).toLocaleDateString()} at{" "}
                      {new Date(packet.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sender Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Sender Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">
                        {packet.sender_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {packet.sender_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Address</p>
                      <p className="font-semibold text-gray-900 flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {packet.pickup_address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Receiver Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Receiver Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">
                        {packet.receiver_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {packet.receiver_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Destination Address
                      </p>
                      <p className="font-semibold text-gray-900 flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {packet.destination_address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/shipments"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shipments
          </Link>
          <Link
            href="/packet"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Add New Package
          </Link>
        </div>
      </div>
    </div>
  );
}
