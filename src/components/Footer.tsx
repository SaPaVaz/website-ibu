import React from 'react';
import { MapPin, Clock, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useStoreStatus } from '../context/StoreStatusContext';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, isAdmin, openLoginModal, openAdminPanel, openMemberModal } = useAuth();
  const { status } = useStoreStatus();

  const getScheduleOpenNow = () => {
    try {
      const jakartaDate = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
      );
      const h = jakartaDate.getHours();
      return h >= 5 && h < 21;
    } catch {
      return true;
    }
  };

  const isStoreOpen =
    status.mode === 'open' ? true : status.mode === 'closed' ? false : getScheduleOpenNow();

  return (
    <footer className="w-full bg-page border-t border-theme transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Identity & Slogan with Official Logo */}
          <div className="lg:col-span-5 space-y-3">
            <Logo size="md" showSlogan={true} />
            <p className="text-xs sm:text-sm text-muted max-w-md leading-relaxed pt-1">
              Warung kelontong penyedia kebutuhan harian warga dan masyarakat sekitar dengan pelayanan yang ramah, dekat, dan praktis.
            </p>
          </div>

          {/* Quick Info - Responsive grid on Mobile, Tablet & Desktop */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Alamat</span>
              </div>
              <p className="text-xs sm:text-sm text-heading leading-relaxed">
                Kleyang Jurang RT 07/RW 01, Kleang Jurang, Pungangan, Kecamatan Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351.
              </p>
            </div>

            {isAdmin ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Jam Operasional</span>
                </div>
                <p className="text-xs sm:text-sm text-heading whitespace-nowrap">
                  Setiap Hari
                </p>
                <p className="text-xs sm:text-sm font-mono text-muted whitespace-nowrap">
                  05.00–21.00 WIB
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Status Warung</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-heading flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isStoreOpen ? 'bg-[#97A87A]' : 'bg-red-500'
                    }`}
                  />
                  <span>{isStoreOpen ? 'Sedang Buka' : 'Sedang Tutup'}</span>
                </p>
                {!isStoreOpen && status.note && (
                  <p className="text-xs text-muted line-clamp-2">
                    {status.note}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted whitespace-nowrap">
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">WhatsApp</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-heading whitespace-nowrap">
                082220615261
              </p>
            </div>
          </div>
        </div>

        {/* Copyright & Quick Links */}
        <div className="mt-12 pt-8 border-t border-theme flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>
            &copy; {currentYear} Warung Pojok Aro. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-wrap justify-center">
            {onReplayIntro && (
              <button
                type="button"
                onClick={onReplayIntro}
                className="hover:text-[#DB9558] transition-colors cursor-pointer"
                title="Tampilkan kembali animasi sambutan"
              >
                Putar Animasi
              </button>
            )}
            <span>&bull;</span>
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => openLoginModal('login')}
                className="hover:text-[#DB9558] transition-colors cursor-pointer"
                title="Masuk atau Daftar Akun"
              >
                Masuk / Daftar Akun
              </button>
            ) : isAdmin ? (
              <button
                type="button"
                onClick={openAdminPanel}
                className="text-[#97A87A] dark:text-[#A8BBA3] hover:underline font-semibold transition-colors cursor-pointer"
                title="Buka panel admin"
              >
                Panel Admin
              </button>
            ) : (
              <button
                type="button"
                onClick={openMemberModal}
                className="text-[#DB9558] hover:underline font-semibold transition-colors cursor-pointer"
                title="Buka portal member"
              >
                Portal Member
              </button>
            )}
            <span>&bull;</span>
            <span>Mojotengah, Wonosobo, Jawa Tengah</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
