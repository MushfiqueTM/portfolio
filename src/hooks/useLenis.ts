import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Lenis caches the document height as its scroll limit. Anything that changes that
    // height after mount — an accordion expanding, images arriving — leaves the limit
    // stale, and Lenis clamps scrolling to the OLD maximum until it re-measures. That
    // reads as the page refusing to scroll for a moment, for exactly as long as the
    // growth takes. Re-measuring on every height change keeps the limit correct.
    //
    // resize() only reads layout, so this cannot feed back into itself.
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    // Keep the handle so cleanup can cancel the loop. Without this the callback kept
    // rescheduling itself and calling .raf() on a destroyed instance — which StrictMode
    // makes visible immediately, since it mounts the effect twice.
    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
