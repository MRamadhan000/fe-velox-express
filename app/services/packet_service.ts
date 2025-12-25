import axios from 'axios';
import { authUtils } from '@/app/utils/auth';

// Sesuaikan dengan URL Laravel Anda (cek php artisan serve)
const API_URL = 'http://localhost:8001/api/packets';

export const packetService = {
  /**
   * Mengirim data paket baru ke Laravel
   * Karena ada upload file, kita harus menggunakan FormData
   */
  store: async (formData: FormData) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          ...authUtils.getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      // Jika ada response dari server, cek apakah data tersimpan meskipun ada "error"
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Jika status 2xx tapi di catch (tidak mungkin), atau status error tapi data ada
        if ((status >= 200 && status < 300) || data?.id || data?.success) {
          console.log("Data mungkin tersimpan meskipun ada error response:", data);
          return data;
        }

        // Error sebenarnya
        throw data || new Error('Terjadi kesalahan pada server');
      }

      // Network error atau error lainnya
      throw new Error('Tidak dapat terhubung ke server');
    }
  },

  // Helper untuk mendapatkan semua data (Index)
  getAll: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: authUtils.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error('Failed to fetch packets');
    }
  },

  // Get packet by ID
  getById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: authUtils.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error('Failed to fetch packet');
    }
  },
};
