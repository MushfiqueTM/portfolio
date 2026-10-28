import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'subtle';
  onClick?: () => void;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ children, className, variant = 'default', onClick }, ref) => {
    const baseStyles = 'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-sm transition-all duration-200';

    const variants = {
      default: 'bg-paper text-ink-soft border border-rule hover:border-cyan/40 hover:text-ink',
      primary: 'bg-ink text-paper border border-ink shadow-ink',
      subtle: 'bg-paper-raised/60 text-ink-soft border border-rule hover:border-cyan/30 hover:text-ink hover:bg-paper-raised',
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

Tag.displayName = 'Tag';
