import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ChevronDown, Calendar } from 'lucide-react';
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
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
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
      <ScrollReveal>
        <NeuCard className="p-6 sm:p-10">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
            >
              <FolderOpen className="w-6 h-6 text-[#1A2B4A]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Projects</h2>
          </div>

          {/* Projects List */}
          <div className="space-y-8">
            {(allProjects as Project[]).map((project, index) => (
              <ScrollReveal key={project.title} delay={index * 0.1}>
                <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E2E8F0]">
                  {/* Project Header */}
                  <div className="mb-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#1A2B4A]">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-sm text-[#8B95A5]">
                      <Calendar className="w-3.5 h-3.5" />
                      {project.date}
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-4">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-[#5F6B7A] flex gap-2">
                        <span className="text-[#8B95A5] mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Images Toggle */}
                  {project.images && project.images.length > 0 && (
                    <div>
                      <motion.button
                        onClick={() => toggleProject(project.title)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1A2B4A] rounded-lg shadow-md hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.span
                          animate={{ rotate: expandedProjects[project.title] ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                        {expandedProjects[project.title] ? 'Hide Images' : 'Show Images'}
                      </motion.button>

                      <AnimatePresence>
                        {expandedProjects[project.title] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            className="mt-4 overflow-hidden"
                          >
                            {project.title === "Redesigned a Table Fan" ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                  {project.images?.slice(0, 3).map((imagePath, imgIndex) => (
                                    <div 
                                      key={imgIndex} 
                                      onClick={() => openLightbox(project.images!, imgIndex)} 
                                      className="relative min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center"
                                    >
                                      <OptimizedImage
                                        src={imagePath}
                                        alt={`${project.title} - Image ${imgIndex + 1}`}
                                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                  ))}
                                </div>
                                {project.images?.[3] && (
                                  <div 
                                    onClick={() => openLightbox(project.images!, 3)} 
                                    className="relative min-h-[300px] sm:min-h-[450px] rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center"
                                  >
                                    <OptimizedImage
                                      src={project.images[3]}
                                      alt={`${project.title} - Image 4`}
                                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className={`grid gap-3 sm:gap-4 ${project.images?.length === 1 ? 'grid-cols-1' : project.images?.length === 2 ? 'grid-cols-1 md:grid-cols-2' : project.images?.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                                {project.images?.map((imagePath, imgIndex) => (
                                  <div key={imgIndex} onClick={() => openLightbox(project.images!, imgIndex)} className={`relative rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${project.images?.length === 1 ? 'min-h-[300px] sm:min-h-[400px]' : project.images?.length === 2 ? 'min-h-[250px] sm:min-h-[350px]' : 'min-h-[200px] sm:min-h-[280px]'}`}>
                                    <OptimizedImage
                                      src={imagePath}
                                      alt={`${project.title} - Image ${imgIndex + 1}`}
                                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </NeuCard>
      </ScrollReveal>

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
