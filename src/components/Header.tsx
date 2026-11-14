import React from 'react';
import { Lock, LogOut, User, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onReplayIntro?: () => void;
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReplayIntro,
  onHomeClick,
}) => {
  const {
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    openLoginModal,
    openLogoutModal,
    openAdminPanel,
    openMemberModal,
  } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full border-b border-theme bg-page/92 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-18 flex items-center justify-between gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            if (onHomeClick) {
              onHomeClick();
            } else if (onReplayIntro) {
              onReplayIntro();
            }
          }}
          className="flex items-center min-w-0 flex-1 overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-[#DB9558] rounded-lg p-1 -ml-1 cursor-pointer transition-transform duration-200 active:scale-95"
          aria-label="Warung Pojok Aro Home"
        >
          {/* Mobile phone: compact logo */}
          <div className="sm:hidden min-w-0 w-full">
            <Logo size="sm" showSlogan={false} />
          </div>
          {/* Tablet & Desktop: full logo */}
          <div className="hidden sm:block min-w-0">
            <Logo size="md" showSlogan={true} />
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* User Session status */}
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => openLoginModal('login')}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-theme text-heading hover:border-[#DB9558] hover:text-[#DB9558] transition-all text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#DB9558] cursor-pointer whitespace-nowrap"
              title="Login or Sign Up"
              aria-label="Login"
            >
              <Lock className="w-3.5 h-3.5 text-[#DB9558] shrink-0" />
              <span>Login</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {isSuperAdmin ? (
                <button
                  type="button"
                  onClick={openAdminPanel}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-[#DB9558]/60 bg-[#DB9558]/15 text-[#DB9558] hover:bg-[#DB9558]/25 transition-all text-[11px] sm:text-sm font-bold cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Open Super Admin Panel"
                >
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Super Admin</span>
                </button>
              ) : isAdmin ? (
                <button
                  type="button"
                  onClick={openAdminPanel}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#97A87A]/50 bg-[#97A87A]/15 text-heading hover:bg-[#97A87A]/25 transition-all text-[11px] sm:text-sm font-semibold cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Open Admin Panel"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97A87A] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#97A87A]" />
                  </span>
                  <span>Admin</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openMemberModal}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-neutral-700 bg-surface text-heading hover:bg-neutral-800 transition-all text-[11px] sm:text-sm font-semibold cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Open Member Portal"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Member</span>
                </button>
              )}

              <button
                type="button"
                onClick={openLogoutModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-red-800/80 bg-red-950/50 text-red-400 hover:bg-red-900/60 transition-all text-[11px] sm:text-sm font-semibold cursor-pointer shadow-2xs whitespace-nowrap"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden min-[440px]:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
