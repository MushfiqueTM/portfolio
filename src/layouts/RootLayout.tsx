import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLenis } from '@/hooks/useLenis';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { EngineeredGridBackground } from '@/components/ui/EngineeredGridBackground';
import { ParallaxOrbs } from '@/components/ParallaxOrbs';
import { BackToTop } from '@/components/BackToTop';
import { FloatingNav } from '@/components/FloatingNav';
import { Footer } from '@/components/Footer';

/**
 * Resets scroll on navigation.
 *
 * Lenis caches the document height, so a route change needs both a jump to the top and
 * a `resize()` — without the resize it clamps scrolling to the *previous* page's height,
 * which strands you partway down a longer page. Both run after a frame so the incoming
 * route has laid out and `resize()` measures the new height rather than the old one.
 */
function ScrollOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        lenis.resize();
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

/**
 * The persistent frame around every page: cursor, backgrounds, nav, and footer.
 *
 * This is a layout route, so it stays mounted across navigations — which matters for
 * `useLenis`, whose instance must survive route changes, and for FloatingNav's
 * `layoutId` pill animation.
 */
export function RootLayout() {
  useLenis();

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <EngineeredGridBackground />
      <BackToTop />
      <ScrollOnNavigate />
      <div className="min-h-screen bg-paper">
        <ParallaxOrbs />
        <FloatingNav />
        <main className="relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
