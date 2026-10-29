import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import imageSizes from '@/data/imageSizes.json';

// JSON arrays widen to number[], so index rather than destructure a tuple.
const SIZES: Record<string, number[]> = imageSizes;

interface SlideImgProps {
  src: string;
  alt: string;
  className: string;
  onClick?: () => void;
  cursor?: string;
}

const SlideImg: React.FC<SlideImgProps> = ({ src, alt, className, onClick, cursor }) => {
  const [shown, setShown] = useState(false);

  // Cached images are `complete` before onLoad can attach, so their load event
  // never fires — catch them as the node attaches, before paint.
  const captureImg = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalHeight > 0) setShown(true);
  }, []);

  return (
    <>
      {!shown && <Skeleton rounded="rounded-sm" className="absolute inset-3 sm:inset-6" />}
      <img
        ref={captureImg}
        src={src}
        alt={alt}
        width={SIZES[src]?.[0]}
        height={SIZES[src]?.[1]}
        draggable={false}
        loading="lazy"
        decoding="async"
        onLoad={() => setShown(true)}
        onClick={onClick}
        data-cursor={cursor}
        className={className}
        style={{ opacity: shown ? 1 : 0, transition: 'opacity 300ms ease-out' }}
      />
    </>
  );
};

interface ImageCarouselProps {
  images: string[];
  alt: string;
  onImageClick?: (index: number) => void;
  heightClass?: string;
}

const SLIDE_WIDTH_PERCENT = 82;
type ClaimableWheel = WheelEvent & { lenisStopPropagation?: boolean };

/**
 * How much of the carousel must be on screen before it may take over the wheel.
 * Without this, a carousel creeping in at the bottom edge grabs your scroll as you
 * pass it; the reader should have arrived at it first.
 */
const CAPTURE_VISIBILITY = 0.6;

const GAP_PX = 16;
const SNAP_DELAY_MS =160;

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  onImageClick,
  heightClass = 'h-[320px] sm:h-[420px] md:h-[500px]',
}) => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidthRef = useRef(0);
  const indexRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDirRef = useRef(0);

  // Continuous target position (updated by wheel and pan)
  const target = useMotionValue(0);
  // Smooth display position — gives the "Lenis-like" eased feel
  const displayX = useSpring(target, {
    stiffness: 100,
    damping: 24,
    mass: 1.2,
  });

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Compute pixel position for a given slide index, centered
  const positionForSlide = useCallback((slideIdx: number, width: number) => {
    const centerOffsetPx = (width * (100 - SLIDE_WIDTH_PERCENT) / 100) / 2;
    const slideWithGap = (width * SLIDE_WIDTH_PERCENT / 100) + GAP_PX;
    return centerOffsetPx - slideIdx * slideWithGap;
  }, []);

  // Bounds
  const getBounds = useCallback((width: number) => {
    return {
      maxX: positionForSlide(0, width),
      minX: positionForSlide(images.length - 1, width),
    };
  }, [images.length, positionForSlide]);

  // Measure container width on mount/resize and initialize target
  useLayoutEffect(() => {
    const update = (initial = false) => {
      const el = containerRef.current;
      if (!el) return;
      containerWidthRef.current = el.clientWidth;
      const pos = positionForSlide(indexRef.current, el.clientWidth);
      target.set(pos);
      // On first measure, set the spring output too so there's no spring animation from 0 on mount
      if (initial) displayX.set(pos);
    };
    update(true);
    const onResize = () => update(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When index changes programmatically (dots/arrows/boundary snap), move target to that slide
  useEffect(() => {
    if (containerWidthRef.current > 0) {
      target.set(positionForSlide(index, containerWidthRef.current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(images.length - 1, i)),
    [images.length]
  );

  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);
  const goTo = useCallback((i: number) => setIndex(clamp(i)), [clamp]);

  /**
   * Keyboard navigation for the focused carousel.
   *
   * With the wheel limited to horizontal gestures, a mouse user has no wheel path to the
   * images, so arrows and Home/End matter. Only the keys we handle are intercepted —
   * Tab and the rest stay with the browser.
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); goTo(images.length - 1); }
    },
    [prev, next, goTo, images.length]
  );

  const scheduleSnap = useCallback(() => {
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      const width = containerWidthRef.current;
      if (width === 0) return;
      const slideWithGap = (width * SLIDE_WIDTH_PERCENT / 100) + GAP_PX;
      const { maxX } = getBounds(width);
      const pos = target.get();
      // Bias snap in the direction of last motion so even small scrolls commit to a slide change
      const raw = (maxX - pos) / slideWithGap;
      const biased = raw + lastDirRef.current * 0.2;
      const clamped = clamp(Math.round(biased));
      lastDirRef.current = 0;
      if (clamped !== indexRef.current) {
        setIndex(clamped);
      } else {
        target.set(positionForSlide(clamped, width));
      }
    }, SNAP_DELAY_MS);
  }, [clamp, getBounds, positionForSlide, target]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || images.length <= 1) return;

    const handleWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX < 2 && absY < 2) return;

      // Only take the wheel once the carousel has actually settled on screen.
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const onScreen = Math.min(rect.bottom, viewport) - Math.max(rect.top, 0);
      if (onScreen / Math.min(rect.height, viewport) < CAPTURE_VISIBILITY) return;

      const delta = absX > absY ? e.deltaX : e.deltaY;
      const forward = delta > 0;

      const width = containerWidthRef.current;
      if (width === 0) return;
      const { minX, maxX } = getBounds(width);
      const currentTarget = target.get();

      const atEnd = currentTarget <= minX + 1;
      const atStart = currentTarget >= maxX - 1;

      // Out of images in this direction: hand the gesture straight back. Leaving the
      // event untouched lets it bubble to Lenis, which scrolls the page with its own
      // momentum — the previous version called lenis.scrollTo() here to fake that, and
      // the seam was the jerk you felt when a carousel ran out.
      if ((forward && atEnd) || (!forward && atStart)) {
        if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
        // Ensure the boundary slide is marked active even if the snap never fired
        const boundaryIdx = forward ? images.length - 1 : 0;
        if (indexRef.current !== boundaryIdx) {
          setIndex(boundaryIdx);
        }
        return;
      }

      // Claim the gesture: block the native scroll, and flag the event so Lenis skips it.
      e.preventDefault();
      (e as ClaimableWheel).lenisStopPropagation = true;

      // Scale wheel delta — matches page scroll momentum
      const scaled = delta * 0.85;
      const newTarget = Math.max(minX, Math.min(maxX, currentTarget - scaled));
      target.set(newTarget);
      lastDirRef.current = Math.sign(delta);

      scheduleSnap();
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [images.length, getBounds, scheduleSnap, target]);

  // Pan (drag) handling on our own motion value, so it coexists with the spring
  const handlePan = (_: unknown, info: PanInfo) => {
    const width = containerWidthRef.current;
    if (width === 0) return;
    const { minX, maxX } = getBounds(width);
    const current = target.get();
    const newTarget = Math.max(minX - 40, Math.min(maxX + 40, current + info.delta.x));
    target.set(newTarget);
  };

  const handlePanEnd = (_: unknown, info: PanInfo) => {
    const width = containerWidthRef.current;
    if (width === 0) return;
    const slideWithGap = (width * SLIDE_WIDTH_PERCENT / 100) + GAP_PX;
    const { maxX } = getBounds(width);

    // Apply velocity for flick detection
    const projectedTarget = target.get() + info.velocity.x * 0.15;
    const nearestIdx = Math.round((maxX - projectedTarget) / slideWithGap);
    goTo(nearestIdx);
  };

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={`relative ${heightClass} rounded-sm overflow-hidden flex items-center justify-center`}>
        <SlideImg
          src={images[0]}
          alt={alt}
          onClick={() => onImageClick?.(0)}
          cursor="View"
          className="max-w-full max-h-full object-contain cursor-pointer drop-shadow-2xl rounded-sm"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${alt} — ${images.length} images`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative ${heightClass} rounded-sm overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan/60`}
    >
      <motion.div
        className="absolute inset-y-0 left-0 flex items-center touch-pan-y"
        style={{ x: displayX, gap: `${GAP_PX}px` }}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
      >
        {images.map((src, i) => {
          const isActive = i === index;
          return (
            <motion.div
              key={i}
              style={{ width: `${SLIDE_WIDTH_PERCENT}%` }}
              className="flex-shrink-0 h-full flex items-center justify-center cursor-pointer"
              onClick={() => {
                if (isActive) onImageClick?.(i);
                else goTo(i);
              }}
              animate={{
                scale: isActive ? 1 : 0.88,
                opacity: isActive ? 1 : 0.35,
                filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              data-cursor={isActive ? 'View' : undefined}
            >
              <SlideImg
                src={src}
                alt={`${alt} - ${i + 1}`}
                className={`max-w-full max-h-full object-contain pointer-events-none rounded-sm transition-[filter] duration-300 ${
                  isActive ? 'drop-shadow-2xl' : 'drop-shadow-plate-lg'
                }`}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Arrows */}
      <button
        onClick={prev}
        disabled={index === 0}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-paper-raised/90 backdrop-blur-sm hover:bg-paper-raised text-ink shadow-plate-lg flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        disabled={index === images.length - 1}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-paper-raised/90 backdrop-blur-sm hover:bg-paper-raised text-ink shadow-plate-lg flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-sm bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
        {index + 1} / {images.length}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-paper-raised/80 backdrop-blur-sm shadow">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-ink' : 'w-1.5 bg-ink/30 hover:bg-ink/60'
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
