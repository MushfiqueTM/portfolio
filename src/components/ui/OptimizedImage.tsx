import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  disableHover?: boolean;
  width?: number;
  height?: number;
}

/**
 * Thin wrapper around <img> with click + error fallback.
 *
 * The previous version constructed a separate Image() and called .decode() on every mount,
 * holding the visible <img> at opacity 0 until that decode resolved. Combined with the
 * global useImagePreloader (which already pulls every image into the browser cache via
 * requestIdleCallback) this caused a redundant re-decode and a 500ms fade — the "snap"
 * users saw was the empty container suddenly filling once the fade completed.
 *
 * Now the browser handles decoding natively: cached images render immediately, uncached
 * ones stream in progressively without a fade.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  onClick,
  disableHover = false,
  width,
  height,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden',
        onClick && 'cursor-pointer',
        containerClassName
      )}
      onClick={onClick}
      whileHover={!disableHover && onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F2F4F6] text-[#8B95A5] z-10">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="eager"
          decoding="async"
          onError={() => setHasError(true)}
          className={cn(
            !disableHover && onClick && 'group-hover:scale-105',
            className
          )}
        />
      )}
    </motion.div>
  );
};
