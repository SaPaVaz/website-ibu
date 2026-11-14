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
import { StoreStatusProvider } from './context/StoreStatusContext';
import { AuthGatewayScreen } from './components/AuthGatewayScreen';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { MemberModal } from './components/MemberModal';
import { CursorTrail } from './components/CursorTrail';

import { CategoryCatalogPage } from './components/CategoryCatalogPage';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  }, []);

  // Sync browser back/forward buttons with selectedCategory
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.category === 'string') {
        setSelectedCategory(e.state.category);
      } else {
        setSelectedCategory(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    window.history.pushState({ category: categoryId }, '', `#katalog-${categoryId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    if (window.location.hash.startsWith('#katalog')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Initial session checking indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#181614]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#DB9558] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#A8BBA3]">
            Memuat Warung Pojok Aro...
          </span>
        </div>
      </div>
    );
  }

  // 2. Gateway protection: when not authenticated, show the dedicated Auth Gateway Screen
  if (!isAuthenticated) {
    return <AuthGatewayScreen />;
  }

  // 3. Authenticated: enter the full Beranda Website or Catalog View
  return (
    <div className="min-h-screen flex flex-col bg-page text-heading">
      {/* Opening Welcome Animation */}
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}

      <Header
        onHomeClick={handleBackToHome}
        onReplayIntro={() => {
          setSelectedCategory(null);
          setShowIntro(true);
        }}
      />

      <main className="flex-grow">
        {selectedCategory ? (
          <CategoryCatalogPage
            categoryId={selectedCategory}
            onBack={handleBackToHome}
            onSelectCategory={handleSelectCategory}
          />
        ) : (
          <>
            <Hero />
            <Categories onSelectCategory={handleSelectCategory} />
            <About />
            <OpeningHours />
            <Location />
            <Contact />
          </>
        )}
      </main>

      <Footer
        onReplayIntro={() => {
          setSelectedCategory(null);
          setShowIntro(true);
        }}
      />

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
      <StoreStatusProvider>
        <CursorTrail />
        <MainApp />
      </StoreStatusProvider>
    </AuthProvider>
  );
}
