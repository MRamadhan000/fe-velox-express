import axios from 'axios';
import { authUtils } from '@/app/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

export interface Driver {
  id: number;
  driver_name: string;
  driver_license_number: string;
  current_capacity: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDriverData {
  driver_name: string;
  driver_license_number: string;
  current_capacity: number;
}

export interface UpdateDriverData {
  driver_name?: string;
  driver_license_number?: string;
  current_capacity?: number;
}

class DriverService {
  async getAllDrivers(): Promise<Driver[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers`, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching drivers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch drivers');
    }
  }

  async getDriverById(id: number): Promise<Driver> {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/${id}`, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching driver:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch driver');
    }
  }

  async createDriver(data: CreateDriverData): Promise<Driver> {
    try {
      const response = await axios.post(`${API_BASE_URL}/drivers`, data, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating driver:', error);
      throw new Error(error.response?.data?.message || 'Failed to create driver');
    }
  }

  async updateDriver(id: number, data: UpdateDriverData): Promise<Driver> {
    try {
      const response = await axios.put(`${API_BASE_URL}/drivers/${id}`, data, {
        headers: authUtils.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating driver:', error);
      throw new Error(error.response?.data?.message || 'Failed to update driver');
    }
  }

  async deleteDriver(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/drivers/${id}`, {
        headers: authUtils.getAuthHeaders()
      });
    } catch (error: any) {
      console.error('Error deleting driver:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete driver');
    }
  }
}

export const driverService = new DriverService();