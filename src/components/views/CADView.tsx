import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, FileText } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
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

return (
    <section id="cad" className="section-container py-12 sm:py-16">
      <NeuCard className="p-6 sm:p-10">
        {/* SOLIDWORKS Section */}
        <div id="solidworks" className="mb-12 scroll-mt-20">
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

            <div className="space-y-10">
              {(projects3D as Project3D[]).map((project) => (
                <div key={project.title}>
                  <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E2E8F0]">
                    <div className="mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#1A2B4A]">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[#8B95A5] mt-1">{project.date}</p>
                    </div>
                    <p className="text-[#5F6B7A] mb-4">{project.description}</p>

                    <ul className="space-y-2 mb-6">
                      {project.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-[#5F6B7A] flex gap-2">
                          <span className="text-[#8B95A5] mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Images Grid */}
                    {project.images.length > 0 && (
                      <div className="mb-6">
                        {project.title === "TGGS - Motorbike Dolly for Crash Testing" || project.title === "Table Fan Redesign" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                              {project.images.slice(0, 3).map((imagePath, imgIndex) => (
                                <div key={imgIndex} onClick={() => openLightbox(project.images, imgIndex)} className="relative min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                  <OptimizedImage
                                    src={imagePath}
                                    alt={`${project.title} - Image ${imgIndex + 1}`}
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                            {project.images[3] && (
                              <div onClick={() => openLightbox(project.images, 3)} className="relative min-h-[300px] sm:min-h-[450px] rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                <OptimizedImage
                                  src={project.images[3]}
                                  alt={`${project.title} - Image 4`}
                                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            )}
                          </div>
                        ) : project.title === "WEXTECH HK LIMITED - Product Designer" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {project.images.map((imagePath, imgIndex) => (
                                <div key={imgIndex} onClick={() => openLightbox(project.images, imgIndex)} className="relative min-h-[350px] rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                  <OptimizedImage
                                    src={imagePath}
                                    alt={`${project.title} - Image ${imgIndex + 1}`}
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className={`grid gap-4 ${project.images.length === 1 ? 'grid-cols-1' : project.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : project.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                            {project.images.map((imagePath, imgIndex) => (
                              <div key={imgIndex} onClick={() => openLightbox(project.images, imgIndex)} className={`relative rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${project.images.length === 1 ? 'min-h-[400px]' : project.images.length === 2 ? 'min-h-[350px]' : 'min-h-[280px]'}`}>
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
                </div>
              ))}
            </div>
          </div>

          {/* AutoCAD Section */}
          <div id="autocad" className="pt-12 border-t-2 border-[#E2E8F0] scroll-mt-20">
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

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E2E8F0]">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-[#1A2B4A]">
                  Technical Drawings & 2D Design
                </h3>
                <p className="text-sm text-[#8B95A5] mt-1">2023</p>
              </div>
              <p className="text-[#5F6B7A] mb-4">
                Professional technical drawings and 2D design work created using AutoCAD software.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="text-sm text-[#5F6B7A] flex gap-2">
                  <span className="text-[#8B95A5] mt-1">•</span>
                  <span>Created detailed technical drawings with precise dimensions and annotations</span>
                </li>
                <li className="text-sm text-[#5F6B7A] flex gap-2">
                  <span className="text-[#8B95A5] mt-1">•</span>
                  <span>Developed comprehensive 2D design layouts for various engineering applications</span>
                </li>
                <li className="text-sm text-[#5F6B7A] flex gap-2">
                  <span className="text-[#8B95A5] mt-1">•</span>
                  <span>Utilized AutoCAD's advanced drafting tools for professional documentation</span>
                </li>
              </ul>

              {/* AutoCAD Images */}
              <div className="mb-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    {["/projects/AutoCAD_1.jpg", "/projects/AutoCAD_2.jpg"].map((imagePath, imgIndex) => (
                      <div key={imgIndex} onClick={() => openLightbox(["/projects/AutoCAD_1.jpg", "/projects/AutoCAD_2.jpg"], imgIndex)} className="relative min-h-[300px] sm:min-h-[400px] rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                        <OptimizedImage
                          src={imagePath}
                          alt={`AutoCAD - Image ${imgIndex + 1}`}
                          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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