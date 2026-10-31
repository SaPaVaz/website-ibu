import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LogoutConfirmModal: React.FC = () => {
  const { isLogoutModalOpen, closeLogoutModal, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isLogoutModalOpen) return null;

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
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
          onClick={() => {
            if (!isLoggingOut) closeLogoutModal();
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E1B18] p-6 sm:p-7 shadow-2xl z-10 transition-colors text-center"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="modal-logout-title"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLogoutModal}
            disabled={isLoggingOut}
            className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all cursor-pointer disabled:opacity-50"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Warning Icon */}
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto mb-4 text-[#DB9558]">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 id="modal-logout-title" className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Confirm Logout
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
            Are you sure you want to log out of your Warung Pojok Aro account? You will need to login again to access the store.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={closeLogoutModal}
              disabled={isLoggingOut}
              className="btn-secondary w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Yes, Logout</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
