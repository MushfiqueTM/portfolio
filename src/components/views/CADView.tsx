import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, FileText, Calendar } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Lightbox } from '@/components/Lightbox';
import projects3D from '@/data/projects3D.json';

interface Project3D {
  title: string;
  date: string;
  description: string;
  highlights: string[];
  images: string[];
}

export const CADView: React.FC = () => {
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  const renderImages = (images: string[], title: string) => {
    if (images.length === 0) return null;

    // 3+1 layout for 4 images (TGGS / Table Fan)
    if (images.length === 4 && (title.includes('TGGS') || title.includes('Table Fan'))) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {images.slice(0, 3).map((imagePath, imgIndex) => (
              <motion.div
                key={imgIndex}
                onClick={() => openLightbox(images, imgIndex)}
                className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                whileHover={{ scale: 1.03 }}
                data-cursor="View"
              >
                <OptimizedImage
                  src={imagePath}
                  alt={`${title} - ${imgIndex + 1}`}
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                />
              </motion.div>
            ))}
          </div>
          <motion.div
            onClick={() => openLightbox(images, 3)}
            className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
            whileHover={{ scale: 1.02 }}
            data-cursor="View"
          >
            <OptimizedImage
              src={images[3]}
              alt={`${title} - 4`}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
            />
          </motion.div>
        </div>
      );
    }

    // Default grid
    return (
      <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {images.map((imagePath, imgIndex) => (
          <motion.div
            key={imgIndex}
            onClick={() => openLightbox(images, imgIndex)}
            className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
            whileHover={{ scale: 1.03 }}
            data-cursor="View"
          >
            <OptimizedImage
              src={imagePath}
              alt={`${title} - ${imgIndex + 1}`}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section id="cad" className="section-container py-12 sm:py-16">
      {/* SOLIDWORKS Section */}
      <div id="solidworks" className="mb-12 scroll-mt-20">
        <NeuCard className="p-6 sm:p-10">
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
              <Box className="w-6 h-6 text-[#1A2B4A]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">SOLIDWORKS</h2>
          </motion.div>

          {/* Project Cards — always expanded */}
          <div className="space-y-3">
            {(projects3D as Project3D[]).map((project, index) => (
              <ScrollReveal key={project.title} delay={index * 0.08}>
                <div className="rounded-xl border border-[#3B82F6]/30 bg-white shadow-md overflow-hidden">
                  {/* Header */}
                  <div className="p-4 sm:p-5 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-[#1A2B4A]">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[#5F6B7A] mt-0.5">{project.description}</p>
                    </div>
                    <span className="hidden sm:flex items-center gap-1 text-xs text-[#8B95A5] whitespace-nowrap flex-shrink-0">
                      <Calendar className="w-3 h-3" />
                      {project.date}
                    </span>
                  </div>

                  {/* Content */}
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
                      {renderImages(project.images, project.title)}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </NeuCard>
      </div>

      {/* AutoCAD Section */}
      <div id="autocad" className="scroll-mt-20">
        <NeuCard className="p-6 sm:p-10">
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
            >
              <FileText className="w-6 h-6 text-[#1A2B4A]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">AutoCAD</h2>
          </motion.div>

          <ScrollReveal>
            <div className="rounded-xl border border-[#3B82F6]/30 bg-white shadow-md overflow-hidden">
              <div className="p-4 sm:p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-[#1A2B4A]">
                    Technical Drawings & 2D Design
                  </h3>
                  <p className="text-sm text-[#5F6B7A] mt-0.5">Professional technical drawings and 2D design work created using AutoCAD.</p>
                </div>
                <span className="hidden sm:flex items-center gap-1 text-xs text-[#8B95A5] whitespace-nowrap flex-shrink-0">
                  <Calendar className="w-3 h-3" />
                  2023
                </span>
              </div>

              <div className="px-5 pb-5 pt-0">
                <div className="border-t border-[#E2E8F0] pt-4 space-y-4">
                  <ul className="space-y-1.5">
                    <li className="text-sm text-[#5F6B7A] flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A2B4A] mt-2 flex-shrink-0" />
                      <span>Created detailed technical drawings with precise dimensions and annotations</span>
                    </li>
                    <li className="text-sm text-[#5F6B7A] flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A2B4A] mt-2 flex-shrink-0" />
                      <span>Developed comprehensive 2D design layouts for various engineering applications</span>
                    </li>
                    <li className="text-sm text-[#5F6B7A] flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A2B4A] mt-2 flex-shrink-0" />
                      <span>Utilized AutoCAD's advanced drafting tools for professional documentation</span>
                    </li>
                  </ul>

                  <div className="grid grid-cols-1 gap-3">
                    {["/projects/AutoCAD_1.jpg", "/projects/AutoCAD_2.jpg"].map((imagePath, imgIndex) => (
                      <motion.div
                        key={imgIndex}
                        onClick={() => openLightbox(["/projects/AutoCAD_1.jpg", "/projects/AutoCAD_2.jpg"], imgIndex)}
                        className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                        whileHover={{ scale: 1.02 }}
                        data-cursor="View"
                      >
                        <OptimizedImage
                          src={imagePath}
                          alt={`AutoCAD - ${imgIndex + 1}`}
                          className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </NeuCard>
      </div>

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
