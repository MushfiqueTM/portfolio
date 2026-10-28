import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SpotlightCard from './SpotlightCard';

interface PlateProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'raised' | 'pressed' | 'flat';
  hover?: boolean;
  onClick?: () => void;
  spotlight?: boolean;
  spotlightColor?: string;
}

export const Plate = React.forwardRef<HTMLDivElement, PlateProps>(
  ({ 
    children, 
    className, 
    variant = 'raised', 
    hover = true, 
    onClick,
    spotlight = false,
    spotlightColor = 'hsl(var(--cyan) / 0.12)'
  }, ref) => {
    const baseStyles = 'relative rounded-sm transition-all duration-300';
    
    // Every plate carries a hairline. The drafting language reads edges, not depth.
    const variants = {
      raised: 'bg-paper-raised border border-rule shadow-plate hover:shadow-plate-lg',
      pressed: 'bg-paper-inset border border-rule shadow-well',
      flat: 'bg-paper-raised/80 backdrop-blur-sm border border-rule',
    };

    const cardStyles = cn(
      baseStyles, 
      variants[variant], 
      hover && variant !== 'pressed' && 'hover:-translate-y-0.5',
      className
    );

    // If no spotlight or pressed variant, render simple motion card
    if (!spotlight || variant === 'pressed') {
      return (
        <motion.div
          ref={ref}
          className={cardStyles}
          onClick={onClick}
          whileTap={onClick ? { scale: 0.98 } : undefined}
        >
          {children}
        </motion.div>
      );
    }

    // With spotlight - single card element with spotlight effect
    // Motion wrapper only handles tap animation, no visual styles
    return (
      <SpotlightCard 
        className={cardStyles}
        spotlightColor={spotlightColor}
      >
        <motion.div
          ref={ref}
          onClick={onClick}
          className="h-full w-full"
          whileTap={onClick ? { scale: 0.98 } : undefined}
        >
          {children}
        </motion.div>
      </SpotlightCard>
    );
  }
);

Plate.displayName = 'Plate';
