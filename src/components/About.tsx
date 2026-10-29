import React from 'react';
import { Store, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-20 border-b border-theme bg-page transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* 2 Real Photos: Etalase Alat Tulis & Rak Perlengkapan Harian */}
          <div className="lg:col-span-6 order-2 lg:order-1 w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Photo 1: Etalase Kaca Alat Tulis & Aksesori */}
              <div className="group relative rounded-2xl overflow-hidden border border-theme shadow-md bg-surface aspect-3/4 sm:aspect-4/5 max-h-[480px]">
                <img
                  src="/images/about_interior.jpg"
                  alt="Etalase kaca aneka perlengkapan alat tulis dan aksesori Warung Pojok Aro"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="inline-block px-2 sm:px-2.5 py-1 rounded-md bg-neutral-900/85 backdrop-blur-sm text-white text-[11px] sm:text-xs font-medium">
                    Alat Tulis & Aksesori
                  </span>
                </div>
              </div>

              {/* Photo 2: Rak Kebersihan & Rumah Tangga */}
              <div className="group relative rounded-2xl overflow-hidden border border-theme shadow-md bg-surface aspect-3/4 sm:aspect-4/5 max-h-[480px]">
                <img
                  src="/images/about_kebersihan.jpg"
                  alt="Rak perlengkapan kebersihan dan kebutuhan rumah tangga Warung Pojok Aro"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="inline-block px-2 sm:px-2.5 py-1 rounded-md bg-neutral-900/85 backdrop-blur-sm text-white text-[11px] sm:text-xs font-medium">
                    Kebutuhan Rumah Tangga
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Store className="w-4 h-4 text-heading" />
              <span>Profil Warung</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-heading">
              Tentang Warung Pojok Aro
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Warung Pojok Aro merupakan warung kelontong toko serba ada yang menyediakan beragam kebutuhan harian bagi masyarakat sekitar. Mulai dari sembako, makanan, minuman, perlengkapan alat tulis, pakan hewan, aksesori, hingga layanan mini ATM, semuanya tersedia dalam satu tempat yang mudah dijangkau.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-heading">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#97A87A] dark:text-[#A8BBA3] shrink-0" />
                <span>Stok Sembako & Es Krim Lengkap</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#97A87A] dark:text-[#A8BBA3] shrink-0" />
                <span>Alat Tulis & Fotokopi/Print</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#97A87A] dark:text-[#A8BBA3] shrink-0" />
                <span>Perlengkapan Mandi & Cuci</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#97A87A] dark:text-[#A8BBA3] shrink-0" />
                <span>Layanan Transaksi Mini ATM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
