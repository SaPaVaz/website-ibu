import React from 'react';
import { MessageCircle, MapPin, Store } from 'lucide-react';

export const Hero: React.FC = () => {
  const whatsappUrl = 'https://wa.me/6282220615261';
  const mapsUrl =
    'https://www.google.com/maps/place/WARUNG+POJOK+ARO/@-7.3394647,109.8894942,780a,75y,76.33h,90t/data=!3m7!1e1!3m5!1sjZ2wEhKqqprd89NWV1FJvA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.google.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DjZ2wEhKqqprd89NWV1FJvA%26yaw%3D76.33181!7i16384!8i8192!4m6!3m5!1s0x2e7aa1d123fb6241:0xc0a460add977a02f!8m2!3d-7.3394616!4d109.8896555!16s%2Fg%2F11fhs4wnl_';

  return (
    <section className="relative w-full pt-8 pb-16 sm:pt-14 sm:pb-20 border-b border-theme bg-page transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme bg-surface text-xs font-medium text-muted">
              <Store className="w-3.5 h-3.5 text-heading" />
              <span>Wonosobo, Jawa Tengah</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-heading leading-[1.12]">
                Warung Pojok Aro
              </h1>
              <p className="text-lg sm:text-xl font-medium text-heading/85">
                Menyediakan Kebutuhan Harian Anda
              </p>
            </div>

            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              Temukan berbagai kebutuhan sehari-hari Anda dalam satu tempat. Praktis, dekat, dan mudah dijangkau dengan stok lengkap dan harga bersahabat.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm sm:text-base font-medium shadow-xs"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Hubungi Kami</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm sm:text-base font-medium shadow-xs"
              >
                <MapPin className="w-5 h-5 text-muted" />
                <span>Lihat Lokasi</span>
              </a>
            </div>
          </div>

          {/* 2 Real Photos: Tampak Depan & Rak Sembako/Es Krim */}
          <div className="lg:col-span-6 w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Photo 1: Tampak Depan Toko */}
              <div className="group relative rounded-2xl overflow-hidden border border-theme shadow-md bg-surface aspect-3/4 sm:aspect-4/5 max-h-[480px]">
                <img
                  src="/images/hero_storefront.jpg"
                  alt="Tampak depan toko Warung Pojok Aro dengan spanduk Mini ATM dan etalase toko"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="inline-block px-2 sm:px-2.5 py-1 rounded-md bg-neutral-900/85 backdrop-blur-sm text-white text-[11px] sm:text-xs font-medium">
                    Tampak Depan Warung
                  </span>
                </div>
              </div>

              {/* Photo 2: Sembako & Es Krim */}
              <div className="group relative rounded-2xl overflow-hidden border border-theme shadow-md bg-surface aspect-3/4 sm:aspect-4/5 max-h-[480px]">
                <img
                  src="/images/hero_sembako.jpg"
                  alt="Rak sembako, beras, minyak goreng kemasan, dan freezer es krim Aice"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="inline-block px-2 sm:px-2.5 py-1 rounded-md bg-neutral-900/85 backdrop-blur-sm text-white text-[11px] sm:text-xs font-medium">
                    Sembako & Es Krim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
