import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImageSrc from '../assets/images/logo_warung_pojok.png';
import { ArrowRight, Sparkles } from 'lucide-react';

interface IntroSplashProps {
  onFinish?: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Automatically close splash screen after 2.3 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FCF9EA] dark:bg-[#181614] px-6 select-none cursor-default overflow-hidden"
        >
          {/* Ambient Warm Gradient Orbs matching palette */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.4, 0.25] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#DB9558]/20 blur-3xl pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.35, 0.2] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#97A87A]/25 blur-3xl pointer-events-none"
          />

          {/* Skip Button */}
          <motion.button
            type="button"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#6B6357] dark:text-[#A8BBA3] hover:text-[#2B2520] dark:hover:text-white bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-[#E3DCBE] dark:border-neutral-700 transition-colors shadow-xs"
            aria-label="Lewati animasi sambutan"
          >
            <span>Lewati</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

          {/* Central Animated Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
            {/* Logo Badge with Aura & Scale Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                duration: 0.7,
              }}
              className="relative mb-6"
            >
              {/* Pulsing Warm Ring */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#DB9558]/30 via-[#97A87A]/30 to-[#DB9558]/30 blur-sm"
              />

              {/* Logo Card */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white p-1 shadow-lg border border-[#E3DCBE] dark:border-neutral-700 flex items-center justify-center">
                <img
                  src={logoImageSrc}
                  alt="Logo Warung Pojok Aro"
                  className="w-full h-full object-contain scale-105"
                />
              </div>
            </motion.div>

            {/* Greeting Tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#97A87A]/15 border border-[#97A87A]/30 text-xs font-semibold text-[#97A87A] dark:text-[#A8BBA3] mb-3"
            >
              <Sparkles className="w-3 h-3 text-[#DB9558]" />
              <span>Selamat Datang</span>
            </motion.div>

            {/* Title & Brand */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2B2520] dark:text-[#FCF9EA] uppercase"
            >
              WARUNG POJOK ARO
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8BBA3] font-medium mt-1.5"
            >
              Menyediakan Kebutuhan Harian Anda &bull; Wonosobo
            </motion.p>

            {/* Animated Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="w-36 h-1.5 bg-[#E3DCBE] dark:bg-neutral-800 rounded-full mt-7 overflow-hidden"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.4 }}
                className="h-full bg-gradient-to-r from-[#DB9558] to-[#97A87A] rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
