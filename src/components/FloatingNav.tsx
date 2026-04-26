import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
}

type ViewType = 'all' | 'cad' | 'design';

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', shortLabel: 'Home' },
  { id: 'experience', label: 'Experience', shortLabel: 'Work' },
  { id: 'projects', label: 'Projects', shortLabel: 'Proj' },
  { id: 'leadership', label: 'Leadership', shortLabel: 'Lead' },
  { id: 'certifications', label: 'Certs', shortLabel: 'Certs' },
  { id: 'skills', label: 'Skills', shortLabel: 'Skills' },
];

const viewToggle: { id: ViewType; label: string; shortLabel: string }[] = [
  { id: 'all', label: 'All', shortLabel: 'All' },
  { id: 'cad', label: 'CAD', shortLabel: 'CAD' },
  { id: 'design', label: 'Design', shortLabel: 'Design' },
];

interface FloatingNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ activeView, onViewChange }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);

      const visibleItems = getVisibleNavItems();
      const sections = visibleItems.map((item) => document.getElementById(item.id));
      const scrollPosition = scrollY + window.innerHeight / 3;

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveSection(visibleItems[visibleItems.length - 1].id);
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(visibleItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getVisibleNavItems = () => {
    const home = { id: 'hero', label: 'Home', shortLabel: 'Home' };
    const certifications = { id: 'certifications', label: 'Certs', shortLabel: 'Certs' };
    const skills = { id: 'skills', label: 'Skills', shortLabel: 'Skills' };

    if (activeView === 'all') {
      return navItems;
    } else if (activeView === 'cad') {
      return [
        home,
        { id: 'solidworks', label: 'SOLIDWORKS', shortLabel: 'SW' },
        { id: 'autocad', label: 'AutoCAD', shortLabel: 'CAD' },
        certifications,
        skills,
      ];
    } else if (activeView === 'design') {
      return [
        home,
        { id: 'design', label: 'Graphic Designs', shortLabel: 'Design' },
        certifications,
        skills,
      ];
    }
    return [home];
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4"
        >
          <nav className="floating-nav px-2 sm:px-3 py-1.5 flex flex-wrap sm:flex-nowrap justify-center items-center gap-y-1.5 gap-x-1 sm:gap-x-2 max-w-[95vw] sm:max-w-[92vw]">
            {/* Section links */}
            <LayoutGroup id="section-nav">
              <div className="flex flex-wrap justify-center items-center gap-y-1 gap-x-0.5 sm:gap-x-1">
                {getVisibleNavItems().map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="relative px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 transition-colors duration-200"
                    style={{ color: activeSection === item.id ? '#fff' : '#5F6B7A' }}
                  >
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-[#1A2B4A] rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      {isMobile && item.shortLabel ? item.shortLabel : item.label}
                    </span>
                  </button>
                ))}
              </div>
            </LayoutGroup>

            {/* Divider — hidden on mobile where the toggle wraps to its own row */}
            <div className="hidden sm:block w-px h-6 bg-[#1A2B4A]/12 flex-shrink-0" />

            {/* View toggle */}
            <LayoutGroup id="view-toggle">
              <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-[#F2F4F6] flex-shrink-0">
                {viewToggle.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onViewChange(t.id)}
                    className="relative px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold rounded-full whitespace-nowrap transition-colors duration-200"
                    style={{ color: activeView === t.id ? '#fff' : '#5F6B7A' }}
                    aria-pressed={activeView === t.id}
                  >
                    {activeView === t.id && (
                      <motion.div
                        layoutId="view-pill-nav"
                        className="absolute inset-0 bg-[#1A2B4A] rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
