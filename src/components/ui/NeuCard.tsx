import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeuCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'raised' | 'pressed' | 'flat';
  hover?: boolean;
  onClick?: () => void;
}

export const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  ({ children, className, variant = 'raised', hover = true, onClick }, ref) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';
    
    const variants = {
      raised: 'bg-white shadow-[8px_8px_16px_rgba(163,177,198,0.5),-8px_-8px_16px_rgba(255,255,255,0.9)]',
      pressed: 'bg-[#E8EBF0] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]',
      flat: 'bg-white/80 backdrop-blur-sm border border-white/50',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        onClick={onClick}
        whileHover={hover && variant !== 'pressed' ? { 
          y: -4, 
          boxShadow: '12px 12px 24px rgba(163,177,198,0.5), -12px -12px 24px rgba(255,255,255,0.9)' 
        } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
      >
        {children}
      </motion.div>
    );
  }
);

NeuCard.displayName = 'NeuCard';
