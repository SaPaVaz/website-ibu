import React from 'react';
import { Sun, Moon, Lock, LogOut, User, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onReplayIntro }) => {
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
      className="sticky top-0 z-40 w-full border-b border-theme bg-page/90 backdrop-blur-md transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (onReplayIntro) onReplayIntro();
          }}
          className="flex items-center min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-[#DB9558] rounded-lg p-1 -ml-1 cursor-pointer transition-transform duration-200 active:scale-95"
          aria-label="Warung Pojok Aro Home"
        >
          {/* Mobile phone: compact logo */}
          <div className="sm:hidden">
            <Logo size="sm" showSlogan={false} />
          </div>
          {/* Tablet & Desktop: full logo */}
          <div className="hidden sm:block">
            <Logo size="md" showSlogan={true} />
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* User Session status */}
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => openLoginModal('login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-theme text-heading hover:border-[#DB9558] hover:text-[#DB9558] transition-all text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#DB9558] cursor-pointer"
              title="Login or Sign Up"
              aria-label="Login"
            >
              <Lock className="w-3.5 h-3.5 text-[#DB9558]" />
              <span>Login</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isSuperAdmin ? (
                <button
                  type="button"
                  onClick={openAdminPanel}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#DB9558]/60 bg-[#DB9558]/15 text-[#DB9558] hover:bg-[#DB9558]/25 transition-all text-xs sm:text-sm font-bold cursor-pointer shadow-2xs"
                  title="Open Super Admin Panel"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </button>
              ) : isAdmin ? (
                <button
                  type="button"
                  onClick={openAdminPanel}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#97A87A]/50 bg-[#97A87A]/15 text-heading hover:bg-[#97A87A]/25 transition-all text-xs sm:text-sm font-semibold cursor-pointer shadow-2xs"
                  title="Open Admin Panel"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97A87A] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#97A87A]" />
                  </span>
                  <span>Admin</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openMemberModal}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface text-heading hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-xs sm:text-sm font-semibold cursor-pointer shadow-2xs"
                  title="Open Member Portal"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Member</span>
                </button>
              )}

              <button
                type="button"
                onClick={openLogoutModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-800/80 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition-all text-xs sm:text-sm font-semibold cursor-pointer shadow-2xs"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Theme Toggle Button (English: Light Mode / Dark Mode) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-theme text-heading hover:bg-surface transition-all text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#DB9558] cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#DB9558]" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#97A87A]" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
};
