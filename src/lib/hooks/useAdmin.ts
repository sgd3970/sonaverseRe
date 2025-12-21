'use client';

import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';

// 관리자 사용자 타입
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: AdminUser;
  };
  error?: string;
}

// Fetcher 함수
const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch');
  }
  
  return data;
};

/**
 * 관리자 인증 상태 훅
 */
export function useAdminAuth() {
  const { data, error, isLoading, mutate } = useSWR<AuthResponse>(
    '/api/admin/auth/me',
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const user = data?.data?.user || null;
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isLoading,
    isError: !!error,
    mutate,
  };
}

/**
 * 관리자 로그인 훅
 */
export function useAdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<AdminUser | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || '로그인에 실패했습니다.');
        return null;
      }

      return data.data?.user || null;
    } catch (err) {
      setError('로그인 처리 중 오류가 발생했습니다.');
      console.error('Login error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * 관리자 로그아웃 훅
 */
export function useAdminLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Logout error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    logout,
    isLoading,
  };
}

/**
 * 인증 필수 페이지용 훅
 */
export function useRequireAuth(redirectTo: string = '/admin/login') {
  const { user, isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isLoading, isAuthenticated, redirectTo]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}

