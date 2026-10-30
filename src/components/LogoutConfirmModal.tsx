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
          className="fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm rounded-2xl border border-theme bg-card-theme p-6 sm:p-7 shadow-2xl z-10 transition-colors text-center"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="modal-logout-title"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLogoutModal}
            disabled={isLoggingOut}
            className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-heading hover:bg-surface border border-transparent hover:border-theme transition-all cursor-pointer disabled:opacity-50"
            aria-label="Batal logout"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Warning Icon with warm terracotta/amber badge */}
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto mb-4 text-[#DB9558]">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 id="modal-logout-title" className="text-lg sm:text-xl font-bold tracking-tight text-heading">
            Konfirmasi Logout
          </h3>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            Apakah Anda yakin ingin keluar dari sesi admin Warung Pojok Aro? Anda harus login kembali untuk mengakses panel pengelola.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={closeLogoutModal}
              disabled={isLoggingOut}
              className="btn-secondary w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Ya, Keluar</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
