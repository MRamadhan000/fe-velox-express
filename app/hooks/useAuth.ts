import { useState, useEffect } from 'react';
import { authUtils } from '@/app/utils/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Cek status autentikasi saat komponen mount
    const checkAuth = () => {
      const token = authUtils.getToken();
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();

    // Listen untuk perubahan localStorage (misal ketika logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    authUtils.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    token: authUtils.getToken(),
  };
};