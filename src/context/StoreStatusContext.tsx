import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '../services/auth';

export type StoreOverrideMode = 'auto' | 'open' | 'closed';

export interface StoreStatusState {
  mode: StoreOverrideMode;
  note: string;
  updatedAt: string;
  updatedBy: string;
}

interface StoreStatusContextType {
  status: StoreStatusState;
  isUpdating: boolean;
  refreshStatus: () => Promise<void>;
  updateStatus: (
    mode: StoreOverrideMode,
    note?: string
  ) => Promise<{ success: boolean; message?: string }>;
}

const STORAGE_KEY = 'warung_pojok_aro_store_status';

const DEFAULT_STATUS: StoreStatusState = {
  mode: 'auto',
  note: '',
  updatedAt: '',
  updatedBy: 'system',
};

function readCachedStatus(): StoreStatusState {
  if (typeof window === 'undefined') return DEFAULT_STATUS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoreStatusState>;
      if (parsed && (parsed.mode === 'auto' || parsed.mode === 'open' || parsed.mode === 'closed')) {
        return {
          mode: parsed.mode,
          note: typeof parsed.note === 'string' ? parsed.note : '',
          updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
          updatedBy: typeof parsed.updatedBy === 'string' ? parsed.updatedBy : 'system',
        };
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_STATUS;
}

function saveCachedStatus(next: StoreStatusState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

const StoreStatusContext = createContext<StoreStatusContextType | undefined>(undefined);

export const StoreStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<StoreStatusState>(() => readCachedStatus());
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/store/status');
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.status) {
          setStatus(data.status);
          saveCachedStatus(data.status);
        }
      }
    } catch {
      // keep cached status if offline
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 15000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  const updateStatus = async (
    mode: StoreOverrideMode,
    note = ''
  ): Promise<{ success: boolean; message?: string }> => {
    setIsUpdating(true);
    try {
      const token = authService.getToken();
      const res = await fetch('/api/store/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ mode, note }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && data.status) {
        setStatus(data.status);
        saveCachedStatus(data.status);
        return { success: true, message: data.message };
      }

      return {
        success: false,
        message: data?.message || 'Gagal memperbarui status warung.',
      };
    } catch {
      return {
        success: false,
        message: 'Terjadi kesalahan jaringan saat menyimpan status warung.',
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <StoreStatusContext.Provider value={{ status, isUpdating, refreshStatus, updateStatus }}>
      {children}
    </StoreStatusContext.Provider>
  );
};

export const useStoreStatus = (): StoreStatusContextType => {
  const ctx = useContext(StoreStatusContext);
  if (!ctx) {
    throw new Error('useStoreStatus must be used within a StoreStatusProvider');
  }
  return ctx;
};
