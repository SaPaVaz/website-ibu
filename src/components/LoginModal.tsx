import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogoImage } from './Logo';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, loginModalMode, closeLoginModal, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoginModalOpen) {
      setMode(loginModalMode || 'login');
      setErrorMessage('');
    }
  }, [isLoginModalOpen, loginModalMode]);

  if (!isLoginModalOpen) return null;

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

    if (mode === 'signup') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await signup(name, email, password);
        if (!res.success) {
          setErrorMessage(res.message || 'Registration failed.');
        } else {
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      } catch {
        setErrorMessage('A network error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Login mode
      setIsSubmitting(true);
      try {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.message || 'Incorrect email or password. Please try again.');
        } else {
          setEmail('');
          setPassword('');
        }
      } catch {
        setErrorMessage('A network error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMessage('');
    closeLoginModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E1B18] p-6 sm:p-8 shadow-2xl z-10 transition-colors"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-auth-title"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="mb-2.5">
              <LogoImage sizeClass="w-12 h-12" />
            </div>
            <h2 id="modal-auth-title" className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Warung Pojok Aro &bull; Wonosobo
            </p>
          </div>

          {/* Toggle Tabs: High Contrast in both Light and Dark mode */}
          <div className="grid grid-cols-2 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 mb-5 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                mode === 'login'
                  ? 'bg-[#DB9558] text-white shadow-sm ring-1 ring-[#DB9558]'
                  : 'bg-white/80 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                mode === 'signup'
                  ? 'bg-[#DB9558] text-white shadow-sm ring-1 ring-[#DB9558]'
                  : 'bg-white/80 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Alert Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                className="mb-5 overflow-hidden"
              >
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm leading-snug">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5 text-left">
                <label htmlFor="auth-modal-name" className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Full Name
                </label>
                <input
                  id="auth-modal-name"
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

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="auth-modal-email" className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Email Address
              </label>
              <input
                id="auth-modal-email"
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

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="auth-modal-password" className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="auth-modal-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter your password'}
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
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5 text-left">
                <label htmlFor="auth-modal-confirm" className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Confirm Password
                </label>
                <input
                  id="auth-modal-confirm"
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
                className="btn-primary w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{mode === 'signup' ? 'Creating Account...' : 'Logging in...'}</span>
                  </>
                ) : (
                  <span>{mode === 'signup' ? 'Sign Up' : 'Login'}</span>
                )}
              </button>
            </div>
          </form>

          {/* Switch tab footer */}
          <div className="mt-5 pt-3.5 border-t border-neutral-200 dark:border-neutral-700 text-center text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-[#DB9558] font-bold hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className="text-[#DB9558] font-bold hover:underline cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
