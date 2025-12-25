import axios from 'axios';
import { authUtils } from '@/app/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

export interface Packet {
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

export interface Driver {
  id: number;
  driver_name: string;
  driver_license_number: string;
  current_capacity: number;
}

export interface Shipment {
  id: number;
  packet_id: number;
  driver_id: number | null;
  status: string;
  shipped_at: string | null;
  created_at: string;
  updated_at: string;
  driver: Driver | null;
  packet: Packet;
}

class ShipmentService {
  async getUserShipments(): Promise<Shipment[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/shipments/user`, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user shipments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch shipments');
    }
  }

  async getShipmentById(id: number): Promise<Shipment> {
    try {
      const response = await axios.get(`${API_BASE_URL}/shipments/${id}`, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching shipment:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch shipment');
    }
  }

  async getAllShipments(): Promise<Shipment[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/shipments`, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all shipments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch shipments');
    }
  }

  async updateShipmentDriver(id: number, driverId: number | null): Promise<Shipment> {
    try {
      const response = await axios.put(`${API_BASE_URL}/shipments/${id}/status-driver`, {
        driver_id: driverId
      }, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating shipment driver:', error);
      throw new Error(error.response?.data?.message || 'Failed to update shipment driver');
    }
  }

  async updateShipmentStatus(id: number, status: string): Promise<Shipment> {
    try {
      const response = await axios.put(`${API_BASE_URL}/shipments/${id}/status-driver`, {
        status: status
      }, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating shipment status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update shipment status');
    }
  }

  async updateShipmentStatusAndDriver(id: number, status: string, driverId: number | null): Promise<Shipment> {
    try {
      const response = await axios.put(`${API_BASE_URL}/shipments/${id}/status-driver`, {
        status: status,
        driver_id: driverId
      }, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating shipment status and driver:', error);

      // Handle specific backend error messages
      if (error.response?.status === 400 && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      // Handle other error cases
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to update shipment');
    }
  }
}

export const shipmentService = new ShipmentService();