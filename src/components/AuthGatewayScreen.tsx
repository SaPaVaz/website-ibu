import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogoImage } from './Logo';

export const AuthGatewayScreen: React.FC = () => {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (tab === 'signup') {
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please re-enter.');
          setIsSubmitting(false);
          return;
        }

        const res = await signup(name, email, password);
        if (!res.success) {
          setErrorMessage(res.message || 'Registration failed. Please try again.');
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.message || 'Incorrect email or password. Please try again.');
        }
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#FCF9EA] dark:bg-[#151311] text-[#2B2520] dark:text-[#FCF9EA] transition-colors p-4 sm:p-6 md:p-8 relative select-none">
      {/* Top Bar Branding */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between py-2 border-b border-[#E3DCBE] dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <LogoImage sizeClass="w-9 h-9" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold tracking-tight text-sm uppercase text-[#2B2520] dark:text-neutral-100">
              WARUNG POJOK ARO
            </span>
            <span className="text-xs text-[#6B6357] dark:text-[#A8BBA3]">
              Daily Groceries &bull; Mojotengah, Wonosobo
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-white/80 dark:bg-neutral-800/80">
          Wonosobo
        </span>
      </header>

      {/* Main Gateway Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E1B18] p-6 sm:p-8 shadow-xl"
        >
          {/* Logo & Clean Title */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3">
              <LogoImage sizeClass="w-full h-full" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 uppercase">
              Warung Pojok Aro
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
              Login or create an account to access the store.
            </p>
          </div>

          {/* Toggle Tabs: High-Contrast and Crystal Clear in BOTH Light & Dark Modes */}
          <div className="grid grid-cols-2 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 mb-6 gap-2">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage('');
              }}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                tab === 'login'
                  ? 'bg-[#DB9558] text-white shadow-sm ring-1 ring-[#DB9558]'
                  : 'bg-white/80 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600'
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMessage('');
              }}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                tab === 'signup'
                  ? 'bg-[#DB9558] text-white shadow-sm ring-1 ring-[#DB9558]'
                  : 'bg-white/80 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm leading-snug">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form with Clean High-Contrast Inputs without Clutter */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up Only) */}
            {tab === 'signup' && (
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-all"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Minimum 6 characters' : 'Enter your password'}
                  disabled={isSubmitting}
                  className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={isSubmitting}
                  className="absolute right-3.5 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {tab === 'signup' && (
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-all"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{tab === 'signup' ? 'Creating Account...' : 'Logging in...'}</span>
                  </>
                ) : (
                  <span>{tab === 'signup' ? 'Sign Up' : 'Login'}</span>
                )}
              </button>
            </div>
          </form>

          {/* Switch Tab Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-center">
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              {tab === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setErrorMessage('');
                    }}
                    className="text-[#DB9558] font-bold hover:underline cursor-pointer"
                  >
                    Login here
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setTab('signup');
                      setErrorMessage('');
                    }}
                    className="text-[#DB9558] font-bold hover:underline cursor-pointer"
                  >
                    Sign up here
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto py-2 text-center text-xs text-neutral-600 dark:text-neutral-400 border-t border-[#E3DCBE] dark:border-neutral-800 pt-3">
        <p>&copy; {new Date().getFullYear()} Warung Pojok Aro &bull; Kleyang Jurang, Mojotengah, Wonosobo</p>
      </footer>
    </div>
  );
};
