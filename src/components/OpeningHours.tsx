import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, CircleOff } from 'lucide-react';

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
  const [wibTimeStr, setWibTimeStr] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [todayIndex, setTodayIndex] = useState<number>(1);

  useEffect(() => {
    const updateStatus = () => {
      try {
        const now = new Date();
        const jakartaDate = new Date(
          now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
        );
        const hours = jakartaDate.getHours();
        const minutes = jakartaDate.getMinutes();
        const day = jakartaDate.getDay(); // 0 is Sunday (Ahad)

        setTodayIndex(day);
        // Warung buka dari pukul 05.00 hingga sebelum pukul 21.00 WIB
        setIsOpen(hours >= 5 && hours < 21);

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        setWibTimeStr(`${formattedHours}.${formattedMinutes} WIB`);
      } catch {
        // Fallback if timezone not supported
        const now = new Date();
        const utcHours = now.getUTCHours();
        const wibHours = (utcHours + 7) % 24;
        setIsOpen(wibHours >= 5 && wibHours < 21);
        setWibTimeStr(`${String(wibHours).padStart(2, '0')}.${String(now.getUTCMinutes()).padStart(2, '0')} WIB`);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-16 sm:py-20 border-b border-theme bg-surface transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            <Clock className="w-4 h-4" />
            <span>Jadwal Buka</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
            Jam Operasional
          </h2>
        </div>

        {/* Status Card & Schedule Box */}
        <div className="rounded-2xl border border-theme bg-card-theme p-6 sm:p-8 shadow-xs">
          {/* Real-time Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-theme gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                {isOpen ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-neutral-400" />
                )}
              </span>

              <div>
                <span className="text-lg font-semibold text-heading">
                  {isOpen ? 'Sedang Buka' : 'Sedang Tutup'}
                </span>
                <p className="text-xs sm:text-sm text-muted">
                  Buka setiap hari, 05.00–21.00 WIB
                </p>
              </div>
            </div>

            {wibTimeStr && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-theme bg-surface text-xs font-medium text-muted self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>Waktu WIB Saat Ini: {wibTimeStr}</span>
              </div>
            )}
          </div>

          {/* Schedule List */}
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base">{item.day}</span>
                    {isToday && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border border-theme bg-surface text-heading">
                        Hari Ini
                      </span>
                    )}
                  </div>
                  <span className="text-sm sm:text-base tracking-tight font-mono">
                    {item.hours}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
