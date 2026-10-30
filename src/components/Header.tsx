import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onReplayIntro }) => {
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
          aria-label="Warung Pojok Aro Beranda - Putar Animasi Sambutan"
        >
          {/* Mobile phone: compact logo with title */}
          <div className="sm:hidden">
            <Logo size="sm" showSlogan={false} />
          </div>
          {/* Tablet & Desktop: full logo with slogan */}
          <div className="hidden sm:block">
            <Logo size="md" showSlogan={true} />
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="hidden md:inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border border-theme text-muted">
            Profil Resmi
          </span>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
            title={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-theme text-heading hover:bg-surface transition-all text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#DB9558] cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#DB9558]" />
                <span className="hidden sm:inline">Mode Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#97A87A]" />
                <span className="hidden sm:inline">Mode Gelap</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
};
