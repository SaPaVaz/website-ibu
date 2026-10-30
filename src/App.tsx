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

export default function App() {
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
    </div>
  );
}
