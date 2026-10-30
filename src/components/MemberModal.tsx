import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Sparkles, KeyRound, LogOut, Check, AlertCircle, Loader2, Store, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogoImage } from './Logo';

export const MemberModal: React.FC = () => {
  const { user, isMemberModalOpen, closeMemberModal, openLogoutModal, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Change password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  if (!isMemberModalOpen || !user) return null;

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMemberModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg rounded-2xl border border-theme bg-card-theme shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="p-5 border-b border-theme flex items-center justify-between bg-surface/50">
            <div className="flex items-center gap-3">
              <LogoImage sizeClass="w-10 h-10" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-heading">
                    Portal Anggota
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DB9558]/15 text-[#DB9558] border border-[#DB9558]/30">
                    <User className="w-3 h-3" />
                    Member
                  </span>
                </div>
                <p className="text-xs text-muted">{user.name} &bull; {user.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeMemberModal}
              className="p-2 rounded-lg text-muted hover:text-heading hover:bg-surface border border-transparent hover:border-theme transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 pt-3 border-b border-theme flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-muted hover:text-heading'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Keuntungan Member</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'password'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-muted hover:text-heading'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Ganti Password</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto space-y-4 flex-grow text-left">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-theme bg-surface space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-heading">
                    <Gift className="w-4 h-4 text-[#DB9558]" />
                    <span>Keuntungan Belanja sebagai Member</span>
                  </div>
                  <ul className="text-xs text-muted space-y-1.5 list-disc list-inside">
                    <li>Prioritas pemesanan kebutuhan harian & sembako via WhatsApp</li>
                    <li>Update info promo bahan pokok dan stok es krim terbaru</li>
                    <li>Kemudahan transaksi layanan tarik tunai Mini ATM</li>
                    <li>Pelayanan ramah langsung dari pengelola Warung Pojok Aro</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-theme bg-surface/50 text-xs text-muted flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#97A87A] shrink-0" />
                  <span>Akun Anda terdaftar aktif di Warung Pojok Aro, Mojotengah, Wonosobo.</span>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-3.5">
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

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Password saat ini"
                    className="w-full px-3 py-2 rounded-xl border border-theme bg-surface text-sm text-heading focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2 rounded-xl border border-theme bg-surface text-sm text-heading focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full px-3 py-2 rounded-xl border border-theme bg-surface text-sm text-heading focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="btn-primary py-2 px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isChangingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Simpan Password</span>
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-theme flex items-center justify-between bg-surface/40">
            <button
              type="button"
              onClick={() => {
                closeMemberModal();
                openLogoutModal();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar (Logout)</span>
            </button>

            <button
              type="button"
              onClick={closeMemberModal}
              className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
