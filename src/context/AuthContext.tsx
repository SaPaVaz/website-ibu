import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService, UserProfile } from '../services/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  isLoginModalOpen: boolean;
  loginModalMode: 'login' | 'signup';
  openLoginModal: (mode?: 'login' | 'signup') => void;
  closeLoginModal: () => void;
  isLogoutModalOpen: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  isAdminPanelOpen: boolean;
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
  isMemberModalOpen: boolean;
  openMemberModal: () => void;
  closeMemberModal: () => void;
  usersList: UserProfile[];
  refreshUsers: () => Promise<void>;
  changeUserRole: (userId: string, newRole: 'admin' | 'member') => Promise<{ success: boolean; message?: string }>;
  deleteUserAccount: (userId: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'signup'>('login');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verifySession();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshUsers = useCallback(async () => {
    const list = await authService.getUsers();
    setUsersList(list);
  }, []);

  useEffect(() => {
    if (user && (user.role === 'superadmin' || user.role === 'admin') && isAdminPanelOpen) {
      refreshUsers();
    }
  }, [user, isAdminPanelOpen, refreshUsers]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        setIsLoginModalOpen(false);
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Login failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.signup(name, email, password);
      if (result.success && result.user) {
        setUser(result.user);
        setIsLoginModalOpen(false);
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Sign up failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAdminPanelOpen(false);
      setIsLogoutModalOpen(false);
      setIsMemberModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    return await authService.changePassword(oldPass, newPass);
  };

  const changeUserRole = async (userId: string, newRole: 'admin' | 'member') => {
    const res = await authService.updateUserRole(userId, newRole);
    if (res.success) {
      if (res.users) {
        setUsersList(res.users);
      } else {
        await refreshUsers();
      }
      if (user && user.id === userId) {
        setUser({ ...user, role: newRole });
      }
    }
    return res;
  };

  const deleteUserAccount = async (userId: string) => {
    const res = await authService.deleteUser(userId);
    if (res.success) {
      if (res.users) {
        setUsersList(res.users);
      } else {
        await refreshUsers();
      }
    }
    return res;
  };

  const isSuperAdmin = user?.role === 'superadmin' || user?.email.toLowerCase() === 'safarazqiaa@gmail.com';
  const isAdmin = isSuperAdmin || user?.role === 'admin';
  const isMember = !isAdmin && user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSuperAdmin,
        isAdmin,
        isMember,
        isLoading,
        login,
        signup,
        logout,
        changePassword,
        isLoginModalOpen,
        loginModalMode,
        openLoginModal: (mode = 'login') => {
          setLoginModalMode(mode);
          setIsLoginModalOpen(true);
        },
        closeLoginModal: () => setIsLoginModalOpen(false),
        isLogoutModalOpen,
        openLogoutModal: () => setIsLogoutModalOpen(true),
        closeLogoutModal: () => setIsLogoutModalOpen(false),
        isAdminPanelOpen,
        openAdminPanel: () => setIsAdminPanelOpen(true),
        closeAdminPanel: () => setIsAdminPanelOpen(false),
        isMemberModalOpen,
        openMemberModal: () => setIsMemberModalOpen(true),
        closeMemberModal: () => setIsMemberModalOpen(false),
        usersList,
        refreshUsers,
        changeUserRole,
        deleteUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
