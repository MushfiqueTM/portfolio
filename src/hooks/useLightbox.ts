import { useCallback, useState } from 'react';

export interface LightboxState {
  images: string[];
  index: number;
  isOpen: boolean;
  /** Open the lightbox on `images`, starting at `index`. */
  open: (images: string[], index: number) => void;
  close: () => void;
  navigate: (direction: 'next' | 'prev') => void;
}

/**
 * Lightbox open/close/navigate state. Every section that shows images owns one
 * of these and hands it to <LightboxHost />.
 */
export function useLightbox(): LightboxState {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next: string[], at: number) => {
    setImages(next);
    setIndex(at);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      setIndex((prev) =>
        direction === 'next'
          ? (prev + 1) % images.length
          : (prev - 1 + images.length) % images.length
      );
    },
    [images.length]
  );

  return { images, index, isOpen, open, close, navigate };
}
