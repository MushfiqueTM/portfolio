import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLenis } from '@/hooks/useLenis';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { Hero } from '@/components/sections/Hero';
import { Education } from '@/components/sections/Education';
import { Skills } from '@/components/sections/Skills';
import { ViewNavigator } from '@/components/ViewNavigator';
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
      const viewNav = document.querySelector('.section-container.py-6');
      if (viewNav) {
        setVisible(window.scrollY > viewNav.getBoundingClientRect().top + window.scrollY + 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToViewNav = useCallback(() => {
    const viewNav = document.querySelector('.section-container.py-6');
    if (viewNav) {
      const offset = 60;
      const top = viewNav.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
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
          onClick={scrollToViewNav}
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
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis smooth scroll
  useLenis();

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] bg-[#F2F4F6] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-0">
                {"Mushfique's".split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    className="text-4xl sm:text-5xl font-bold text-[#1A2B4A] inline-block"
                    initial={{ y: 40, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <motion.span
                className="text-sm sm:text-base font-light tracking-[0.3em] uppercase text-[#5F6B7A]"
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Portfolio
              </motion.span>
            </div>
            {/* Animated underline */}
            <motion.div
              className="absolute bottom-[42%] h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 160, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CustomCursor />
      <ScrollProgress />
      <ParticleBackground />
      <BackToTop />
      <div className="min-h-screen bg-[#F2F4F6]">
        {/* Parallax Background Orbs */}
        <ParallaxOrbs />

        {/* Floating Navigation */}
        <FloatingNav activeView={activeView} />

        {/* Main Content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <Hero />

          {/* Education Section */}
          <Education />

          {/* Skills Section */}
          <Skills />

          {/* View Navigator */}
          <ViewNavigator activeView={activeView} onViewChange={setActiveView} />

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
                <Certifications />
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

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </>
  );
}

export default App;
