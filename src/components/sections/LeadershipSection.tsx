"use client";

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import leadership from '../../data/leadership.json';

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

interface LeadershipSectionProps {
  expanded: {
    leadership: {[key: string]: boolean};
  };
  toggleImages: (category: 'leadership', key: string) => void;
  openLightbox: (imagePath: string, allImages: string[], index: number) => void;
}

const LeadershipSection = memo(({
  expanded,
  toggleImages,
  openLightbox
}: LeadershipSectionProps) => {
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
            <BookOpen className="w-6 h-6 text-[var(--color-body)]" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Leadership & Campus Engagement</h2>
        </motion.div>
        <div className="space-y-8">
          {leadership.map((lead, index) => (
            <ProjectItem key={index} index={index}>
              <div className="border-l-2 border-[var(--color-border)] pl-3 sm:pl-4 md:pl-6 pb-4 sm:pb-6 last:pb-0">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">{lead.organization}</h3>
                    {lead.organization === "PolyU ENGL English Debate Club" && (
                      <a href="https://www.instagram.com/polyu.englishdebate?igsh=cDc4ZXhocWd1aG5t" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {lead.organization === "PolyU International Student Association" && (
                      <a href="https://www.instagram.com/polyusao_isa?igsh=MTk5c3VvdmphbHRkag==" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {lead.organization === "PolyU Student Halls of Residence" && (
                      <a href="https://www.instagram.com/polyu_yellow_hall?igsh=cmI4bW15YXJieDZh" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="text-base text-[var(--color-body)] mb-1">{lead.role}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-[var(--color-muted)]">
                    <span>{lead.date}</span><span>•</span><span>{lead.location}</span>
                  </div>
                </div>
                <ul className="space-y-2 mt-4">
                  {lead.highlights.map((highlight, i) => (
                    <li key={i} className="text-sm text-[var(--color-body)] flex gap-2">
                      <span className="text-[var(--color-muted)] mt-1">•</span><span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                {lead.images && lead.images.length > 0 && (
                  <div className="mt-4">
                    <motion.button
                      onClick={() => toggleImages('leadership', lead.organization)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: expanded.leadership[lead.organization] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                      {expanded.leadership[lead.organization] ? 'Hide Images' : 'Show Images'}
                    </motion.button>
                    <AnimatePresence>
                      {expanded.leadership[lead.organization] && 'images' in lead && lead.images && lead.images.length > 0 && (
                        <motion.div
                          className="mt-4 space-y-4 overflow-hidden"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                          <div className={`grid gap-4 ${lead.images.length === 1 ? 'grid-cols-1' : lead.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : lead.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                            {lead.images.map((imagePath: string, imgIndex: number) => (
                              <motion.div
                                key={imgIndex}
                                onClick={() => openLightbox(imagePath, lead.images, imgIndex)}
                                className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${lead.images.length === 1 ? 'min-h-[300px]' : lead.images.length === 2 ? 'min-h-[250px]' : 'min-h-[100px]'}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <OptimizedImage
                                  src={imagePath}
                                  alt={`${lead.organization} - Image ${imgIndex + 1}`}
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
                {lead.reels && lead.reels.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Instagram Reels</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {lead.reels.map((reel, index) => (
                        <motion.a
                          key={index}
                          href={reel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 p-3 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
                          style={{
                            background: 'linear-gradient(to right, var(--color-surface), var(--color-surface))',
                            borderColor: 'var(--color-border)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                            e.currentTarget.style.background = 'linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.05))';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.background = 'linear-gradient(to right, var(--color-surface), var(--color-surface))';
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(to bottom right, var(--color-accent), var(--color-primary))' }}
                            whileHover={{ scale: 1.15, rotate: 360 }}
                            transition={{ duration: 0.4 }}
                          >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-heading)] group-hover:text-[var(--color-heading)] truncate">
                              {reel.title}
                            </p>
                            <p className="text-xs text-[var(--color-muted)] group-hover:text-[var(--color-body)]">
                              View on Instagram
                            </p>
                          </div>
                          <motion.div
                            className="flex-shrink-0"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1, x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg className="w-4 h-4 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </motion.div>
                        </motion.a>
                      ))}
                    </div>
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

export default LeadershipSection;
