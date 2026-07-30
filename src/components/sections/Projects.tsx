import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ChevronDown, Calendar, ImageIcon } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { ProjectImageGrid } from '@/components/ui/ProjectImageGrid';
import type { ImageLayout } from '@/components/ui/ProjectImageGrid';
import { HighlightList } from '@/components/ui/HighlightList';
import { LightboxHost } from '@/components/LightboxHost';
import { useLightbox } from '@/hooks/useLightbox';
import { ScrollReveal } from '@/components/ScrollReveal';
import allProjects from '@/data/allProjects.json';

interface Project {
  title: string;
  date: string;
  highlights: string[];
  images?: string[];
  imageLayout?: ImageLayout;
}

export const Projects: React.FC = () => {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    'Autonomous Indoor Thermal Inspection Robot': true,
  });
  const lightbox = useLightbox();

  const toggleProject = (title: string) => {
    setExpandedProjects(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <section id="projects" className="section-container py-12 sm:py-16">
      <NeuCard className="p-6 sm:p-10">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
          >
            <FolderOpen className="w-6 h-6 text-[#1A2B4A]" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Projects</h2>
        </motion.div>

        {/* Project Cards */}
        <div className="space-y-3">
          {(allProjects as Project[]).map((project, index) => {
            const isExpanded = !!expandedProjects[project.title];
            const hasImages = project.images && project.images.length > 0;

            return (
              <ScrollReveal key={project.title} delay={index * 0.08}>
                <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#3B82F6]/30 bg-white shadow-md' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#3B82F6]/20'}`}>
                  {/* Clickable header */}
                  <motion.button
                    onClick={() => toggleProject(project.title)}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
                    whileTap={{ scale: 0.995 }}
                  >
                    {/* Summary */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-[#1A2B4A]">
                        {project.title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs text-[#8B95A5] mt-1">
                        <Calendar className="w-3 h-3" />
                        {project.date}
                      </span>
                    </div>

                    {/* Right side: image count + chevron */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {hasImages && (
                        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-[#EEF1F5] text-xs text-[#8B95A5]">
                          <ImageIcon className="w-3 h-3" />
                          {project.images!.length}
                        </div>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-[#8B95A5]" />
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Expandable content: highlights + images */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-[#E2E8F0] pt-4 space-y-4">
                            {/* Highlights */}
                            <HighlightList items={project.highlights} />

                            {/* Images */}
                            {hasImages && (
                              <ProjectImageGrid
                                images={project.images!}
                                alt={project.title}
                                layout={project.imageLayout}
                                withSkeleton
                                onImageClick={(i) => lightbox.open(project.images!, i)}
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </NeuCard>

      <LightboxHost lightbox={lightbox} />
    </section>
  );
};
