import React from 'react';
import { motion } from 'framer-motion';
import { Box, FileText, Calendar } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ProjectImageGrid } from '@/components/ui/ProjectImageGrid';
import type { ImageLayout } from '@/components/ui/ProjectImageGrid';
import { HighlightList } from '@/components/ui/HighlightList';
import { LightboxHost } from '@/components/LightboxHost';
import { useLightbox } from '@/hooks/useLightbox';
import { ScrollReveal } from '@/components/ScrollReveal';
import projects3D from '@/data/projects3D.json';

interface Project3D {
  title: string;
  date: string;
  description: string;
  highlights: string[];
  images: string[];
  imageLayout?: ImageLayout;
}

export const CADView: React.FC = () => {
  const lightbox = useLightbox();

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
                      <HighlightList items={project.highlights} />

                      {/* Images */}
                      <ProjectImageGrid
                        images={project.images}
                        alt={project.title}
                        layout={project.imageLayout}
                        sizing="natural"
                        withSkeleton
                        reveal
                        onImageClick={(i) => lightbox.open(project.images, i)}
                      />
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
                  <HighlightList
                    items={[
                      'Created detailed technical drawings with precise dimensions and annotations',
                      'Developed comprehensive 2D design layouts for various engineering applications',
                      "Utilized AutoCAD's advanced drafting tools for professional documentation",
                    ]}
                  />

                  <div className="grid grid-cols-1 gap-3">
                    {["/projects/AutoCAD_1.webp", "/projects/AutoCAD_2.webp"].map((imagePath, imgIndex) => (
                      <motion.div
                        key={imgIndex}
                        onClick={() => lightbox.open(["/projects/AutoCAD_1.webp", "/projects/AutoCAD_2.webp"], imgIndex)}
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

      <LightboxHost lightbox={lightbox} />
    </section>
  );
};
