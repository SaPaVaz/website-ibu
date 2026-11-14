import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Package,
  MessageCircle,
  Wheat,
  Droplets,
  Coffee,
  Cookie,
  BookOpen,
  Bone,
  Watch,
  CreditCard,
  LucideIcon,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORY_CATALOG, CategoryDetail } from '../data/categoryCatalog';

interface CategoryCatalogPageProps {
  categoryId: string;
  onBack: () => void;
  onSelectCategory: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  snack: Cookie,
  sembako: Wheat,
  minuman: Coffee,
  'alat-tulis': BookOpen,
  'pakan-hewan': Bone,
  aksesori: Watch,
  sabun: Droplets,
  'mini-atm': CreditCard,
};

const CATEGORY_TABS = [
  { id: 'snack', label: 'Snack Ringan', icon: Cookie },
  { id: 'sembako', label: 'Sembako', icon: Wheat },
  { id: 'minuman', label: 'Minuman', icon: Coffee },
  { id: 'alat-tulis', label: 'Alat Tulis', icon: BookOpen },
  { id: 'pakan-hewan', label: 'Pakan Hewan', icon: Bone },
  { id: 'aksesori', label: 'Aksesori', icon: Watch },
  { id: 'sabun', label: 'Sabun & Kebersihan', icon: Droplets },
  { id: 'mini-atm', label: 'Mini ATM', icon: CreditCard },
];

export const CategoryCatalogPage: React.FC<CategoryCatalogPageProps> = ({
  categoryId,
  onBack,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback to snack if category doesn't exist
  const currentCategory: CategoryDetail =
    CATEGORY_CATALOG[categoryId] || CATEGORY_CATALOG['snack'];
  const CurrentIcon = CATEGORY_ICONS[currentCategory.id] || Cookie;

  // Reset filter when switching category
  useEffect(() => {
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId]);

  // Handle escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Filtered products list by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return currentCategory.products;
    const q = searchQuery.toLowerCase().trim();
    return currentCategory.products.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.subCategory.toLowerCase().includes(q)
      );
    });
  }, [currentCategory, searchQuery]);

  const waHref = `https://wa.me/6282220615261?text=${encodeURIComponent(
    `Halo Warung Pojok Aro, saya ingin menanyakan informasi dan ketersediaan stok produk di kategori "${currentCategory.title}". Terima kasih!`
  )}`;

  return (
    <div className="min-h-screen bg-page text-heading transition-colors duration-200">
      {/* Sticky Sub-Header Bar */}
      <div className="sticky top-0 z-30 w-full border-b border-theme bg-page/95 backdrop-blur-md transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-theme text-heading hover:border-[#DB9558] hover:text-[#DB9558] transition-all text-xs sm:text-sm font-semibold cursor-pointer shadow-2xs shrink-0 active:scale-95"
            title="Kembali ke Beranda (Esc)"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Kembali ke Beranda</span>
            <span className="sm:hidden whitespace-nowrap">Kembali</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-5 sm:py-10 space-y-6 sm:space-y-8">
        {/* Category Switcher Tabs - Wrapped cleanly for mobile & tablet */}
        <div className="space-y-2">
          <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#DB9558]" />
            <span>Pilih Kategori Produk Warung</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {CATEGORY_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = tab.id === currentCategory.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'border-[#DB9558] bg-[#DB9558]/15 text-[#DB9558] font-bold shadow-2xs'
                      : 'border-theme bg-card-theme text-heading hover:border-[#DB9558]/50'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Section of Category (Clean text-only without duplicate image or highlight pills) */}
        <div className="rounded-2xl border border-theme bg-card-theme p-4 sm:p-7 lg:p-8 shadow-xs relative overflow-hidden">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-muted">
              <span className="w-2 h-2 rounded-full bg-[#DB9558]" />
              <span>{currentCategory.badge}</span>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl border border-theme bg-surface flex items-center justify-center text-[#DB9558] shrink-0 shadow-2xs">
                <CurrentIcon className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-heading">
                  {currentCategory.title}
                </h1>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-muted leading-relaxed">
                  {currentCategory.summary}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-heading/80 leading-relaxed pt-0.5">
              {currentCategory.introNote}
            </p>
          </div>
        </div>

        {/* Search Bar - Shown only when category has products */}
        {currentCategory.products.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari dalam ${currentCategory.title}...`}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-theme bg-card-theme text-heading text-xs sm:text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#DB9558] focus:border-[#DB9558] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-heading cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>

            <div className="text-xs text-muted self-end sm:self-auto font-medium">
              Menampilkan {filteredProducts.length} dari {currentCategory.products.length} produk
            </div>
          </div>
        )}

        {/* Product Cards Grid with Neatly Framed Images */}
        <AnimatePresence mode="wait">
          {currentCategory.products.length === 0 ? (
            <motion.div
              key={`${currentCategory.id}-empty`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 sm:p-12 rounded-2xl border border-dashed border-theme bg-card-theme text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl border border-theme bg-surface flex items-center justify-center text-[#DB9558] mx-auto">
                <CurrentIcon className="w-6 h-6" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-heading">
                Produk untuk kategori "{currentCategory.title}" masih kosong
              </p>
              <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
                Foto dan daftar produk untuk kategori ini belum diisi. Silakan pilih kategori lainnya untuk melihat produk yang sudah tersedia.
              </p>
              <button
                type="button"
                onClick={onBack}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-theme bg-surface text-heading hover:border-[#DB9558] transition-colors text-xs font-semibold cursor-pointer active:scale-95"
              >
                Kembali ke Beranda
              </button>
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              key={`${currentCategory.id}-${searchQuery}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5"
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between rounded-xl border border-theme bg-card-theme hover:border-[#DB9558]/70 hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                  {/* Neatly Framed Product Image Slot - shown only when product has a unique photo */}
                  {product.image && (
                    <div className="relative w-full aspect-4/3 sm:aspect-4/3 bg-[#FAF7EE] dark:bg-[#1E1B17] overflow-hidden border-b border-theme p-3 sm:p-4 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
                      />

                      {product.isPopular && (
                        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
                          <span className="text-[10px] sm:text-[11px] font-semibold text-white bg-[#DB9558] px-2 sm:px-2.5 py-0.5 rounded-md shadow-xs">
                            Favorit
                          </span>
                        </div>
                      )}

                      {product.price && (
                        <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5">
                          <span className="text-xs font-bold text-white bg-neutral-900/85 backdrop-blur-sm px-2.5 py-0.5 sm:py-1 rounded-md shadow-xs font-mono">
                            {product.price}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      {/* Subcategory & Price / Popular Badge */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-[#97A87A] dark:text-[#A8BBA3] font-semibold">
                          {product.subCategory}
                        </span>
                        <div className="flex items-center gap-2">
                          {!product.image && product.isPopular && (
                            <span className="text-[10px] font-semibold text-white bg-[#DB9558] px-2 py-0.5 rounded-md">
                              Favorit
                            </span>
                          )}
                          {product.price && (
                            <span className="font-bold font-mono text-[#DB9558] text-xs sm:text-sm">
                              {product.price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-base font-bold text-heading leading-snug group-hover:text-[#DB9558] transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Packaging & Availability Footer */}
                    <div className="pt-3 border-t border-theme flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Package className="w-3.5 h-3.5 text-muted shrink-0" />
                        <span className="truncate">{product.packaging}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-0.5">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{product.availability}</span>
                        </div>
                        <span className="text-muted text-[11px]">Warung Pojok Aro</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-10 rounded-2xl border border-dashed border-theme text-center space-y-3"
            >
              <p className="text-base font-semibold text-heading">
                Tidak ada produk yang cocok dengan pencarian "{searchQuery}"
              </p>
              <p className="text-xs sm:text-sm text-muted">
                Coba gunakan kata kunci lain atau lihat kategori lainnya.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-theme bg-surface text-heading hover:border-[#DB9558] transition-colors text-xs font-semibold cursor-pointer active:scale-95"
              >
                Reset Pencarian
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Contact / Stock Inquiry Banner */}
        <div className="rounded-2xl border border-theme bg-surface p-4 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-lg font-bold text-heading">
              Ingin Memastikan Ketersediaan Stok Tertentu?
            </h4>
            <p className="text-xs sm:text-sm text-muted max-w-xl">
              Hubungi pengelola Warung Pojok Aro langsung via WhatsApp atau mampir ke lokasi
              warung di Kleyang Jurang, Mojotengah, Wonosobo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 sm:py-2.5 rounded-xl border border-theme bg-card-theme text-heading hover:border-[#DB9558] text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center active:scale-95"
            >
              Kembali ke Beranda
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-[#DB9558] hover:bg-[#C98246] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs active:scale-95"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Chat WhatsApp Warung</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
