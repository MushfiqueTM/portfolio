"use client";

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import allExperiencesProjects from '../../data/allProjects.json';

// Image component with loading states and error handling
const OptimizedImage = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  onClick,
  motionProps = {},
  disableHover = false
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  motionProps?: any;
  disableHover?: boolean;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${containerClassName}`}
      onClick={onClick}
      {...motionProps}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] z-10">
          <div className="w-8 h-8 border-2 border-[var(--color-muted)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-muted)] z-10">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${!disableHover ? 'group-hover:scale-105' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

interface ProjectsSectionProps {
  expanded: {
    project: {[key: string]: boolean};
  };
  toggleImages: (category: 'project', key: string) => void;
  openLightbox: (imagePath: string, allImages: string[], index: number) => void;
}

const ProjectsSection = memo(({
  expanded,
  toggleImages,
  openLightbox
}: ProjectsSectionProps) => {
  const ProjectItem = ({ children, index }: { children: React.ReactNode; index: number }) => {
    const [isInView, setIsInView] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        },
        { rootMargin: "-100px" }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="rounded-2xl shadow-sm p-8 md:p-12 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Briefcase className="w-6 h-6 text-[var(--color-body)]" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Projects</h2>
        </motion.div>
        <div className="space-y-10">
          {allExperiencesProjects.map((project, index) => (
            <ProjectItem key={index} index={index}>
              <div className="border-l-2 border-[var(--color-border)] pl-3 sm:pl-4 md:pl-6 pb-4 sm:pb-6 last:pb-0">
                <div className="mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">{project.title}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{project.date}</p>
                </div>
                {project.highlights.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-[var(--color-body)] flex gap-2">
                        <span className="text-[var(--color-muted)] mt-1">•</span><span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {project.images && project.images.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleImages('project', project.title)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                    >
                      <svg className={`w-4 h-4 transition-transform duration-200 ${expanded.project[project.title] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {expanded.project[project.title] ? 'Hide Images' : 'Show Images'}
                    </button>
                    {expanded.project[project.title] && (
                      <div className="mt-4 space-y-4">
                        {project.title === "Redesigned a Table Fan" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                              {project.images.slice(0, 3).map((imagePath, imgIndex) => (
                                <div key={imgIndex} onClick={() => openLightbox(imagePath, project.images, imgIndex)} className="relative min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                  <OptimizedImage
                                    src={imagePath}
                                    alt={`${project.title} - Image ${imgIndex + 1}`}
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                            {project.images[3] && (
                              <div onClick={() => openLightbox(project.images[3], project.images, 3)} className="relative min-h-[300px] sm:min-h-[450px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                <OptimizedImage
                                  src={project.images[3]}
                                  alt={`${project.title} - Image 4`}
                                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`grid gap-3 sm:gap-4 ${project.images.length === 1 ? 'grid-cols-1' : project.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : project.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                            {project.images.map((imagePath, imgIndex) => (
                              <div key={imgIndex} onClick={() => openLightbox(imagePath, project.images, imgIndex)} className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${project.images.length === 1 ? 'min-h-[300px] sm:min-h-[400px]' : project.images.length === 2 ? 'min-h-[250px] sm:min-h-[350px]' : 'min-h-[200px] sm:min-h-[280px]'}`}>
                                <OptimizedImage
                                  src={imagePath}
                                  alt={`${project.title} - Image ${imgIndex + 1}`}
                                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ProjectItem>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProjectsSection;
