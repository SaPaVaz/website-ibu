import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { About } from './components/About';
import { OpeningHours } from './components/OpeningHours';
import { Location } from './components/Location';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { IntroSplash } from './components/IntroSplash';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthGatewayScreen } from './components/AuthGatewayScreen';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { MemberModal } from './components/MemberModal';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('warung_pojok_aro_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    }
    return 'light'; // Light Mode is the default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('warung_pojok_aro_theme', theme);
    } catch {
      // ignore storage access errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 1. Initial session checking indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF9EA] dark:bg-[#181614] transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#DB9558] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#6B6357] dark:text-[#A8BBA3]">
            Memuat Warung Pojok Aro...
          </span>
        </div>
      </div>
    );
  }

  // 2. Gateway protection: when not authenticated, show the dedicated Auth Gateway Screen
  if (!isAuthenticated) {
    return <AuthGatewayScreen theme={theme} onToggleTheme={toggleTheme} />;
  }

  // 3. Authenticated: enter the full Beranda Website
  return (
    <div className="min-h-screen flex flex-col bg-page text-heading transition-colors duration-200">
      {/* Opening Welcome Animation */}
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}

      <Header theme={theme} onToggleTheme={toggleTheme} onReplayIntro={() => setShowIntro(true)} />
      <main className="flex-grow">
        <Hero />
        <Categories />
        <About />
        <OpeningHours />
        <Location />
        <Contact />
      </main>
      <Footer onReplayIntro={() => setShowIntro(true)} />

      {/* Authentication & Profile Modals */}
      <LogoutConfirmModal />
      <AdminPanelModal />
      <MemberModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
