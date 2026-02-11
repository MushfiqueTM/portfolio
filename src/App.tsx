import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';
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

function App() {
  const [activeView, setActiveView] = useState<ViewType>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis smooth scroll
  useLenis();

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-[#F2F4F6] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-16 h-16 border-4 border-[#E2E8F0] border-t-[#1A2B4A] rounded-full animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#F2F4F6]">
        {/* Floating Navigation */}
        <FloatingNav activeView={activeView} />

        {/* Main Content */}
        <main className="relative">
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

        {/* Background Gradient Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-gradient-radial from-[#3B82F6]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-radial from-[#1A2B4A]/5 to-transparent rounded-full blur-3xl" />
        </div>
      </div>
    </>
  );
}

export default App;
