import React from 'react';
import {
  Wheat,
  Utensils,
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
    id: 'sembako',
    title: 'Sembako',
    description: 'Beras, minyak goreng, gula, tepung, telur, dan kebutuhan pokok lainnya.',
    icon: Wheat,
  },
  {
    id: 'makanan',
    title: 'Makanan',
    description: 'Mie instan, bumbu dapur, makanan siap saji, dan bahan masakan harian.',
    icon: Utensils,
  },
  {
    id: 'minuman',
    title: 'Minuman',
    description: 'Air mineral, teh, kopi kemasan, minuman dingin, dan aneka serbuk sachet.',
    icon: Coffee,
  },
  {
    id: 'snack',
    title: 'Snack Ringan',
    description: 'Aneka biskuit, keripik, permen, wafer, dan camilan untuk keluarga.',
    icon: Cookie,
  },
  {
    id: 'alat-tulis',
    title: 'Alat Tulis',
    description: 'Buku tulis, pulpen, pensil, penghapus, map, dan perlengkapan sekolah.',
    icon: BookOpen,
  },
  {
    id: 'pakan-hewan',
    title: 'Pakan Hewan',
    description: 'Pakan burung, pakan ayam, makanan kucing, dan kebutuhan peliharaan.',
    icon: Bone,
  },
  {
    id: 'aksesori',
    title: 'Aksesori',
    description: 'Kabel data, gantungan kunci, baterai, korek, dan kebutuhan kecil lainnya.',
    icon: Watch,
  },
  {
    id: 'mini-atm',
    title: 'Mini ATM',
    description: 'Layanan tarik tunai, transfer antarbank, dan pembayaran tagihan harian.',
    icon: CreditCard,
  },
];

export const Categories: React.FC = () => {
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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
            Warung Pojok
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted">
            Menyediakan kebutuhan harian anda, mulai dari:
          </p>
        </motion.div>

        {/* 8 Animated Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {CATEGORIES.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between p-4 sm:p-5 lg:p-6 rounded-xl border border-theme bg-card-theme transition-colors duration-200 hover:border-[#DB9558] hover:shadow-md cursor-default"
              >
                <div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-theme bg-surface flex items-center justify-center text-heading mb-4 sm:mb-5 transition-all duration-200 group-hover:border-[#DB9558] group-hover:text-[#DB9558] group-hover:scale-105">
                    <IconComponent className="w-5 h-5 transition-colors" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-heading tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
