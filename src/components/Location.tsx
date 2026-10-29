import React, { useState } from 'react';
import { MapPin, ExternalLink, Copy, Check } from 'lucide-react';

export const Location: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const fullAddress =
    'Kleyang Jurang RT 07/RW 01, Kleang Jurang, Pungangan, Kecamatan Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351.';
  const plusCode = 'MV6Q+6V Pungangan, Kabupaten Wonosobo, Jawa Tengah.';
  const mapsUrl =
    'https://www.google.com/maps/place/WARUNG+POJOK+ARO/@-7.3394647,109.8894942,780a,75y,76.33h,90t/data=!3m7!1e1!3m5!1sjZ2wEhKqqprd89NWV1FJvA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.google.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DjZ2wEhKqqprd89NWV1FJvA%26yaw%3D76.33181!7i16384!8i8192!4m6!3m5!1s0x2e7aa1d123fb6241:0xc0a460add977a02f!8m2!3d-7.3394616!4d109.8896555!16s%2Fg%2F11fhs4wnl_';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${fullAddress} (Plus Code: ${plusCode})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full py-16 sm:py-20 border-b border-theme bg-page transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            <MapPin className="w-4 h-4" />
            <span>Petunjuk Lokasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
            Lokasi Warung
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Address Details Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-theme bg-card-theme p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Alamat Lengkap
                </h3>
                <p className="text-base sm:text-lg text-heading leading-relaxed">
                  {fullAddress}
                </p>
              </div>

              <div className="pt-4 border-t border-theme">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Plus Code
                </h3>
                <p className="font-mono text-sm sm:text-base text-heading">
                  {plusCode}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg text-sm font-medium shadow-xs"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Alamat Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-muted" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-6 w-full">
            <div className="rounded-2xl overflow-hidden border border-theme bg-surface shadow-xs">
              <div className="p-3 border-b border-theme flex items-center justify-between text-xs text-muted">
                <span className="font-medium text-heading">Peta Wilayah Mojotengah, Wonosobo</span>
                <span className="font-mono">56351</span>
              </div>
              <div className="relative w-full h-[280px] sm:h-[320px] bg-neutral-100 dark:bg-neutral-900">
                <iframe
                  title="Peta Lokasi Warung Pojok Aro Wonosobo"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=-7.3394616,109.8896555+(WARUNG+POJOK+ARO)&hl=id&z=17&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
