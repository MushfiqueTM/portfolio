import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeuButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
  download?: string | boolean;
  'data-cursor'?: string;
}

export const NeuButton = React.forwardRef<HTMLElement, NeuButtonProps>(
  ({
    children,
    className,
    variant = 'secondary',
    size = 'md',
    onClick,
    disabled = false,
    type = 'button',
    href,
    target,
    rel,
    download,
    'data-cursor': dataCursor,
  }, ref) => {
    const buttonRef = useRef<HTMLElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLElement>) || buttonRef;

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { damping: 15, stiffness: 200 });
    const springY = useSpring(y, { damping: 15, stiffness: 200 });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.25;
      const deltaY = (e.clientY - centerY) * 0.25;
      x.set(deltaX);
      y.set(deltaY);
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
      x.set(0);
      y.set(0);
    }, [x, y]);

    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-xl';

    const variants = {
      primary: 'bg-[#1A2B4A] text-white shadow-[4px_4px_12px_rgba(26,43,74,0.3),-2px_-2px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_16px_rgba(26,43,74,0.35),-2px_-2px_8px_rgba(255,255,255,0.5)] active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]',
      secondary: 'bg-[#F2F4F6] text-[#1A2B4A] shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.9)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.9)] active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.3),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]',
      ghost: 'bg-transparent text-[#1A2B4A] hover:bg-[#1A2B4A]/5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const Component = href ? motion.a : motion.button;
    const props = href ? { href, target, rel, download } : { type, onClick, disabled };

    return (
      <Component
        ref={combinedRef as any}
        className={cn(baseStyles, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className)}
        style={{ x: springX, y: springY }}
        onMouseMove={!disabled ? handleMouseMove : undefined}
        onMouseLeave={!disabled ? handleMouseLeave : undefined}
        data-cursor={dataCursor}
        {...props}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        whileTap={!disabled ? { scale: 0.97 } : undefined}
      >
        {children}
      </Component>
    );
  }
);

NeuButton.displayName = 'NeuButton';
