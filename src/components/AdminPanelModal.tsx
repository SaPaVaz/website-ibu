import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Store,
  KeyRound,
  LogOut,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  Users,
  Trash2,
  RefreshCw,
  Power,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStoreStatus } from '../context/StoreStatusContext';
import { UserRole } from '../services/auth';
import { LogoImage } from './Logo';

export const AdminPanelModal: React.FC = () => {
  const {
    user,
    isSuperAdmin,
    isAdminPanelOpen,
    closeAdminPanel,
    openLogoutModal,
    changePassword,
    usersList,
    changeUserRole,
    deleteUserAccount,
    refreshUsers,
  } = useAuth();

  const { status: storeStatus, isUpdating: isUpdatingStoreStatus, updateStatus: updateStoreStatus } =
    useStoreStatus();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'security'>('overview');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);
  const [storeNoteDraft, setStoreNoteDraft] = useState(storeStatus.note || '');
  const [storeStatusFeedback, setStoreStatusFeedback] = useState<string | null>(null);

  useEffect(() => {
    setStoreNoteDraft(storeStatus.note || '');
  }, [storeStatus.note]);

  // Auto-refresh users when panel is open on the 'users' tab
  useEffect(() => {
    if (!isAdminPanelOpen || activeTab !== 'users') return;

    refreshUsers();
    const interval = setInterval(() => {
      refreshUsers();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAdminPanelOpen, activeTab, refreshUsers]);

  const handleManualRefresh = async () => {
    setIsRefreshingUsers(true);
    try {
      await refreshUsers();
    } finally {
      setTimeout(() => setIsRefreshingUsers(false), 400);
    }
  };

  // User delete confirmation state
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  // Change password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  if (!isAdminPanelOpen || !user) return null;

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    setActionLoading(`role_${userId}`);
    setFeedbackMessage(null);
    try {
      const res = await changeUserRole(userId, newRole);
      setFeedbackMessage(res.message || `Role updated to ${newRole}.`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      setFeedbackMessage('Failed to update role.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(`del_${userToDelete.id}`);
    try {
      const res = await deleteUserAccount(userToDelete.id);
      setFeedbackMessage(res.message || 'User deleted successfully.');
      setUserToDelete(null);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      setFeedbackMessage('Failed to delete user.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!oldPassword) {
      setPassError('Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setPassSuccess(res.message || 'Password successfully updated.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(res.message || 'Failed to update password.');
      }
    } catch {
      setPassError('A network error occurred.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAdminPanel}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl rounded-2xl border border-[#3D372F] bg-[#1E1B18] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92dvh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-admin-title"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-6 border-b border-[#3D372F] flex items-center justify-between gap-2.5 bg-[#181614]/80">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <LogoImage sizeClass="w-9 h-9 sm:w-10 sm:h-10" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h2 id="modal-admin-title" className="text-sm sm:text-lg font-bold text-[#FCF9EA] truncate">
                    {isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold shrink-0 ${
                      isSuperAdmin
                        ? 'bg-[#DB9558]/20 text-[#DB9558] border border-[#DB9558]/40'
                        : 'bg-[#97A87A]/20 text-[#A8BBA3] border border-[#97A87A]/40'
                    }`}
                  >
                    {isSuperAdmin ? <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    <span>{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#A8BBA3] font-mono truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeAdminPanel}
              className="p-2 rounded-lg text-[#A8BBA3] hover:text-white hover:bg-neutral-800 transition-all cursor-pointer shrink-0"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs - 3 balanced columns on mobile so nothing clips */}
          <div className="grid grid-cols-3 sm:flex gap-1 sm:gap-2 px-2.5 sm:px-6 pt-2.5 border-b border-[#3D372F] bg-[#1E1B18]">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 pt-1 px-1.5 sm:px-3 text-[11px] sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-[#A8BBA3]/75 hover:text-[#FCF9EA]'
              }`}
            >
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Overview</span>
              <span className="hidden sm:inline">Store Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`pb-2.5 pt-1 px-1.5 sm:px-3 text-[11px] sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-[#A8BBA3]/75 hover:text-[#FCF9EA]'
              }`}
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Users</span>
              <span className="hidden sm:inline">User Management</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-[#282420] text-[#FCF9EA] border border-[#3D372F]">
                {usersList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`pb-2.5 pt-1 px-1.5 sm:px-3 text-[11px] sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-[#A8BBA3]/75 hover:text-[#FCF9EA]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Password</span>
              <span className="hidden sm:inline">Security & Password</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-grow">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-5 text-left">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="p-3 sm:p-4 rounded-xl border border-[#3D372F] bg-[#221F1B]">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#A8BBA3] uppercase tracking-wider block mb-1">
                      Store Status
                    </span>
                    <div className="flex items-center gap-2 text-xs sm:text-base font-bold text-[#FCF9EA]">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        {storeStatus.mode === 'closed' ? (
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                        ) : (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97A87A] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#97A87A]" />
                          </>
                        )}
                      </span>
                      <span>
                        {storeStatus.mode === 'closed' ? 'Tutup' : 'Buka'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl border border-[#3D372F] bg-[#221F1B]">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#A8BBA3] uppercase tracking-wider block mb-1">
                      Jam Buka
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base font-bold text-[#FCF9EA]">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DB9558] shrink-0" />
                      <span className="truncate">05.00–21.00 WIB</span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-xl border border-[#3D372F] bg-[#221F1B]">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#A8BBA3] uppercase tracking-wider block mb-1">
                      Registered Users
                    </span>
                    <div className="flex items-center gap-2 text-xs sm:text-base font-bold text-[#FCF9EA]">
                      <Users className="w-4 h-4 text-[#97A87A] shrink-0" />
                      <span>{usersList.length} Active Accounts</span>
                    </div>
                  </div>
                </div>

                {/* Live Open / Closed Store Switcher (Super Admin Only) */}
                {isSuperAdmin && (
                  <div className="p-3.5 sm:p-4 rounded-xl border border-[#DB9558]/40 bg-[#221F1B] space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FCF9EA]">
                      <Power className="w-4 h-4 text-[#DB9558] shrink-0" />
                      <span>Atur Status Buka / Tutup Warung</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-[#A8BBA3]">
                        Alasan Tutup (isi jika ingin menutup warung)
                      </label>
                      <input
                        type="text"
                        value={storeNoteDraft}
                        onChange={(e) => setStoreNoteDraft(e.target.value)}
                        placeholder="Contoh: Sedang ada keperluan mendadak"
                        maxLength={150}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#3D372F] bg-[#181614] text-xs sm:text-sm text-[#FCF9EA] placeholder:text-[#A8BBA3]/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        disabled={isUpdatingStoreStatus}
                        onClick={async () => {
                          const res = await updateStoreStatus('open', '');
                          if (res.success) setStoreNoteDraft('');
                          setStoreStatusFeedback(res.message || null);
                          setTimeout(() => setStoreStatusFeedback(null), 3000);
                        }}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-60 ${
                          storeStatus.mode !== 'closed'
                            ? 'border-[#97A87A] bg-[#97A87A]/20 text-[#FCF9EA]'
                            : 'border-[#3D372F] bg-[#181614] text-[#A8BBA3]'
                        }`}
                      >
                        {isUpdatingStoreStatus ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Store className="w-3.5 h-3.5 text-[#97A87A] shrink-0" />
                        )}
                        <span>Buka</span>
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingStoreStatus}
                        onClick={async () => {
                          const res = await updateStoreStatus('closed', storeNoteDraft);
                          setStoreStatusFeedback(res.message || null);
                          setTimeout(() => setStoreStatusFeedback(null), 3000);
                        }}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-60 ${
                          storeStatus.mode === 'closed'
                            ? 'border-red-500 bg-red-500/15 text-red-400'
                            : 'border-[#3D372F] bg-[#181614] text-[#A8BBA3]'
                        }`}
                      >
                        {isUpdatingStoreStatus ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        )}
                        <span>Tutup</span>
                      </button>
                    </div>

                    {storeStatusFeedback && (
                      <p className="text-xs font-semibold text-[#A8BBA3]">
                        {storeStatusFeedback}
                      </p>
                    )}
                  </div>
                )}

                <div className="p-3.5 sm:p-4 rounded-xl border border-[#3D372F] bg-[#221F1B]/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FCF9EA]">
                    <ShieldAlert className="w-4 h-4 text-[#DB9558] shrink-0" />
                    <span>{isSuperAdmin ? 'Super Admin Access' : 'Admin Access'}</span>
                  </div>
                  <p className="text-xs text-[#A8BBA3] leading-relaxed">
                    Masuk sebagai <strong className="text-[#FCF9EA]">{user.name}</strong> ({user.email}).{' '}
                    {isSuperAdmin
                      ? 'Sebagai Super Admin, Anda dapat mengubah status buka/tutup warung, mengatur peran akun, dan mengelola seluruh anggota.'
                      : 'Sebagai Admin, Anda dapat melihat jadwal operasional toko serta mengelola peran member.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-3.5 sm:space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#FCF9EA] flex items-center gap-2 flex-wrap">
                      <span>User Management & Roles</span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-[#A8BBA3] bg-[#97A87A]/15 px-2 py-0.5 rounded-md border border-[#97A87A]/35">
                        Auto-Sync
                      </span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#A8BBA3] mt-1 leading-relaxed">
                      Akun baru otomatis menjadi <strong className="text-[#FCF9EA]">Member</strong>. Super Admin dapat mengatur peran semua akun.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualRefresh}
                    disabled={isRefreshingUsers}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold border border-[#3D372F] bg-[#221F1B] hover:bg-[#282420] text-[#FCF9EA] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                    title="Refresh user list from database"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingUsers ? 'animate-spin text-[#DB9558]' : ''}`} />
                    <span>{isRefreshingUsers ? 'Refreshing...' : 'Refresh List'}</span>
                  </button>
                </div>

                {feedbackMessage && (
                  <div className="p-3 rounded-xl bg-[#97A87A]/15 border border-[#97A87A]/40 text-[#FCF9EA] text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-[#97A87A]" />
                    <span>{feedbackMessage}</span>
                  </div>
                )}

                {/* Users List */}
                <div className="divide-y divide-[#3D372F] border border-[#3D372F] rounded-xl overflow-hidden bg-[#221F1B]/60">
                  {usersList.map((u) => {
                    const isPrimaryOwner = u.email.toLowerCase() === 'safarazqiaa@gmail.com';
                    const isSuper = u.role === 'superadmin' || isPrimaryOwner;
                    const isCurrentUser = u.email.toLowerCase() === user.email.toLowerCase();

                    return (
                      <div
                        key={u.id}
                        className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#282420]/60 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-[#FCF9EA] truncate max-w-[180px] sm:max-w-none">
                              {u.name}
                            </span>

                            {isPrimaryOwner ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-[#DB9558]/20 text-[#DB9558] border border-[#DB9558]/45">
                                <ShieldAlert className="w-3 h-3" />
                                Primary Super Admin
                              </span>
                            ) : isSuper ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-[#DB9558]/15 text-[#DB9558] border border-[#DB9558]/40">
                                <ShieldAlert className="w-3 h-3" />
                                Super Admin
                              </span>
                            ) : u.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-[#97A87A]/20 text-[#A8BBA3] border border-[#97A87A]/40">
                                <ShieldCheck className="w-3 h-3" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-[#181614] text-[#A8BBA3] border border-[#3D372F]">
                                Member
                              </span>
                            )}

                            {isCurrentUser && (
                              <span className="text-[10px] sm:text-[11px] text-[#A8BBA3] font-semibold">(Anda)</span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-[#A8BBA3] font-mono truncate">{u.email}</p>
                        </div>

                        {/* Action buttons - Clean 2-col grid on mobile */}
                        <div className="shrink-0 w-full sm:w-auto">
                          {isPrimaryOwner ? (
                            <span className="inline-block text-[11px] sm:text-xs text-[#A8BBA3] font-medium italic px-1">
                              Permanent Owner
                            </span>
                          ) : isSuperAdmin ? (
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2">
                              {u.role !== 'superadmin' && (
                                <button
                                  type="button"
                                  onClick={() => handleChangeRole(u.id, 'superadmin')}
                                  disabled={actionLoading === `role_${u.id}`}
                                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-[#DB9558]/20 hover:bg-[#DB9558]/30 text-[#DB9558] border border-[#DB9558]/40 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Promote to Super Admin"
                                >
                                  {actionLoading === `role_${u.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                  )}
                                  <span>Super Admin</span>
                                </button>
                              )}

                              {u.role !== 'admin' && (
                                <button
                                  type="button"
                                  onClick={() => handleChangeRole(u.id, 'admin')}
                                  disabled={actionLoading === `role_${u.id}`}
                                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-[#97A87A]/20 hover:bg-[#97A87A]/30 text-[#A8BBA3] border border-[#97A87A]/40 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Set role to Admin"
                                >
                                  {actionLoading === `role_${u.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                  )}
                                  <span>Make Admin</span>
                                </button>
                              )}

                              {u.role !== 'member' && (
                                <button
                                  type="button"
                                  onClick={() => handleChangeRole(u.id, 'member')}
                                  disabled={actionLoading === `role_${u.id}`}
                                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-[#181614] hover:bg-[#282420] text-[#FCF9EA] border border-[#3D372F] transition-colors cursor-pointer disabled:opacity-50"
                                  title="Demote to Member"
                                >
                                  {actionLoading === `role_${u.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : null}
                                  <span>Make Member</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setUserToDelete({ id: u.id, name: u.name })}
                                disabled={actionLoading === `del_${u.id}`}
                                className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-red-950/50 text-red-400 border border-red-900/80 hover:bg-red-900/60 transition-colors cursor-pointer disabled:opacity-50"
                                title="Permanently delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Delete</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {u.role === 'member' ? (
                                <button
                                  type="button"
                                  onClick={() => handleChangeRole(u.id, 'admin')}
                                  disabled={actionLoading === `role_${u.id}`}
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold bg-[#97A87A]/20 hover:bg-[#97A87A]/30 text-[#A8BBA3] border border-[#97A87A]/40 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Promote to Admin"
                                >
                                  {actionLoading === `role_${u.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                  )}
                                  <span>Make Admin</span>
                                </button>
                              ) : u.role === 'admin' ? (
                                <button
                                  type="button"
                                  onClick={() => handleChangeRole(u.id, 'member')}
                                  disabled={actionLoading === `role_${u.id}`}
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold bg-[#181614] hover:bg-[#282420] text-[#FCF9EA] border border-[#3D372F] transition-colors cursor-pointer disabled:opacity-50"
                                  title="Demote to Member"
                                >
                                  {actionLoading === `role_${u.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : null}
                                  <span>Make Member</span>
                                </button>
                              ) : (
                                <span className="text-xs text-[#A8BBA3] font-medium italic px-1">
                                  Super Admin (Protected)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <div className="space-y-4 text-left">
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <h3 className="text-sm font-bold text-[#FCF9EA]">
                    Change Account Password
                  </h3>

                  {passError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/40 border border-red-900 text-red-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{passError}</span>
                    </div>
                  )}

                  {passSuccess && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-[#97A87A]/15 border border-[#97A87A]/40 text-[#FCF9EA] text-xs">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#97A87A]" />
                      <span>{passSuccess}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8BBA3]">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#3D372F] bg-[#181614] text-sm text-[#FCF9EA] placeholder:text-[#A8BBA3]/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8BBA3]">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#3D372F] bg-[#181614] text-sm text-[#FCF9EA] placeholder:text-[#A8BBA3]/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8BBA3]">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#3D372F] bg-[#181614] text-sm text-[#FCF9EA] placeholder:text-[#A8BBA3]/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="btn-primary w-full sm:w-auto justify-center py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isChangingPass ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-3.5 py-3 sm:p-5 border-t border-[#3D372F] flex items-center justify-between gap-3 bg-[#181614]/80">
            <button
              type="button"
              onClick={() => {
                closeAdminPanel();
                openLogoutModal();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-red-400 hover:bg-red-950/50 border border-transparent hover:border-red-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            <button
              type="button"
              onClick={closeAdminPanel}
              className="btn-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal for Super Admin */}
        <AnimatePresence>
          {userToDelete && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUserToDelete(null)}
                className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm rounded-2xl border border-[#3D372F] bg-[#1E1B18] p-5 sm:p-6 shadow-2xl z-10 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-red-950/60 text-red-400 flex items-center justify-center mx-auto mb-3 border border-red-900/60">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#FCF9EA]">
                  Delete User Account?
                </h3>
                <p className="text-xs text-[#A8BBA3] mt-2 leading-relaxed">
                  Are you sure you want to delete <strong className="text-[#FCF9EA]">{userToDelete.name}</strong>? This action cannot be undone.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUserToDelete(null)}
                    className="btn-secondary flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={actionLoading === `del_${userToDelete.id}`}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === `del_${userToDelete.id}` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
