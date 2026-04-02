import React, { useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

type ViewType = 'all' | 'cad' | 'design';

interface ViewNavigatorProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views: { id: ViewType; label: string }[] = [
  { id: 'all', label: 'All Experiences' },
  { id: 'cad', label: 'Computer Aided Designs' },
  { id: 'design', label: 'Graphic Designs' },
];

export const ViewNavigator: React.FC<ViewNavigatorProps> = ({
  activeView,
  onViewChange,
}) => {
  const navRef = useRef<HTMLDivElement>(null);

  const handleViewChange = (view: ViewType) => {
    if (view === activeView) return;
    onViewChange(view);
    // Scroll to the navigator so user sees the new content from the top
    setTimeout(() => {
      navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section ref={navRef} className="section-container py-6 scroll-mt-16">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <LayoutGroup>
          {views.map((view, index) => (
            <motion.button
              key={view.id}
              onClick={() => handleViewChange(view.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium min-h-[40px] sm:min-h-[44px] transition-colors duration-200"
              style={{
                color: activeView === view.id ? '#fff' : '#5F6B7A',
                boxShadow: activeView !== view.id
                  ? '4px 4px 8px rgba(163,177,198,0.5), -4px -4px 8px rgba(255,255,255,0.9)'
                  : 'none',
                backgroundColor: activeView !== view.id ? '#F2F4F6' : 'transparent',
              }}
              whileHover={activeView !== view.id ? { y: -2 } : undefined}
              whileTap={{ scale: 0.98 }}
            >
              {activeView === view.id && (
                <motion.div
                  layoutId="view-pill"
                  className="absolute inset-0 bg-[#1A2B4A] rounded-full shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{view.label}</span>
            </motion.button>
          ))}
        </LayoutGroup>
      </div>
    </section>
  );
};
