import React from 'react';
import {
  Wheat,
  Droplets,
  Coffee,
  Cookie,
  BookOpen,
  Bone,
  Watch,
  CreditCard,
  LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'snack',
    title: 'Snack Ringan',
    description: 'Combro kentang khas Dieng, makaroni gurih, pilus telur gabus, biskuit Roma kelapa, dan Marie Nissin.',
    icon: Cookie,
  },
  {
    id: 'sembako',
    title: 'Sembako',
    description: 'Minyak goreng SunCo 2L, botol Hemart 1L, telur ayam negeri segar, tepung Segitiga Biru, dan Rose Brand.',
    icon: Wheat,
  },
  {
    id: 'minuman',
    title: 'Minuman',
    description: 'Teh Pucuk Harum dingin, kopi Good Day botol, susu Milku Belgian Cows, Sprite, dan Cimory Pororo.',
    icon: Coffee,
  },
  {
    id: 'alat-tulis',
    title: 'Alat Tulis',
    description: 'Buku tulis Mood Milk, pensil 2B warna ujian, pulpen gel Safari, tipe-x Top Brand, krayon Titi, dan amplop.',
    icon: BookOpen,
  },
  {
    id: 'pakan-hewan',
    title: 'Pakan Hewan',
    description: 'Makanan kucing Excel Tuna, pakan ayam BR-1 Wonosobo, pakan lele Hi-Pro Vite, pakan ikan, dan burung.',
    icon: Bone,
  },
  {
    id: 'aksesori',
    title: 'Aksesori',
    description: 'Gunting kuku Cinnamoroll, stiker Kuromi, jepit rambut jedai, scrunchie bunga, peniti, dan jarum pentul.',
    icon: Watch,
  },
  {
    id: 'sabun',
    title: 'Sabun & Kebersihan',
    description: 'Aneka sabun cuci piring, deterjen pakaian, pembersih lantai, sabun mandi, dan perlengkapan kebersihan.',
    icon: Droplets,
  },
  {
    id: 'mini-atm',
    title: 'Mini ATM',
    description: 'Layanan tarik tunai semua rekening bank, transfer antarbank, top up e-wallet, token listrik, dan pulsa.',
    icon: CreditCard,
  },
];

interface CategoriesProps {
  onSelectCategory?: (id: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  return (
    <section className="w-full py-16 sm:py-20 border-b border-theme bg-surface transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Animated Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted mb-2">
            <span>Katalog Kebutuhan Harian</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
            Warung Pojok
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted">
            Menyediakan kebutuhan harian anda, mulai dari (klik kategori untuk melihat menu):
          </p>
        </motion.div>

        {/* Animated Category Cards - Balanced 2-column on mobile, 4-column on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {CATEGORIES.map((item, index) => {
            const IconComponent = item.icon;
            const isLastOdd = index === CATEGORIES.length - 1 && CATEGORIES.length % 2 !== 0;
            return (
              <motion.div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCategory && onSelectCategory(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onSelectCategory) onSelectCategory(item.id);
                  }
                }}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group relative flex flex-col justify-between p-3 sm:p-5 lg:p-6 rounded-xl border border-theme bg-card-theme transition-all duration-200 hover:border-[#DB9558] hover:shadow-md cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#DB9558] active:scale-98 ${
                  isLastOdd ? 'col-span-2 sm:col-span-1' : ''
                }`}
                aria-label={`Buka daftar produk ${item.title}`}
              >
                <div>
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg border border-theme bg-surface flex items-center justify-center text-heading mb-3 sm:mb-5 transition-all duration-200 group-hover:border-[#DB9558] group-hover:text-[#DB9558] group-hover:scale-105">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-colors" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-heading tracking-tight flex items-center justify-between">
                    <span>{item.title}</span>
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-theme/60 flex items-center text-[11px] sm:text-xs font-semibold text-[#DB9558] group-hover:translate-x-0.5 transition-transform">
                  <span>Lihat Produk &rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

