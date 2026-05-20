import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: string;
}

/**
 * Animated shimmer placeholder. Sized by its parent — pass through className
 * to override radius, aspect ratio, etc. Use as a fallback while an image
 * downloads or a lazy chunk resolves.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'rounded-xl',
  ...rest
}) => (
  <div
    aria-hidden="true"
    className={cn(
      'animate-shimmer bg-[length:200%_100%]',
      'bg-[linear-gradient(110deg,#E8EBF0_8%,#F2F4F6_18%,#E8EBF0_33%)]',
      rounded,
      className
    )}
    {...rest}
  />
);
