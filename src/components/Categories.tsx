import React from 'react';
import {
  ShoppingBag,
  UtensilsCrossed,
  CupSoda,
  Cookie,
  PenTool,
  PawPrint,
  Sparkles,
  CreditCard,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'sembako',
    title: 'Sembako',
    description: 'Berbagai kebutuhan pokok sehari-hari.',
    icon: ShoppingBag,
  },
  {
    id: 'makanan',
    title: 'Makanan',
    description: 'Pilihan makanan untuk kebutuhan harian.',
    icon: UtensilsCrossed,
  },
  {
    id: 'minuman',
    title: 'Minuman',
    description: 'Berbagai pilihan minuman.',
    icon: CupSoda,
  },
  {
    id: 'snack',
    title: 'Snack Ringan',
    description: 'Camilan untuk menemani waktu santai.',
    icon: Cookie,
  },
  {
    id: 'alat-tulis',
    title: 'Alat Tulis',
    description: 'Perlengkapan untuk belajar dan menulis.',
    icon: PenTool,
  },
  {
    id: 'pakan-hewan',
    title: 'Pakan Hewan',
    description: 'Kebutuhan pakan untuk hewan peliharaan.',
    icon: PawPrint,
  },
  {
    id: 'aksesori',
    title: 'Aksesori',
    description: 'Berbagai aksesori untuk kebutuhan sehari-hari.',
    icon: Sparkles,
  },
  {
    id: 'mini-atm',
    title: 'Mini ATM',
    description: 'Layanan mini ATM untuk membantu kebutuhan transaksi pelanggan.',
    icon: CreditCard,
  },
];

export const Categories: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-20 border-b border-theme bg-surface transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
            Warung Pojok
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted">
            Menyediakan kebutuhan harian anda, mulai dari:
          </p>
        </div>

        {/* 8 Category Cards: 2 cols on mobile, 4 on tablet & desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {CATEGORIES.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-xl border border-theme bg-card-theme transition-all duration-200 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-0.5"
              >
                <div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-theme bg-surface flex items-center justify-center text-heading mb-4 sm:mb-5 transition-colors group-hover:border-neutral-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-heading tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
