export const authUtils = {
  // Simpan token ke localStorage dan cookies
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      // Juga simpan di cookies untuk middleware
      document.cookie = `auth_token=${token}; path=/; max-age=86400`; // 24 jam
    }
  },

  // Ambil token dari localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  // Hapus token dari localStorage dan cookies
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      // Hapus cookie juga
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  // Cek apakah user sudah login
  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    return !!token;
  },

  // Logout
  logout: () => {
    authUtils.removeToken();
    // Redirect ke halaman login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  },

  // Get auth headers untuk API calls
  getAuthHeaders: () => {
    const token = authUtils.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    } : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
};