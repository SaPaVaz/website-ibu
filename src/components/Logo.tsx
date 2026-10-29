import React from 'react';
import logoImageSrc from '../assets/images/logo_warung_pojok.png';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'icon-only' | 'stacked';
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Official Warung Pojok Logo component.
 * Compact, refined sizing for a clean and sleek header/footer appearance.
 */
export const LogoImage: React.FC<{
  className?: string;
  sizeClass?: string;
}> = ({ className = '', sizeClass = 'w-8 h-8 sm:w-9 sm:h-9' }) => {
  return (
    <div
      className={`relative shrink-0 rounded-lg overflow-hidden bg-white shadow-xs border border-neutral-200/90 dark:border-neutral-700/80 transition-all duration-200 flex items-center justify-center p-0.5 ${sizeClass} ${className}`}
    >
      <img
        src={logoImageSrc}
        alt="Logo Resmi Warung Pojok - Toko Serba Ada"
        className="w-full h-full object-contain scale-[1.05] transition-transform duration-300 group-hover:scale-110"
        loading="eager"
      />
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'horizontal',
  showSlogan = true,
  size = 'md',
}) => {
  // More compact dimensions across breakpoints
  const sizeClasses = {
    sm: 'w-7 h-7 xs:w-8 xs:h-8',
    md: 'w-8 h-8 sm:w-9 sm:h-9 md:w-9.5 md:h-9.5',
    lg: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12',
  };

  if (variant === 'icon-only') {
    return <LogoImage sizeClass={sizeClasses[size]} className={className} />;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center gap-1.5 text-heading ${className}`}>
        <LogoImage sizeClass={sizeClasses[size]} />
        <div>
          <span className="block font-bold tracking-tight text-heading text-sm sm:text-base md:text-lg uppercase">
            Warung Pojok Aro
          </span>
          {showSlogan && (
            <span className="block text-[10px] sm:text-xs font-semibold text-[#97A87A] dark:text-[#A8BBA3] tracking-wider uppercase mt-0.5">
              Toko Serba Ada &bull; Kebutuhan Harian
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal format (Logo di kiri, nama toko & slogan di kanan)
  return (
    <div className={`group inline-flex items-center gap-2 sm:gap-2.5 text-heading min-w-0 ${className}`}>
      <LogoImage sizeClass={sizeClasses[size]} />
      <div className="flex flex-col justify-center leading-tight min-w-0">
        <span className="font-bold tracking-tight text-heading text-xs xs:text-sm sm:text-base uppercase select-none truncate">
          WARUNG POJOK ARO
        </span>
        {showSlogan && (
          <span className="text-[9.5px] xs:text-[10px] sm:text-[11px] font-medium text-muted tracking-tight select-none mt-0.5 flex items-center gap-1.5 truncate">
            <span className="font-semibold text-[#97A87A] dark:text-[#A8BBA3] shrink-0">
              Toko Serba Ada
            </span>
            <span className="opacity-60 shrink-0">&bull;</span>
            <span className="truncate">Kebutuhan Harian</span>
          </span>
        )}
      </div>
    </div>
  );
};
