import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, KeyRound, LogOut, Check, AlertCircle, Loader2 } from 'lucide-react';
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
      setPassError('Network error occurred.');
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
          className="relative w-full max-w-lg rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E1B18] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/40">
            <div className="flex items-center gap-3">
              <LogoImage sizeClass="w-10 h-10" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Member Portal
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                    <User className="w-3.5 h-3.5" />
                    Member
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono">{user.name} &bull; {user.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeMemberModal}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 pt-3 border-b border-neutral-200 dark:border-neutral-800 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Member Benefits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'password'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto space-y-4 flex-grow text-left">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                    Member Advantages
                  </h3>
                  <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-2 list-disc list-inside leading-relaxed">
                    <li>Priority ordering for daily groceries & supplies via WhatsApp</li>
                    <li>Instant updates on new grocery arrivals & seasonal stock</li>
                    <li>Fast-lane transactions for Mini ATM cash withdrawals & transfers</li>
                    <li>Direct friendly service from the store managers</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                {passError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{passError}</span>
                  </div>
                )}
                {passSuccess && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{passSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="btn-primary py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isChangingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Save Password</span>
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/40">
            <button
              type="button"
              onClick={() => {
                closeMemberModal();
                openLogoutModal();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            <button
              type="button"
              onClick={closeMemberModal}
              className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
