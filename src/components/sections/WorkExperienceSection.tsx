"use client";

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import workExperience from '../../data/workExperience.json';

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

interface WorkExperienceSectionProps {
  expanded: {
    work: {[key: string]: boolean};
    team: {[key: string]: boolean};
  };
  toggleImages: (category: 'work' | 'team', key: string) => void;
  openLightbox: (imagePath: string, allImages: string[], index: number) => void;
}

const WorkExperienceSection = memo(({
  expanded,
  toggleImages,
  openLightbox
}: WorkExperienceSectionProps) => {
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Work Experience</h2>
        </motion.div>
        <div className="space-y-10">
          {workExperience.map((work, index) => (
            <ProjectItem key={index} index={index}>
              <div className="border-l-2 border-[var(--color-border)] pl-3 sm:pl-4 md:pl-6 pb-4 sm:pb-6 last:pb-0">
                <div className="mb-3">
                  <div className="flex items-center gap-3 mb-1">
                    {(work.company === "CLP Power Hong Kong" || work.company === "PolyU E Formula Racing Team" || work.company === "Thai German Graduate School of Engineering (TGGS)" || work.company === "World Green Organization (WGO) – ESG Accelerator") && (
                      <img
                        src={work.company === "CLP Power Hong Kong" ? "/projects/CLP_logo_2.png" :
                             work.company === "PolyU E Formula Racing Team" ? "/projects/Racing_logo.jpg" :
                             work.company === "Thai German Graduate School of Engineering (TGGS)" ? "/projects/TGGS_logo.png" :
                             "/projects/world_green_org_2.jpg"}
                        alt={`${work.company} Logo`}
                        className="w-8 h-8 object-contain rounded"
                      />
                    )}
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">{work.company}</h3>
                  </div>
                  <p className="text-base text-[var(--color-body)] mb-1">{work.role}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-[var(--color-muted)]">
                    <span>{work.date}</span><span>•</span><span>{work.location}</span>
                  </div>
                </div>
                {work.teams.map((team, teamIndex) => (
                  <div key={teamIndex} className="mt-4">
                    {team.name && <p className={`text-base font-medium text-[var(--color-body)] mb-2 ${team.name === 'Project Execution Team (PET)' || team.name === 'Hong Kong Battery Energy Storage System (HKBESS)' ? 'font-bold' : ''}`}>{team.name}</p>}
                    <ul className="space-y-2">
                      {team.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-[var(--color-body)] flex gap-2">
                          <span className="text-[var(--color-muted)] mt-1">•</span><span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    {'images' in team && team.images && team.images.length > 0 && (
                      <div className="mt-4">
                        <motion.button
                          onClick={() => toggleImages('team', team.name)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ rotate: expanded.team[team.name] ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                          {expanded.team[team.name] ? 'Hide Images' : 'Show Images'}
                        </motion.button>
                        <AnimatePresence>
                          {expanded.team[team.name] && 'images' in team && team.images && team.images.length > 0 && (
                            <motion.div
                              className="mt-4 space-y-4 overflow-hidden"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                              <div className={`grid gap-4 ${team.images.length === 1 ? 'grid-cols-1' : team.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : team.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                                {team.images.map((imagePath: string, imgIndex: number) => (
                                  <motion.div
                                    key={imgIndex}
                                    onClick={() => openLightbox(imagePath, team.images, imgIndex)}
                                    className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${team.images.length === 1 ? 'min-h-[300px]' : team.images.length === 2 ? 'min-h-[250px]' : 'min-h-[100px]'}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <OptimizedImage
                                      src={imagePath}
                                      alt={`${team.name} - Image ${imgIndex + 1}`}
                                      className="w-full h-auto object-contain"
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
                {work.images && work.images.length > 0 && (
                  <div className="mt-4">
                    <motion.button
                      onClick={() => toggleImages('work', work.company)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: expanded.work[work.company] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                      {expanded.work[work.company] ? 'Hide Images' : 'Show Images'}
                    </motion.button>
                    <AnimatePresence>
                      {expanded.work[work.company] && (
                        <motion.div
                          className="mt-4 space-y-4 overflow-hidden"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                        {work.company === "Thai German Graduate School of Engineering (TGGS)" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                              {work.images.slice(0, 3).map((imagePath, imgIndex) => (
                                <div key={imgIndex} onClick={() => openLightbox(imagePath, work.images, imgIndex)} className="relative min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                  <OptimizedImage
                                    src={imagePath}
                                    alt={`${work.company} - Image ${imgIndex + 1}`}
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                            {work.images[3] && (
                              <div onClick={() => openLightbox(work.images[3], work.images, 3)} className="relative min-h-[300px] sm:min-h-[450px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                <OptimizedImage
                                  src={work.images[3]}
                                  alt={`${work.company} - Image 4`}
                                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`grid gap-4 ${work.images.length === 1 ? 'grid-cols-1' : work.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : work.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                            {work.images.map((imagePath, imgIndex) => (
                              <motion.div
                                key={imgIndex}
                                onClick={() => openLightbox(imagePath, work.images, imgIndex)}
                                className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${work.images.length === 1 ? 'min-h-[400px]' : work.images.length === 2 ? 'min-h-[350px]' : work.images.length === 3 ? 'min-h-[200px]' : 'min-h-[200px]'}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <OptimizedImage
                                  src={imagePath}
                                  alt={`${work.company} - Image ${imgIndex + 1}`}
                                  className="w-full h-auto object-contain"
                                />
                              </motion.div>
                            ))}
                          </div>
                        )}
                        </motion.div>
                      )}
                    </AnimatePresence>
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

export default WorkExperienceSection;
