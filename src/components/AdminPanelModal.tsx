import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  Store,
  KeyRound,
  LogOut,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  MessageCircle,
  Sparkles,
  Users,
  UserCheck,
  UserX,
  Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogoImage } from './Logo';
import { UserRole } from '../services/auth';

export const AdminPanelModal: React.FC = () => {
  const {
    user,
    isAdminPanelOpen,
    closeAdminPanel,
    openLogoutModal,
    changePassword,
    usersList,
    changeUserRole,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'security'>('overview');
  const [roleActionLoading, setRoleActionLoading] = useState<string | null>(null);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  // Change password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  if (!isAdminPanelOpen || !user) return null;

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    setRoleActionLoading(userId);
    setRoleMessage(null);
    try {
      const res = await changeUserRole(userId, newRole);
      setRoleMessage(res.message || `Role berhasil diubah menjadi ${newRole}.`);
      setTimeout(() => setRoleMessage(null), 3000);
    } catch {
      setRoleMessage('Gagal mengubah role.');
    } finally {
      setRoleActionLoading(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!oldPassword) {
      setPassError('Silakan masukkan password saat ini.');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Password baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setPassSuccess(res.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(res.message || 'Gagal mengubah password.');
      }
    } catch {
      setPassError('Terjadi kesalahan koneksi.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const isOwner = user.email.toLowerCase() === 'safarazqiaa@gmail.com';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAdminPanel}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl rounded-2xl border border-theme bg-card-theme shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-admin-title"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-theme flex items-center justify-between bg-surface/50">
            <div className="flex items-center gap-3">
              <LogoImage sizeClass="w-10 h-10" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="modal-admin-title" className="text-base sm:text-lg font-bold text-heading">
                    Panel Pengelola Warung
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#97A87A]/20 text-[#97A87A] dark:text-[#A8BBA3] border border-[#97A87A]/30">
                    {isOwner ? <Crown className="w-3 h-3 text-[#DB9558]" /> : <ShieldCheck className="w-3 h-3" />}
                    {isOwner ? 'Pemilik Toko' : 'Admin'}
                  </span>
                </div>
                <p className="text-xs text-muted truncate max-w-xs sm:max-w-md">{user.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeAdminPanel}
              className="p-2 rounded-lg text-muted hover:text-heading hover:bg-surface border border-transparent hover:border-theme transition-all cursor-pointer"
              aria-label="Tutup panel admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 sm:px-6 pt-3 border-b border-theme flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'overview'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-muted hover:text-heading'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Ringkasan Toko</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'users'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-muted hover:text-heading'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Kelola Pengguna & Role</span>
              {usersList.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface border border-theme text-muted">
                  {usersList.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'security'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-muted hover:text-heading'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Ganti Password</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-theme bg-surface">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
                      Status Toko
                    </span>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-heading">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97A87A] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#97A87A]" />
                      </span>
                      <span>Buka Setiap Hari</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-theme bg-surface">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
                      Jam Kerja
                    </span>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-heading">
                      <Clock className="w-4 h-4 text-[#DB9558]" />
                      <span>05.00–21.00 WIB</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-theme bg-surface">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
                      Total Pengguna
                    </span>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-heading">
                      <Users className="w-4 h-4 text-[#97A87A]" />
                      <span>{usersList.length || '4'} Akun Terdaftar</span>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-4 rounded-xl border border-theme bg-surface/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-heading">
                    <Sparkles className="w-4 h-4 text-[#DB9558]" />
                    <span>Portal Pengelola Resmi</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Anda masuk sebagai <strong>{user.name}</strong> ({user.email}). Setiap orang baru yang mendaftar
                    otomatis menjadi <strong>Member</strong>, dan Anda dapat memilih untuk mengubah peran mereka menjadi
                    Admin atau Member di tab <strong>Kelola Pengguna & Role</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: USER & ROLE MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-heading">Daftar Pengguna & Hak Akses (Role)</h3>
                    <p className="text-xs text-muted">
                      Sebagai Admin/Owner, Anda dapat menentukan pengguna menjadi <strong>Member</strong> atau{' '}
                      <strong>Admin</strong>.
                    </p>
                  </div>
                </div>

                {roleMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{roleMessage}</span>
                  </div>
                )}

                {/* Users List */}
                <div className="divide-y divide-theme border border-theme rounded-xl overflow-hidden bg-surface/30">
                  {usersList.map((u) => {
                    const isOwnerUser = u.email.toLowerCase() === 'safarazqiaa@gmail.com';
                    const isCurrentUser = u.email.toLowerCase() === user.email.toLowerCase();

                    return (
                      <div
                        key={u.id}
                        className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface/70 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs sm:text-sm text-heading truncate">
                              {u.name}
                            </span>

                            {isOwnerUser ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DB9558]/20 text-[#DB9558] border border-[#DB9558]/40">
                                <Crown className="w-3 h-3" />
                                Pemilik Toko
                              </span>
                            ) : u.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#97A87A]/20 text-[#97A87A] dark:text-[#A8BBA3] border border-[#97A87A]/30">
                                <ShieldCheck className="w-3 h-3" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-200/60 dark:bg-neutral-800 text-muted border border-theme">
                                Member
                              </span>
                            )}

                            {isCurrentUser && (
                              <span className="text-[10px] text-muted italic">(Anda)</span>
                            )}
                          </div>
                          <p className="text-xs text-muted font-mono truncate">{u.email}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isOwnerUser ? (
                            <span className="text-[11px] text-muted italic">Akses Penuh</span>
                          ) : u.role === 'member' ? (
                            <button
                              type="button"
                              onClick={() => handleChangeRole(u.id, 'admin')}
                              disabled={roleActionLoading === u.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#97A87A]/20 hover:bg-[#97A87A]/30 text-[#97A87A] dark:text-[#A8BBA3] border border-[#97A87A]/40 transition-colors cursor-pointer disabled:opacity-50"
                              title="Jadikan pengguna ini sebagai Admin"
                            >
                              {roleActionLoading === u.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                              <span>Jadikan Admin</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleChangeRole(u.id, 'member')}
                              disabled={roleActionLoading === u.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-200/60 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-heading border border-theme transition-colors cursor-pointer disabled:opacity-50"
                              title="Ubah kembali menjadi Member"
                            >
                              {roleActionLoading === u.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                              <span>Jadikan Member</span>
                            </button>
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
              <div className="space-y-5">
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <h3 className="text-sm font-bold text-heading">Ubah Password Akun</h3>

                  {passError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{passError}</span>
                    </div>
                  )}

                  {passSuccess && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{passSuccess}</span>
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Password saat ini"
                      className="w-full px-3.5 py-2 rounded-xl border border-theme bg-surface text-sm text-heading focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2 rounded-xl border border-theme bg-surface text-sm text-heading focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className="w-full px-3.5 py-2 rounded-xl border border-theme bg-surface text-sm text-heading focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="btn-primary py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isChangingPass ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Simpan Password Baru</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer actions with Logout */}
          <div className="p-4 sm:p-5 border-t border-theme flex items-center justify-between bg-surface/40">
            <button
              type="button"
              onClick={() => {
                closeAdminPanel();
                openLogoutModal();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun (Logout)</span>
            </button>

            <button
              type="button"
              onClick={closeAdminPanel}
              className="btn-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
            >
              Tutup Panel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
