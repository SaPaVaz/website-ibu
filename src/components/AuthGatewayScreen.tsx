import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
  UserPlus,
  LogIn,
  Store,
  MapPin,
  Sparkles,
} from 'lucide-react';
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
      setErrorMessage('Silakan isi email Anda.');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan isi password Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (tab === 'signup') {
        if (password.length < 6) {
          setErrorMessage('Password minimal harus 6 karakter.');
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Konfirmasi password tidak cocok.');
          setIsSubmitting(false);
          return;
        }

        const res = await signup(name, email, password);
        if (!res.success) {
          setErrorMessage(res.message || 'Pendaftaran gagal. Silakan coba lagi.');
        }
        // If success, AuthContext automatically updates isAuthenticated = true and user enters Beranda immediately!
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.message || 'Email atau password yang Anda masukkan salah.');
        }
        // If success, AuthContext automatically updates isAuthenticated = true and user enters Beranda immediately!
      }
    } catch {
      setErrorMessage('Terjadi kendala jaringan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setTab('login');
    setEmail(fillEmail);
    setPassword(fillPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#FCF9EA] dark:bg-[#181614] text-[#2B2520] dark:text-[#FCF9EA] transition-colors p-4 sm:p-6 md:p-8 relative overflow-hidden select-none">
      {/* Background Ambience Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#DB9558]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#97A87A]/25 blur-3xl pointer-events-none" />

      {/* Top Bar Branding */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <LogoImage sizeClass="w-8 h-8 sm:w-9 sm:h-9" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold tracking-tight text-xs sm:text-sm uppercase">
              WARUNG POJOK ARO
            </span>
            <span className="text-[10px] text-[#97A87A] dark:text-[#A8BBA3] font-medium">
              Toko Serba Ada &bull; Wonosobo
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E3DCBE] dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm text-[11px] font-medium text-[#6B6357] dark:text-[#A8BBA3]">
          <MapPin className="w-3 h-3 text-[#DB9558]" />
          <span>Mojotengah</span>
        </div>
      </header>

      {/* Main Gateway Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-[#E3DCBE] dark:border-neutral-800 bg-white/95 dark:bg-[#221F1B]/95 backdrop-blur-md p-6 sm:p-8 shadow-xl"
        >
          {/* Logo & Welcome Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-3.5 relative">
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-[#DB9558]/30 to-[#97A87A]/30 blur-xs"
              />
              <LogoImage sizeClass="w-full h-full" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#97A87A]/15 border border-[#97A87A]/30 text-[11px] font-semibold text-[#97A87A] dark:text-[#A8BBA3] mb-2">
              <Store className="w-3 h-3 text-[#DB9558]" />
              <span>Pintu Masuk Website</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase">
              Warung Pojok Aro
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8BBA3] mt-1 leading-relaxed">
              Silakan masuk atau daftar akun terlebih dahulu untuk mengakses beranda dan katalog toko.
            </p>
          </div>

          {/* Toggle Tabs: Masuk (Login) vs Daftar (Sign Up) */}
          <div className="flex p-1 rounded-2xl bg-[#FCF9EA] dark:bg-neutral-900 border border-[#E3DCBE] dark:border-neutral-800 mb-5">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'login'
                  ? 'bg-white dark:bg-[#282420] text-heading shadow-xs border border-[#E3DCBE] dark:border-neutral-700'
                  : 'text-muted hover:text-heading'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-[#DB9558]" />
              <span>Masuk (Login)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'signup'
                  ? 'bg-white dark:bg-[#282420] text-heading shadow-xs border border-[#E3DCBE] dark:border-neutral-700'
                  : 'text-muted hover:text-heading'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#97A87A]" />
              <span>Daftar (Sign Up)</span>
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
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm leading-snug">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nama Lengkap (Sign Up Only) */}
            {tab === 'signup' && (
              <div className="space-y-1 text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6357] dark:text-[#A8BBA3]">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-muted pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3DCBE] dark:border-neutral-700 bg-[#FCF9EA]/60 dark:bg-neutral-900/60 text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6357] dark:text-[#A8BBA3]">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-muted pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3DCBE] dark:border-neutral-700 bg-[#FCF9EA]/60 dark:bg-neutral-900/60 text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6357] dark:text-[#A8BBA3]">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-muted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Minimal 6 karakter' : 'Masukkan password'}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E3DCBE] dark:border-neutral-700 bg-[#FCF9EA]/60 dark:bg-neutral-900/60 text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] transition-all"
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

            {/* Konfirmasi Password (Sign Up Only) */}
            {tab === 'signup' && (
              <div className="space-y-1 text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6357] dark:text-[#A8BBA3]">
                  Konfirmasi Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-muted pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password di atas"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3DCBE] dark:border-neutral-700 bg-[#FCF9EA]/60 dark:bg-neutral-900/60 text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 px-4 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60 transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{tab === 'signup' ? 'Mendaftarkan Akun...' : 'Masuk ke Beranda...'}</span>
                  </>
                ) : (
                  <>
                    {tab === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    <span>{tab === 'signup' ? 'Daftar & Langsung Masuk' : 'Masuk ke Beranda Website'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Access Badges for Owner */}
          <div className="mt-6 pt-4 border-t border-[#E3DCBE] dark:border-neutral-800 text-center">
            <div className="text-[11px] text-muted space-y-2">
              <p>
                {tab === 'signup' ? (
                  <>
                    Sudah punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-[#DB9558] font-bold hover:underline cursor-pointer"
                    >
                      Masuk di sini
                    </button>
                  </>
                ) : (
                  <>
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('signup')}
                      className="text-[#DB9558] font-bold hover:underline cursor-pointer"
                    >
                      Daftar akun baru
                    </button>
                  </>
                )}
              </p>

              {/* Quick fill helper for owner */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('safarazqiaa@gmail.com', 'Tasik*2026')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#97A87A]/15 hover:bg-[#97A87A]/25 text-[#97A87A] dark:text-[#A8BBA3] border border-[#97A87A]/30 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#DB9558]" />
                  <span>Isi Otomatis Akun Pemilik (safarazqiaa@gmail.com)</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto py-2 text-center text-[11px] text-[#6B6357] dark:text-[#A8BBA3]">
        <p>&copy; {new Date().getFullYear()} Warung Pojok Aro &bull; Toko Serba Ada &bull; Kleyang Jurang, Mojotengah, Wonosobo</p>
      </footer>
    </div>
  );
};
