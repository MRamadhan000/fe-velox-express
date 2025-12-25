import axios from 'axios';
import { authUtils } from '@/app/utils/auth';

// Sesuaikan dengan URL Laravel Anda
const API_URL = 'http://127.0.0.1:8001/api/auth';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: string;
  };
  token: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/register`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      // Simpan token otomatis setelah register berhasil
      authUtils.setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error('Registration failed');
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/login`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      // Simpan token otomatis setelah login berhasil
      authUtils.setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error('Login failed');
    }
  },

  adminLogin: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      // Simpan token otomatis setelah admin login berhasil
      authUtils.setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error('Admin login failed');
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/logout`, {}, {
        headers: authUtils.getAuthHeaders(),
      });
      // Hapus token dari localStorage
      authUtils.removeToken();
      return response.data;
    } catch (error: any) {
      // Tetap hapus token meskipun API call gagal
      authUtils.removeToken();
      throw error.response?.data || new Error('Logout failed');
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: authUtils.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error('Failed to get profile');
    }
  },
};