import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ChevronDown, Calendar, ImageIcon } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Lightbox } from '@/components/Lightbox';
import allProjects from '@/data/allProjects.json';

interface Project {
  title: string;
  date: string;
  highlights: string[];
  images?: string[];
}

export const Projects: React.FC = () => {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    'Autonomous Indoor Thermal Inspection Robot': true,
  });
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const toggleProject = (title: string) => {
    setExpandedProjects(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setLightboxIndex(prev => (prev + 1) % lightboxImages.length);
    } else {
      setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    }
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
                            <ul className="space-y-1.5">
                              {project.highlights.map((highlight, i) => (
                                <li key={i} className="text-sm text-[#5F6B7A] flex gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A2B4A] mt-2 flex-shrink-0" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Images */}
                            {hasImages && (
                              project.title === "Redesigned a Table Fan" && project.images!.length === 4 ? (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-3 items-center">
                                    {project.images!.slice(0, 3).map((imagePath, imgIndex) => (
                                      <motion.div
                                        key={imgIndex}
                                        onClick={() => openLightbox(project.images!, imgIndex)}
                                        className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                                        initial={{ opacity: 0, y: 40, scale: 0.92 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.55, delay: 0.15 + imgIndex * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                        whileHover={{ scale: 1.03, y: -4 }}
                                        data-cursor="View"
                                      >
                                        <OptimizedImage
                                          src={imagePath}
                                          alt={`${project.title} - ${imgIndex + 1}`}
                                          className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                                        />
                                      </motion.div>
                                    ))}
                                  </div>
                                  <motion.div
                                    onClick={() => openLightbox(project.images!, 3)}
                                    className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    data-cursor="View"
                                  >
                                    <OptimizedImage
                                      src={project.images![3]}
                                      alt={`${project.title} - 4`}
                                      className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                                    />
                                  </motion.div>
                                </div>
                              ) : (
                                <div className={`grid gap-3 items-center ${project.images!.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                  {project.images!.map((imagePath, imgIndex) => (
                                    <motion.div
                                      key={imgIndex}
                                      onClick={() => openLightbox(project.images!, imgIndex)}
                                      className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: imgIndex * 0.08 }}
                                      whileHover={{ scale: 1.03 }}
                                      data-cursor="View"
                                    >
                                      <OptimizedImage
                                        src={imagePath}
                                        alt={`${project.title} - ${imgIndex + 1}`}
                                        className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                                      />
                                    </motion.div>
                                  ))}
                                </div>
                              )
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

      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={navigateLightbox}
      />
    </section>
  );
};
