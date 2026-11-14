import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Check, Loader2, Power, Store, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useStoreStatus } from '../context/StoreStatusContext';

interface DaySchedule {
  day: string;
  hours: string;
  dayIndex: number; // 0 = Ahad, 1 = Senin, etc.
}

const SCHEDULE: DaySchedule[] = [
  { day: 'Senin', hours: '05.00–21.00 WIB', dayIndex: 1 },
  { day: 'Selasa', hours: '05.00–21.00 WIB', dayIndex: 2 },
  { day: 'Rabu', hours: '05.00–21.00 WIB', dayIndex: 3 },
  { day: 'Kamis', hours: '05.00–21.00 WIB', dayIndex: 4 },
  { day: 'Jumat', hours: '05.00–21.00 WIB', dayIndex: 5 },
  { day: 'Sabtu', hours: '05.00–21.00 WIB', dayIndex: 6 },
  { day: 'Ahad', hours: '05.00–21.00 WIB', dayIndex: 0 },
];

export const OpeningHours: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const { status, isUpdating, updateStatus } = useStoreStatus();

  const [wibTimeStr, setWibTimeStr] = useState<string>('');
  const [scheduleIsOpen, setScheduleIsOpen] = useState<boolean>(true);
  const [todayIndex, setTodayIndex] = useState<number>(1);

  const [reasonInput, setReasonInput] = useState<string>(status.note || '');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setReasonInput(status.note || '');
  }, [status.note]);

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const jakartaDate = new Date(
          now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
        );
        const hours = jakartaDate.getHours();
        const minutes = jakartaDate.getMinutes();
        const day = jakartaDate.getDay();

        setTodayIndex(day);
        setScheduleIsOpen(hours >= 5 && hours < 21);

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        setWibTimeStr(`${formattedHours}.${formattedMinutes} WIB`);
      } catch {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const wibHours = (utcHours + 7) % 24;
        setScheduleIsOpen(wibHours >= 5 && wibHours < 21);
        setWibTimeStr(
          `${String(wibHours).padStart(2, '0')}.${String(now.getUTCMinutes()).padStart(2, '0')} WIB`
        );
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const effectiveIsOpen =
    status.mode === 'open'
      ? true
      : status.mode === 'closed'
      ? false
      : scheduleIsOpen;

  const isClosed = !effectiveIsOpen;

  const handleSetOpen = async () => {
    setFeedback(null);
    const res = await updateStatus('open', '');
    if (res.success) {
      setReasonInput('');
      setFeedback({ type: 'success', text: res.message || 'Status warung diubah menjadi Buka.' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Gagal memperbarui status warung.' });
    }
  };

  const handleSetClosed = async () => {
    setFeedback(null);
    const res = await updateStatus('closed', reasonInput);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message || 'Status warung diubah menjadi Tutup.' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Gagal memperbarui status warung.' });
    }
  };

  // MEMBER VIEW (Distinct, friendly card without the 7-day operational schedule table)
  if (!isAdmin) {
    return (
      <section className="w-full py-12 sm:py-18 border-b border-theme bg-surface transition-colors overflow-hidden">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-2xl mb-7 sm:mb-9"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              <Store className="w-4 h-4" />
              <span>Info Warung</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
              Status Warung Hari Ini
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-2xl border p-5 sm:p-8 shadow-xs transition-colors ${
              effectiveIsOpen
                ? 'border-[#97A87A]/45 bg-card-theme'
                : 'border-red-500/35 bg-card-theme'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                    effectiveIsOpen
                      ? 'bg-[#97A87A]/15 border-[#97A87A]/35 text-[#6D7E52] dark:text-[#A8BBA3]'
                      : 'bg-red-500/12 border-red-500/30 text-red-600 dark:text-red-400'
                  }`}
                >
                  {effectiveIsOpen ? (
                    <Store className="w-6 h-6 sm:w-7 sm:h-7" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="relative flex h-3 w-3 shrink-0">
                      {effectiveIsOpen ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97A87A] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#97A87A]" />
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                      )}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-heading">
                      {effectiveIsOpen ? 'Warung Sedang Buka' : 'Warung Sedang Tutup'}
                    </h3>
                  </div>

                  {effectiveIsOpen ? (
                    <p className="text-sm text-muted leading-relaxed max-w-xl">
                      Silakan berkunjung langsung ke Warung Pojok Aro untuk berbelanja kebutuhan harian maupun transaksi Mini ATM.
                    </p>
                  ) : status.note ? (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-heading max-w-xl">
                      <span className="font-semibold text-[#DB9558] block text-xs uppercase tracking-wider mb-1">
                        Alasan Tutup
                      </span>
                      <p className="leading-relaxed">{status.note}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted leading-relaxed max-w-xl">
                      Warung sedang tutup untuk sementara waktu. Silakan cek kembali nanti atau hubungi kami via WhatsApp.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-theme">
                {wibTimeStr && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-theme bg-surface text-xs font-medium text-muted">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{wibTimeStr}</span>
                  </div>
                )}

                <a
                  href={effectiveIsOpen ? '#lokasi' : '#kontak'}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  {effectiveIsOpen ? (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-[#DB9558]" />
                      <span>Lihat Lokasi Warung</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-3.5 h-3.5 text-[#97A87A]" />
                      <span>Hubungi via WhatsApp</span>
                    </>
                  )}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // SUPER ADMIN & ADMIN VIEW (Full Operational Schedule; Super Admin gets simple Alasan + Buka/Tutup control)
  return (
    <section className="w-full py-12 sm:py-20 border-b border-theme bg-surface transition-colors overflow-hidden">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-2xl mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            <Clock className="w-4 h-4" />
            <span>Jadwal Buka</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
            Jam Operasional
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-theme bg-card-theme p-4 sm:p-8 shadow-xs space-y-6"
        >
          {/* Real-time Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-theme gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <span className="relative flex h-3.5 w-3.5 mt-1.5 sm:mt-0 shrink-0">
                {effectiveIsOpen ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97A87A] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#97A87A]" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
                )}
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold text-heading">
                    {effectiveIsOpen ? 'Sedang Buka' : 'Sedang Tutup'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted mt-0.5">
                  Buka setiap hari, 05.00–21.00 WIB
                </p>

                {isClosed && status.note && (
                  <div className="mt-2 inline-flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-heading">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#DB9558] shrink-0 mt-0.5" />
                    <span>Alasan Tutup: {status.note}</span>
                  </div>
                )}
              </div>
            </div>

            {wibTimeStr && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-theme bg-surface text-xs font-medium text-muted self-start sm:self-auto shrink-0">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Waktu WIB Saat Ini: {wibTimeStr}</span>
              </div>
            )}
          </div>

          {/* Super Admin Only Simple Control */}
          {isSuperAdmin && (
            <div className="rounded-xl border border-[#DB9558]/40 bg-surface p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-[#DB9558] shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-heading">
                  Atur Status Buka / Tutup Warung
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted">
                  Alasan Tutup (isi jika ingin menutup warung)
                </label>
                <input
                  type="text"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Contoh: Sedang ada keperluan mendadak, istirahat sebentar, dll."
                  maxLength={150}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-theme bg-card-theme text-xs sm:text-sm text-heading placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSetOpen}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-60 ${
                    effectiveIsOpen
                      ? 'border-[#97A87A] bg-[#97A87A]/20 text-heading'
                      : 'border-theme bg-card-theme text-heading hover:border-[#97A87A]/60'
                  }`}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Store className="w-4 h-4 text-[#97A87A] shrink-0" />
                  )}
                  <span>Buka</span>
                </button>

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSetClosed}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-60 ${
                    isClosed
                      ? 'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400'
                      : 'border-theme bg-card-theme text-heading hover:border-red-500/50'
                  }`}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span>Tutup</span>
                </button>
              </div>

              {feedback && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-[#97A87A]/15 border border-[#97A87A]/40 text-heading'
                      : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{feedback.text}</span>
                </div>
              )}
            </div>
          )}

          {/* Full 7-Day Schedule List (Visible ONLY to Super Admin & Admin) */}
          <div className="divide-y divide-theme">
            {SCHEDULE.map((item) => {
              const isToday = item.dayIndex === todayIndex;
              return (
                <div
                  key={item.day}
                  className={`py-3.5 flex items-center justify-between transition-colors ${
                    isToday ? 'font-semibold text-heading' : 'text-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base">{item.day}</span>
                    {isToday && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#97A87A]/40 bg-[#97A87A]/15 text-heading">
                        Hari Ini
                      </span>
                    )}
                    {isToday && isClosed && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border border-red-500/30 bg-red-500/15 text-red-600 dark:text-red-400">
                        Tutup
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm sm:text-base tracking-tight font-mono ${
                      isToday && isClosed ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {item.hours}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
