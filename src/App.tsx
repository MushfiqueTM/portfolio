import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLenis } from '@/hooks/useLenis';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { EngineeredGridBackground as ParticleBackground } from '@/components/ui/EngineeredGridBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';
import { WorkExperience } from '@/components/sections/WorkExperience';
import { Projects } from '@/components/sections/Projects';
import { Certifications } from '@/components/sections/Certifications';
import { Leadership } from '@/components/sections/Leadership';
import { CADView } from '@/components/views/CADView';
import { DesignView } from '@/components/views/DesignView';
import { Footer } from '@/components/Footer';

type ViewType = 'all' | 'cad' | 'design';

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after the user scrolls past the hero
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    const target = document.getElementById('view-cards');
    if (!target) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(target, { offset: -96 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-6 z-50 w-11 h-11 rounded-full bg-[#1A2B4A] text-white shadow-lg flex items-center justify-center hover:bg-[#2a3f66] transition-colors"
          style={{ right: 'max(1.5rem, calc((100vw - 72rem) / 2 - 3.5rem))' }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function ParallaxOrbs() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 3000], [0, -400]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -250]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 40, stiffness: 100 });
  const smoothMouseY = useSpring(mouseY, { damping: 40, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * 0.02);
      mouseY.set((e.clientY - window.innerHeight / 2) * 0.02);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-gradient-radial from-[#3B82F6]/5 to-transparent rounded-full blur-3xl"
        style={{ y: y1, x: smoothMouseX, translateY: smoothMouseY }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-radial from-[#1A2B4A]/5 to-transparent rounded-full blur-3xl"
        style={{ y: y2, x: smoothMouseX }}
      />
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState<ViewType>('all');

  // Initialize Lenis smooth scroll
  useLenis();

  // Preload every project image up-front so section animations don't hitch on first reveal
  useImagePreloader();

  // Switch view AND scroll to the cards section so the user sees the new selection state.
  // Use Lenis (when available) so the smooth scroll re-evaluates the target each frame —
  // the AnimatePresence exit/enter animation changes document height mid-scroll and
  // a native scrollIntoView would otherwise stop short at the now-stale Y.
  const handleViewChange = useCallback((view: ViewType) => {
    setActiveView(view);
    setTimeout(() => {
      const target = document.getElementById('view-cards');
      if (!target) return;
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.2, offset: -96 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }, []);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <ParticleBackground />
      <BackToTop />
      <div className="min-h-screen bg-[#F2F4F6]">
        {/* Parallax Background Orbs */}
        <ParallaxOrbs />

        {/* Floating Navigation */}
        <FloatingNav activeView={activeView} onViewChange={handleViewChange} />

        {/* Main Content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <Hero activeView={activeView} onViewChange={handleViewChange} />

          {/* Dynamic Content Based on Active View */}
          <AnimatePresence mode="wait">
            {activeView === 'all' && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <WorkExperience />
                <Projects />
                <Leadership />
              </motion.div>
            )}

            {activeView === 'cad' && (
              <motion.div
                key="cad"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <CADView />
              </motion.div>
            )}

            {activeView === 'design' && (
              <motion.div
                key="design"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <DesignView />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Certifications — visible across all views, sits below Leadership in the All view */}
          <Certifications />

          {/* Skills Section */}
          <Skills />

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </>
  );
}

export default App;
