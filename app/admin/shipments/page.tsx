"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { shipmentService, Shipment } from '@/app/services/shipment_service';
import { driverService, Driver } from '@/app/services/driver_service';
import { authUtils } from '@/app/utils/auth';
import { authService } from '@/app/services/auth_service';
import {
  Truck,
  Package,
  User,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Edit,
  Save,
  X
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
    if (!driverId) return true; // No driver selected is valid

    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return false;

    // Check if driver has enough capacity for the packet
    return driver.current_capacity >= shipment.packet.weight;
  };

  const handleUpdateShipment = async () => {
    if (!selectedShipment) return;

    // Frontend validation for driver capacity
    if (selectedDriver && !validateDriverCapacity(selectedDriver, selectedShipment)) {
      const driver = drivers.find(d => d.id === selectedDriver);
      setModalError(`Driver ${driver?.driver_name} doesn't have enough capacity. Required: ${selectedShipment.packet.weight}kg, Available: ${driver?.current_capacity}kg`);
      return;
    }

    setUpdating(true);
    setModalError(null); // Clear previous modal errors

    try {
      await shipmentService.updateShipmentStatusAndDriver(
        selectedShipment.id,
        selectedStatus,
        selectedDriver
      );

      await fetchShipments(); // Refresh data
      setShowDriverModal(false);
      setSelectedShipment(null);
      setSelectedDriver(null);
      setSelectedStatus('');
    } catch (error: any) {
      // Handle validation errors in modal
      if (error.message.includes('Kapasitas Driver') || error.message.includes('kapasitas')) {
        setModalError(error.message);
      } else {
        // For other errors, show in main error state and close modal
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pickup':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Pickup':
        return <Truck className="w-4 h-4" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
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
                <h1 className="text-xl font-bold text-gray-900">VeloxExpress Admin</h1>
                <p className="text-sm text-gray-500">Shipment Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Link
                href="/admin/dashboard"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Manage Shipments</h2>
              <p className="text-gray-600 mt-2">Assign drivers and manage all shipments</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search shipments by receipt number, sender, receiver, status, or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Shipments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading shipments...</p>
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No shipments found matching your search.' : 'No shipments found.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-blue-600 mr-3" />
                          <span className="font-semibold text-gray-900">{shipment.packet.receipt_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p className="font-medium text-gray-900">{shipment.packet.sender_name}</p>
                          <p>{shipment.packet.sender_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p className="font-medium text-gray-900">{shipment.packet.receiver_name}</p>
                          <p>{shipment.packet.receiver_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{shipment.packet.weight}kg</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {shipment.driver?.driver_name || 'No driver assigned'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p>{new Date(shipment.created_at).toLocaleDateString()}</p>
                          <p className="text-xs">{new Date(shipment.created_at).toLocaleTimeString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openDriverModal(shipment)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Driver Assignment Modal */}
      {showDriverModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Shipment</h3>
              <button
                onClick={closeDriverModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Shipment Details</h4>
                <p className="text-sm text-gray-600">
                  <strong>Receipt:</strong> {selectedShipment.packet.receipt_number}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>From:</strong> {selectedShipment.packet.sender_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>To:</strong> {selectedShipment.packet.receiver_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Current Status:</strong> {selectedShipment.status}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Weight:</strong> {selectedShipment.packet.weight}kg
                </p>
              </div>

              {/* Modal Error Message */}
              {modalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700">{modalError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Driver
                  </label>
                  <select
                    value={selectedDriver || ''}
                    onChange={(e) => setSelectedDriver(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">No Driver</option>
                    {drivers.map((driver) => {
                      const hasCapacity = selectedShipment ? driver.current_capacity >= selectedShipment.packet.weight : true;
                      return (
                        <option
                          key={driver.id}
                          value={driver.id}
                          disabled={!hasCapacity}
                          className={!hasCapacity ? 'text-red-500' : ''}
                        >
                          {driver.driver_name} (License: {driver.driver_license_number}) - Capacity: {driver.current_capacity}kg
                          {!hasCapacity && selectedShipment && ' ⚠️ Insufficient capacity'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDriverModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateShipment}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Shipment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}