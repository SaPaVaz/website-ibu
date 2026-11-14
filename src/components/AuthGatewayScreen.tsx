import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Loader2, AlertCircle, UserPlus, ArrowRight } from 'lucide-react';
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
  const [errorReason, setErrorReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setErrorReason(null);

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
          setErrorReason(res.reason || null);
          setErrorMessage(res.message || 'Incorrect email or password. Please try again.');
        }
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToSignup = () => {
    setTab('signup');
    setErrorMessage('');
    setErrorReason(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-page text-heading p-3.5 sm:p-6 md:p-8 relative select-none">
      {/* Top Bar Branding */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between gap-2 py-2.5 sm:py-3 border-b border-theme pb-3.5 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <LogoImage sizeClass="w-8 h-8 sm:w-9 sm:h-9" />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-bold tracking-tight text-xs sm:text-sm uppercase text-heading truncate">
              WARUNG POJOK ARO
            </span>
            <span className="text-[11px] sm:text-xs text-muted truncate">
              Daily Groceries &bull; Mojotengah, Wonosobo
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-lg border border-theme text-heading bg-surface shrink-0">
          Mojotengah
        </span>
      </header>

      {/* Main Gateway Card matching Dark Theme */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-5 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-theme bg-card-theme p-5 sm:p-8 shadow-xl"
        >
          {/* Logo & Clean Title */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3">
              <LogoImage sizeClass="w-full h-full" />
            </div>

            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-heading uppercase">
              Warung Pojok Aro
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
              Login or create an account to access the store.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 p-1.5 rounded-xl bg-surface border border-theme mb-5 sm:mb-6 gap-2">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage('');
                setErrorReason(null);
              }}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                tab === 'login'
                  ? 'bg-[#DB9558] text-white shadow-sm ring-1 ring-[#DB9558]'
                  : 'bg-card-theme text-heading hover:bg-surface border border-theme'
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMessage('');
                setErrorReason(null);
              }}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer text-center ${
                tab === 'signup'
                  ? 'bg-[#DB9558] text-white shadow-sm ring-1 ring-[#DB9558]'
                  : 'bg-card-theme text-heading hover:bg-surface border border-theme'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error / Warning Alert Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                className="mb-4 overflow-hidden"
              >
                <div className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-snug space-y-2 ${
                  errorReason === 'NOT_REGISTERED'
                    ? 'bg-surface border-[#DB9558]/60 text-heading'
                    : 'bg-red-950/40 border border-red-900/60 text-red-300'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${errorReason === 'NOT_REGISTERED' ? 'text-[#DB9558]' : ''}`} />
                    <div className="flex-1">
                      {errorReason === 'NOT_REGISTERED' ? (
                        <>
                          <strong className="block font-bold text-heading">Account Not Registered</strong>
                          <span className="text-muted">{errorMessage}</span>
                        </>
                      ) : (
                        <span>{errorMessage}</span>
                      )}
                    </div>
                  </div>

                  {/* Direct action button to Sign Up when email is not registered */}
                  {errorReason === 'NOT_REGISTERED' && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleSwitchToSignup}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#DB9558] hover:bg-[#C98246] text-white shadow-xs transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Sign Up with this email</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form with High-Contrast Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up Only) */}
            {tab === 'signup' && (
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-heading">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-theme bg-surface text-heading text-sm placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-all"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-heading">
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme bg-surface text-heading text-sm placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-heading">
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
                  className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-theme bg-surface text-heading text-sm placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={isSubmitting}
                  className="absolute right-3.5 p-1 text-muted hover:text-heading transition-colors cursor-pointer"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-heading">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-theme bg-surface text-heading text-sm placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-all"
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
          <div className="mt-6 pt-4 border-t border-theme text-center">
            <p className="text-xs text-muted">
              {tab === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setErrorMessage('');
                      setErrorReason(null);
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
                      setErrorReason(null);
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
      <footer className="relative z-10 w-full max-w-4xl mx-auto py-3 text-center text-[11px] sm:text-xs text-muted border-t border-theme pt-3">
        <p>&copy; {new Date().getFullYear()} Warung Pojok Aro &bull; Kleyang Jurang, Mojotengah, Wonosobo</p>
      </footer>
    </div>
  );
};
