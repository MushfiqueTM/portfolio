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
  rounded = 'rounded-sm',
  ...rest
}) => (
  <div
    aria-hidden="true"
    className={cn(
      'animate-shimmer bg-[length:200%_100%]',
      'bg-[linear-gradient(110deg,#EAE6DC_8%,#F7F4ED_18%,#EAE6DC_33%)]',
      rounded,
      className
    )}
    {...rest}
  />
);
