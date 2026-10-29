import React from 'react';
import { MapPin, Clock, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-page border-t border-theme transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Identity & Slogan with Official Logo */}
          <div className="lg:col-span-6 space-y-3">
            <Logo size="md" showSlogan={true} />
            <p className="text-xs sm:text-sm text-muted max-w-md leading-relaxed pt-1">
              Warung kelontong penyedia kebutuhan harian warga dan masyarakat sekitar dengan pelayanan yang ramah, dekat, dan praktis.
            </p>
          </div>

          {/* Quick Info */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                <MapPin className="w-3.5 h-3.5" />
                <span>Alamat</span>
              </div>
              <p className="text-xs sm:text-sm text-heading leading-relaxed">
                Kleyang Jurang, Pungangan, Mojotengah, Wonosobo
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>Jam Operasional</span>
              </div>
              <p className="text-xs sm:text-sm text-heading">
                Setiap Hari
              </p>
              <p className="text-xs sm:text-sm font-mono text-muted">
                05.00–21.00 WIB
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-heading">
                082220615261
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-theme flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>
            &copy; {currentYear} Warung Pojok Aro. Hak Cipta Dilindungi.
          </p>
          <p className="text-[11px]">
            Profil Bisnis Resmi &bull; Mojotengah, Wonosobo, Jawa Tengah
          </p>
        </div>
      </div>
    </footer>
  );
};
