import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = '082220615261';
  const whatsappUrl = 'https://wa.me/6282220615261';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full py-16 sm:py-20 border-b border-theme bg-surface transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
            Hubungi Kami
          </h2>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            Untuk informasi mengenai produk dan layanan yang tersedia, silakan hubungi Warung Pojok Aro melalui WhatsApp.
          </p>
        </div>

        <div className="rounded-2xl border border-theme bg-card-theme p-8 sm:p-10 max-w-xl mx-auto shadow-xs space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">
              Nomor WhatsApp
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-heading tracking-tight">
                {phoneNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyNumber}
                title="Salin nomor WhatsApp"
                className="p-2 rounded-lg border border-theme hover:bg-surface text-muted hover:text-heading transition-colors"
                aria-label="Salin nomor WhatsApp"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#97A87A] dark:text-[#A8BBA3]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-[#97A87A] dark:text-[#A8BBA3] mt-1">
                Nomor WhatsApp berhasil disalin
              </p>
            )}
          </div>

          <div className="flex items-center justify-center pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg text-sm sm:text-base font-medium shadow-xs"
            >
              {/* WhatsApp Professional SVG icon */}
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.101-.475-.15-.676.15-.201.3-.777.979-.953 1.18-.175.201-.351.226-.651.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.301-.019-.464.132-.614.136-.134.301-.35.451-.526.15-.175.2-.301.301-.501.101-.201.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.233-.244-.588-.492-.508-.676-.517l-.577-.01c-.201 0-.526.075-.802.376-.275.3-1.052 1.028-1.052 2.507 0 1.479 1.077 2.908 1.228 3.109.15.201 2.12 3.238 5.137 4.542.717.311 1.278.497 1.714.636.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.429.25-.702.25-1.303.175-1.429-.075-.125-.275-.201-.576-.351zM12.04 2C6.516 2 2.036 6.478 2.036 12c0 1.97.575 3.805 1.567 5.358L2 22l4.786-1.562A9.957 9.957 0 0012.04 22c5.525 0 10.005-4.478 10.005-10S17.565 2 12.04 2zm0 18.257c-1.674 0-3.233-.497-4.544-1.353l-.326-.213-3.376 1.102 1.125-3.29-.234-.338a8.217 8.217 0 01-1.32-4.465c0-4.582 3.73-8.31 8.355-8.31 4.624 0 8.355 3.728 8.355 8.31 0 4.582-3.731 8.257-8.355 8.257z" />
              </svg>
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
