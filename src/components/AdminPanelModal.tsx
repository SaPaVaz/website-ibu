import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'security'>('overview');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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

  const handleChangeRole = async (userId: string, newRole: 'admin' | 'member') => {
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
          className="relative w-full max-w-3xl rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E1B18] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-admin-title"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <LogoImage sizeClass="w-10 h-10" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="modal-admin-title" className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {isSuperAdmin ? 'Super Admin Management Panel' : 'Admin Panel'}
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isSuperAdmin
                      ? 'bg-[#DB9558]/20 text-[#DB9558] border border-[#DB9558]/40'
                      : 'bg-[#97A87A]/20 text-[#97A87A] border border-[#97A87A]/40'
                  }`}>
                    {isSuperAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    {isSuperAdmin ? 'Super Admin' : 'Admin'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono truncate max-w-xs sm:max-w-md">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeAdminPanel}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (English) */}
          <div className="px-5 sm:px-6 pt-3 border-b border-neutral-200 dark:border-neutral-800 flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'overview'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Store Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'users'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Management</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {usersList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'security'
                  ? 'border-[#DB9558] text-[#DB9558]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Store Status
                    </span>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97A87A] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#97A87A]" />
                      </span>
                      <span>Open Daily</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Business Hours
                    </span>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                      <Clock className="w-4 h-4 text-[#DB9558]" />
                      <span>05.00–21.00 WIB</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Registered Users
                    </span>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                      <Users className="w-4 h-4 text-[#97A87A]" />
                      <span>{usersList.length} Active Accounts</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    <ShieldAlert className="w-4 h-4 text-[#DB9558]" />
                    <span>Super Admin Access</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    You are logged in as <strong>{user.name}</strong> ({user.email}). As the sole Super Admin, you have full control to assign roles (Admin or Member) and delete any user accounts from the system.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      User Management & Roles
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Only actual registered users are shown. You can toggle roles between Admin and Member, or delete accounts.
                    </p>
                  </div>
                </div>

                {feedbackMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{feedbackMessage}</span>
                  </div>
                )}

                {/* Users List */}
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-900/40">
                  {usersList.map((u) => {
                    const isSuper = u.role === 'superadmin' || u.email.toLowerCase() === 'safarazqiaa@gmail.com';
                    const isCurrentUser = u.email.toLowerCase() === user.email.toLowerCase();

                    return (
                      <div
                        key={u.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                              {u.name}
                            </span>

                            {isSuper ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DB9558]/20 text-[#DB9558] border border-[#DB9558]/40">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Super Admin
                              </span>
                            ) : u.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#97A87A]/20 text-[#97A87A] border border-[#97A87A]/40">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                                Member
                              </span>
                            )}

                            {isCurrentUser && (
                              <span className="text-[11px] text-neutral-500 font-semibold">(You)</span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 font-mono truncate">{u.email}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isSuper ? (
                            <span className="text-xs text-neutral-500 font-medium italic px-2">
                              Permanent Super Admin
                            </span>
                          ) : (
                            <>
                              {/* Role toggle button: ONLY Admin <-> Member */}
                              {u.role === 'member' ? (
                                <button
                                  type="button"
                                  onClick={() => handleChangeRole(u.id, 'admin')}
                                  disabled={actionLoading === `role_${u.id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#97A87A]/20 hover:bg-[#97A87A]/30 text-[#97A87A] border border-[#97A87A]/40 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Promote to Admin"
                                >
                                  {actionLoading === `role_${u.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                  )}
                                  <span>Make Admin</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleChangeRole(u.id, 'member')}
                                  disabled={actionLoading === `role_${u.id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Demote to Member"
                                >
                                  {actionLoading === `role_${u.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : null}
                                  <span>Make Member</span>
                                </button>
                              )}

                              {/* Delete User Button (Super Admin Exclusive) */}
                              {isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() => setUserToDelete({ id: u.id, name: u.name })}
                                  disabled={actionLoading === `del_${u.id}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Permanently delete user"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </>
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
              <div className="space-y-5 text-left">
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Change Account Password
                  </h3>

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

                  <div className="space-y-1.5">
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

                  <div className="space-y-1.5">
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

                  <div className="space-y-1.5">
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
          <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/40">
            <button
              type="button"
              onClick={() => {
                closeAdminPanel();
                openLogoutModal();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition-colors cursor-pointer"
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
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E1B18] p-6 shadow-2xl z-10 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Delete User Account?
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                  Are you sure you want to delete <strong>{userToDelete.name}</strong>? This action cannot be undone.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUserToDelete(null)}
                    className="btn-secondary flex-1 py-2 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={actionLoading === `del_${userToDelete.id}`}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
