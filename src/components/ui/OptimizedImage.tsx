import React, { useLayoutEffect, useRef, useState } from 'react';
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
 * Conditional fade-in:
 *   - If the image is already in the browser cache at mount (preloader has finished
 *     fetching, or the user is revisiting), it's revealed synchronously before the
 *     first paint via useLayoutEffect — no fade, no flash.
 *   - If it's still mid-download (common on first production load before the
 *     CDN-served bytes arrive), it stays at opacity 0 and fades in once the native
 *     onLoad fires, so the user never sees an empty container suddenly fill with bytes.
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
  const imgRef = useRef<HTMLImageElement>(null);
  const [hasError, setHasError] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalHeight > 0) {
      setShown(true);
    }
  }, []);

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
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="eager"
          decoding="async"
          onLoad={() => setShown(true)}
          onError={() => setHasError(true)}
          className={cn(
            'transition-opacity duration-300 ease-out',
            shown ? 'opacity-100' : 'opacity-0',
            !disableHover && onClick && 'group-hover:scale-105',
            className
          )}
        />
      )}
    </motion.div>
  );
};
