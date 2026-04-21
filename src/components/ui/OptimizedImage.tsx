import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  disableHover?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  onClick,
  disableHover = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setHasError(false);

    const img = new Image();
    img.src = src;

    const finish = () => {
      if (!cancelled) setLoaded(true);
    };

    if (img.decode) {
      img.decode().then(finish).catch(finish);
    } else {
      img.onload = finish;
      img.onerror = () => {
        if (!cancelled) setHasError(true);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [src]);

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
          loading="eager"
          decoding="async"
          onError={() => setHasError(true)}
          className={cn(
            'transition-opacity duration-500 ease-out',
            loaded ? 'opacity-100' : 'opacity-0',
            !disableHover && onClick && 'group-hover:scale-105',
            className
          )}
        />
      )}
    </motion.div>
  );
};
