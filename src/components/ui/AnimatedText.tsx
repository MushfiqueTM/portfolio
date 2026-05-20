import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Single-element text fade-in. (Originally split text into per-word springs,
 * which produced ~9 simultaneous motion elements per heading and contributed
 * to the first-few-seconds animation storm. Reduced to one motion element
 * per heading; visual feel is preserved by the slight y-rise.)
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
}) => {
  const MotionTag = motion[Tag] as typeof motion.span;
  return (
    <MotionTag
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </MotionTag>
  );
};
