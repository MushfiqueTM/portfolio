import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SpotlightCard from './SpotlightCard';

interface NeuCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'raised' | 'pressed' | 'flat';
  hover?: boolean;
  onClick?: () => void;
  spotlight?: boolean;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

export const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  ({ 
    children, 
    className, 
    variant = 'raised', 
    hover = true, 
    onClick,
    spotlight = false,
    spotlightColor = 'rgba(59, 130, 246, 0.12)'
  }, ref) => {
    const baseStyles = 'relative rounded-2xl transition-all duration-300';
    
    const variants = {
      raised: 'bg-white shadow-[8px_8px_16px_rgba(163,177,198,0.5),-8px_-8px_16px_rgba(255,255,255,0.9)] hover:shadow-[12px_12px_24px_rgba(163,177,198,0.5),-12px_-12px_24px_rgba(255,255,255,0.9)]',
      pressed: 'bg-[#E8EBF0] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]',
      flat: 'bg-white/80 backdrop-blur-sm border border-white/50',
    };

    const cardStyles = cn(
      baseStyles, 
      variants[variant], 
      hover && variant !== 'pressed' && 'hover:-translate-y-1',
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

NeuCard.displayName = 'NeuCard';
