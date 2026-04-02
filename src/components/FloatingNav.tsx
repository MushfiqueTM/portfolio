import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string; // For mobile
}

type ViewType = 'all' | 'cad' | 'design';

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', shortLabel: 'Home' },
  { id: 'education', label: 'Education', shortLabel: 'Edu' },
  { id: 'skills', label: 'Skills', shortLabel: 'Skills' },
  { id: 'experience', label: 'Experience', shortLabel: 'Work' },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects' },
  { id: 'certifications', label: 'Certs', shortLabel: 'Certs' },
  { id: 'leadership', label: 'Leadership', shortLabel: 'Lead' },
];

interface FloatingNavProps {
  activeView: ViewType;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ activeView }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);

      // Determine active section
      const visibleItems = getVisibleNavItems();
      const sections = visibleItems.map(item => document.getElementById(item.id));
      const scrollPosition = scrollY + window.innerHeight / 3;

      // If at the bottom of the page, activate the last section
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

  // Determine which navigation items to show based on active view
  const getVisibleNavItems = () => {
    if (activeView === 'all') {
      return navItems;
    } else if (activeView === 'cad') {
      // For CAD view, show Home, Education, Skills, Solidworks, AutoCAD
      const cadNavItems: NavItem[] = [
        navItems[0], // Home
        navItems[1], // Education
        navItems[2], // Skills
        { id: 'solidworks', label: 'SOLIDWORKS', shortLabel: 'SW' },
        { id: 'autocad', label: 'AutoCAD', shortLabel: 'CAD' }
      ];
      return cadNavItems;
    } else if (activeView === 'design') {
      // For Design view, show Home, Education, Skills, Design
      const designNavItems: NavItem[] = [
        navItems[0], // Home
        navItems[1], // Education
        navItems[2], // Skills
        { id: 'design', label: 'Graphic Designs', shortLabel: 'Design' }
      ];
      return designNavItems;
    }
    return [navItems[0]]; // Default to Home
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
          <nav className="floating-nav px-2 sm:px-3 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-[95vw] sm:max-w-[90vw]">
            <LayoutGroup>
              {getVisibleNavItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 transition-colors duration-200"
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
            </LayoutGroup>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
