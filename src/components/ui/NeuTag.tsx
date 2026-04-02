import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeuTagProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'subtle';
  onClick?: () => void;
}

export const NeuTag = React.forwardRef<HTMLSpanElement, NeuTagProps>(
  ({ children, className, variant = 'default', onClick }, ref) => {
    const baseStyles = 'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200';

    const variants = {
      default: 'bg-[#F2F4F6] text-[#5F6B7A] shadow-[2px_2px_4px_rgba(163,177,198,0.5),-2px_-2px_4px_rgba(255,255,255,0.9)] hover:shadow-[3px_3px_8px_rgba(59,130,246,0.15),-3px_-3px_6px_rgba(255,255,255,0.9),0_0_12px_rgba(59,130,246,0.08)] hover:text-[#1A2B4A]',
      primary: 'bg-[#1A2B4A] text-white shadow-[2px_2px_6px_rgba(26,43,74,0.3)] hover:shadow-[3px_3px_10px_rgba(26,43,74,0.4)]',
      subtle: 'bg-white/60 text-[#5F6B7A] border border-[#E2E8F0] hover:border-[#3B82F6]/30 hover:text-[#1A2B4A] hover:bg-white',
    };

    return (
      <motion.span
        ref={ref}
        className={cn(baseStyles, variants[variant], onClick && 'cursor-pointer', className)}
        onClick={onClick}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={onClick ? { scale: 0.95 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.span>
    );
  }
);

NeuTag.displayName = 'NeuTag';
