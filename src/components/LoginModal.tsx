import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, UserPlus, User } from 'lucide-react';
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
      setErrorMessage('Silakan masukkan email Anda.');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan masukkan password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setErrorMessage('Password minimal harus 6 karakter.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Konfirmasi password tidak cocok.');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await signup(name, email, password);
        if (!res.success) {
          setErrorMessage(res.message || 'Pendaftaran gagal.');
        } else {
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      } catch {
        setErrorMessage('Terjadi kendala saat mendaftar. Silakan coba lagi.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Login mode
      setIsSubmitting(true);
      try {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.message || 'Email atau password yang Anda masukkan salah.');
        } else {
          setEmail('');
          setPassword('');
        }
      } catch {
        setErrorMessage('Terjadi kendala saat menghubungkan ke server. Silakan coba lagi.');
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
          className="relative w-full max-w-md rounded-2xl border border-theme bg-card-theme p-6 sm:p-8 shadow-2xl z-10 transition-colors"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-auth-title"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-heading hover:bg-surface border border-transparent hover:border-theme transition-all cursor-pointer disabled:opacity-50"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="mb-2.5">
              <LogoImage sizeClass="w-11 h-11" />
            </div>
            <h2 id="modal-auth-title" className="text-xl sm:text-2xl font-bold tracking-tight text-heading">
              {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              {mode === 'login'
                ? 'Silakan masuk untuk mengakses fitur akun Warung Pojok Aro'
                : 'Daftar sekarang untuk menjadi Member resmi Warung Pojok Aro'}
            </p>
          </div>

          {/* Toggle Tabs: Login vs Signup */}
          <div className="flex p-1 rounded-xl bg-surface border border-theme mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-card-theme text-heading shadow-xs border border-theme'
                  : 'text-muted hover:text-heading'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-card-theme text-heading shadow-xs border border-theme'
                  : 'text-muted hover:text-heading'
              }`}
            >
              Daftar (Sign Up)
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
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm leading-snug">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-1 text-left">
                <label htmlFor="auth-name" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-muted pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-theme bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label htmlFor="auth-email" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-muted pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'signup' ? 'nama@email.com' : 'Email Anda'}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-theme bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <label htmlFor="auth-password" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-muted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Minimal 6 karakter' : 'Password'}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-11 py-2 rounded-xl border border-theme bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={isSubmitting}
                  className="absolute right-3.5 p-1 text-muted hover:text-heading transition-colors cursor-pointer"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-1 text-left">
                <label htmlFor="auth-confirm" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Konfirmasi Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-muted pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-confirm"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-theme bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{mode === 'signup' ? 'Mendaftarkan Akun...' : 'Memverifikasi Akun...'}</span>
                  </>
                ) : (
                  <>
                    {mode === 'signup' ? <UserPlus className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>{mode === 'signup' ? 'Daftar Sekarang' : 'Masuk ke Akun'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Role rule notice */}
          <div className="mt-5 pt-3.5 border-t border-theme text-center text-[11px] text-muted leading-relaxed">
            {mode === 'signup' ? (
              <p>
                Akun baru otomatis terdaftar sebagai <strong>Member</strong>. Akun pemilik warung (
                <strong>safarazqiaa@gmail.com</strong>) otomatis terdaftar sebagai <strong>Admin</strong>.
              </p>
            ) : (
              <p>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className="text-[#DB9558] font-semibold hover:underline cursor-pointer"
                >
                  Daftar di sini
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
