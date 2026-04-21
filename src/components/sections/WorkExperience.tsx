import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ChevronDown, MapPin, Calendar } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Lightbox } from '@/components/Lightbox';
import workExperience from '@/data/workExperience.json';

interface Team {
  name: string;
  highlights: string[];
  images?: string[];
}

interface WorkItem {
  company: string;
  role: string;
  date: string;
  location: string;
  teams: Team[];
  images: string[];
}

const getCompanyLogo = (company: string): string | null => {
  const logos: Record<string, string> = {
    'MangDang Technology Co., Limited': '/projects/MANGDANG TECHNOLOGY COLIMITEDCompany Logo.webp',
    'CLP Power Hong Kong': '/projects/CLP_logo_2.png',
    'PolyU E Formula Racing Team': '/projects/Racing_logo.jpg',
    'Thai German Graduate School of Engineering (TGGS)': '/projects/TGGS_logo.png',
    'World Green Organization (WGO) – ESG Accelerator': '/projects/world_green_org_2.jpg',
  };
  return logos[company] || null;
};

export const WorkExperience: React.FC = () => {
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({
    [(workExperience as WorkItem[])[0]?.company]: true,
  });
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const toggleCompany = (company: string) => {
    setExpandedCompanies(prev => ({ ...prev, [company]: !prev[company] }));
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
    <section id="experience" className="section-container py-12 sm:py-16">
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
            <Briefcase className="w-6 h-6 text-[#1A2B4A]" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Work Experience</h2>
        </motion.div>

        {/* Accordion Cards */}
        <div className="space-y-3">
          {(workExperience as WorkItem[]).map((work, index) => {
            const isExpanded = !!expandedCompanies[work.company];
            return (
              <ScrollReveal key={work.company} delay={index * 0.08}>
                <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#3B82F6]/30 bg-white shadow-md' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#3B82F6]/20'}`}>
                  {/* Collapsed header — always visible */}
                  <motion.button
                    onClick={() => toggleCompany(work.company)}
                    className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
                    whileTap={{ scale: 0.995 }}
                  >
                    {/* Logo */}
                    {getCompanyLogo(work.company) ? (
                      <div className="w-11 h-11 rounded-lg bg-white shadow-sm p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={getCompanyLogo(work.company)!}
                          alt={work.company}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-[#EEF1F5] flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-[#8B95A5]" />
                      </div>
                    )}

                    {/* Summary info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-[#1A2B4A] truncate">
                        {work.company}
                      </h3>
                      <p className="text-sm text-[#5F6B7A] truncate">{work.role}</p>
                    </div>

                    {/* Right side: date + badges + chevron */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="hidden sm:flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1 text-xs text-[#8B95A5]">
                          <Calendar className="w-3 h-3" />
                          {work.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#8B95A5]">
                          <MapPin className="w-3 h-3" />
                          {work.location}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-[#8B95A5]" />
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Mobile meta — only shown in header on small screens */}
                  {!isExpanded && (
                    <div className="sm:hidden flex items-center gap-3 px-5 pb-3 -mt-1 text-xs text-[#8B95A5]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {work.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {work.location}
                      </span>
                    </div>
                  )}

                  {/* Expanded content */}
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
                          {/* Mobile meta when expanded */}
                          <div className="sm:hidden flex items-center gap-3 mb-4 text-xs text-[#8B95A5]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {work.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {work.location}
                            </span>
                          </div>

                          <div className="border-t border-[#E2E8F0] pt-4 space-y-5">
                            {/* Teams */}
                            {work.teams.map((team, teamIndex) => (
                              <div key={teamIndex}>
                                {team.name && (
                                  <h4 className="font-medium text-[#1A2B4A] mb-2 text-sm">{team.name}</h4>
                                )}
                                <ul className="space-y-1.5">
                                  {team.highlights.map((highlight, i) => (
                                    <li key={i} className="text-sm text-[#5F6B7A] flex gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A2B4A] mt-2 flex-shrink-0" />
                                      <span>{highlight}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* Team images */}
                                {team.images && team.images.length > 0 && (
                                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {team.images.map((imagePath, imgIndex) => (
                                      <motion.div
                                        key={imgIndex}
                                        onClick={() => openLightbox(team.images!, imgIndex)}
                                        className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                                        initial={{ opacity: 0, y: 40, scale: 0.92 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.55, delay: 0.15 + imgIndex * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                        whileHover={{ scale: 1.03, y: -4 }}
                                        data-cursor="View"
                                      >
                                        <OptimizedImage
                                          src={imagePath}
                                          alt={`${team.name} - ${imgIndex + 1}`}
                                          className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                                        />
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Company-level images */}
                            {work.images.length > 0 && (
                              <div>
                                {work.company === "Thai German Graduate School of Engineering (TGGS)" && work.images.length === 4 ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3">
                                      {work.images.slice(0, 3).map((imagePath, imgIndex) => (
                                        <motion.div
                                          key={imgIndex}
                                          onClick={() => openLightbox(work.images, imgIndex)}
                                          className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                                          initial={{ opacity: 0, y: 40, scale: 0.92 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          transition={{ duration: 0.55, delay: 0.15 + imgIndex * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                          whileHover={{ scale: 1.03, y: -4 }}
                                          data-cursor="View"
                                        >
                                          <OptimizedImage
                                            src={imagePath}
                                            alt={`${work.company} - ${imgIndex + 1}`}
                                            className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                                          />
                                        </motion.div>
                                      ))}
                                    </div>
                                    <motion.div
                                      onClick={() => openLightbox(work.images, 3)}
                                      className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                                      initial={{ opacity: 0, y: 40, scale: 0.92 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                      whileHover={{ scale: 1.02, y: -4 }}
                                      data-cursor="View"
                                    >
                                      <OptimizedImage
                                        src={work.images[3]}
                                        alt={`${work.company} - 4`}
                                        className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                                      />
                                    </motion.div>
                                  </div>
                                ) : (
                                  <div className={`grid gap-3 ${work.images.length === 1 ? 'grid-cols-1' : work.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                                    {work.images.map((imagePath, imgIndex) => (
                                      <motion.div
                                        key={imgIndex}
                                        onClick={() => openLightbox(work.images, imgIndex)}
                                        className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                                        initial={{ opacity: 0, y: 40, scale: 0.92 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.55, delay: 0.15 + imgIndex * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                        whileHover={{ scale: 1.03, y: -4 }}
                                        data-cursor="View"
                                      >
                                        <OptimizedImage
                                          src={imagePath}
                                          alt={`${work.company} - ${imgIndex + 1}`}
                                          className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                                        />
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </div>
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
