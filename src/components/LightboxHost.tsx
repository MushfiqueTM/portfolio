import React, { lazy, Suspense } from 'react';
import type { LightboxState } from '@/hooks/useLightbox';

const Lightbox = lazy(() =>
  import('@/components/Lightbox').then((m) => ({ default: m.Lightbox }))
);

/**
 * Renders nothing until the lightbox is opened, so its chunk stays off the
 * critical path. Pair with useLightbox().
 */
export const LightboxHost: React.FC<{ lightbox: LightboxState }> = ({ lightbox }) => {
  if (!lightbox.isOpen) return null;

  return (
    <Suspense fallback={null}>
      <Lightbox
        images={lightbox.images}
        currentIndex={lightbox.index}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNavigate={lightbox.navigate}
      />
    </Suspense>
  );
};
