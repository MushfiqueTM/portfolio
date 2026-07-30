import React from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export type ImageLayout = '3+1' | 'grid';

type Slot = 'thumb' | 'hero' | 'grid';

const FIXED_HEIGHT: Record<Slot, string> = {
  thumb: 'h-[210px] sm:h-[270px] md:h-[320px]',
  hero: 'h-[380px] sm:h-[480px] md:h-[560px]',
  grid: 'h-[320px] sm:h-[400px] md:h-[480px]',
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface TileProps {
  src: string;
  alt: string;
  index: number;
  slot: Slot;
  sizing: 'fixed' | 'natural';
  withSkeleton: boolean;
  reveal: boolean;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({
  src,
  alt,
  index,
  slot,
  sizing,
  withSkeleton,
  reveal,
  onClick,
}) => {
  const isHero = slot === 'hero';

  const wrapperClass =
    sizing === 'natural'
      ? 'relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img'
      : `relative ${FIXED_HEIGHT[slot]} cursor-pointer group/img flex items-center justify-center`;

  const imgClass =
    sizing === 'natural'
      ? 'w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105'
      : 'max-w-full max-h-full object-contain rounded-2xl transition-transform duration-300 group-hover/img:scale-105';

  const image = withSkeleton ? (
    <OptimizedImage
      src={src}
      alt={alt}
      containerClassName={sizing === 'fixed' ? 'w-full h-full flex items-center justify-center' : undefined}
      className={imgClass}
    />
  ) : (
    <img src={src} alt={alt} loading="lazy" decoding="async" className={imgClass} />
  );

  if (!reveal) {
    return (
      <div onClick={onClick} className={wrapperClass} data-cursor="View">
        {image}
      </div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      className={wrapperClass}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={
        isHero
          ? { duration: 0.6, delay: 0.55, ease: EASE }
          : { duration: 0.55, delay: 0.15 + index * 0.12, ease: EASE }
      }
      whileHover={{ scale: isHero ? 1.02 : 1.03, y: -4 }}
      data-cursor="View"
    >
      {image}
    </motion.div>
  );
};

interface ProjectImageGridProps {
  images: string[];
  /** Base for each image's alt text, rendered as "{alt} - {n}". */
  alt: string;
  onImageClick: (index: number) => void;
  /**
   * '3+1' stacks three thumbnails above one large hero image. Set it per-entry
   * in the data files, not by matching titles here. Falls back to 'grid' unless
   * there are exactly four images — the same guard the call sites used before.
   */
  layout?: ImageLayout;
  /**
   * 'fixed' letterboxes every image into a fixed pixel height; 'natural' lets
   * each image keep its own aspect ratio inside a tinted frame.
   */
  sizing?: 'fixed' | 'natural';
  /** Route through OptimizedImage for a shimmer placeholder and error fallback. */
  withSkeleton?: boolean;
  /** Animate tiles in on scroll and lift them on hover. */
  reveal?: boolean;
}

/**
 * The image block shared by Projects, CADView, Leadership, and DesignView.
 *
 * Every visual difference between those four is a prop, so each keeps exactly
 * the treatment it had when this markup was duplicated four times.
 */
export const ProjectImageGrid: React.FC<ProjectImageGridProps> = ({
  images,
  alt,
  onImageClick,
  layout = 'grid',
  sizing = 'fixed',
  withSkeleton = false,
  reveal = false,
}) => {
  if (images.length === 0) return null;

  const centered = sizing === 'natural' ? ' items-center' : '';
  const shared = { sizing, withSkeleton, reveal };

  if (layout === '3+1' && images.length === 4) {
    return (
      <div className="space-y-3">
        <div className={`grid grid-cols-3 gap-3${centered}`}>
          {images.slice(0, 3).map((src, i) => (
            <Tile
              key={i}
              src={src}
              alt={`${alt} - ${i + 1}`}
              index={i}
              slot="thumb"
              onClick={() => onImageClick(i)}
              {...shared}
            />
          ))}
        </div>
        <Tile
          src={images[3]}
          alt={`${alt} - 4`}
          index={3}
          slot="hero"
          onClick={() => onImageClick(3)}
          {...shared}
        />
      </div>
    );
  }

  return (
    <div className={`grid gap-3${centered} ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {images.map((src, i) => (
        <Tile
          key={i}
          src={src}
          alt={`${alt} - ${i + 1}`}
          index={i}
          slot="grid"
          onClick={() => onImageClick(i)}
          {...shared}
        />
      ))}
    </div>
  );
};
