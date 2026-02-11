import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  return (
    <section className="section-container py-6">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {views.map((view, index) => (
          <motion.button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              'px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 min-h-[40px] sm:min-h-[44px]',
              activeView === view.id
                ? 'bg-[#1A2B4A] text-white shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]'
                : 'bg-[#F2F4F6] text-[#5F6B7A] shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.9)] hover:text-[#1A2B4A]'
            )}
            whileHover={activeView !== view.id ? { y: -2 } : undefined}
            whileTap={{ scale: 0.98 }}
          >
            {view.label}
          </motion.button>
        ))}
      </div>
    </section>
  );
};
