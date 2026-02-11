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
    'CLP Power Hong Kong': '/projects/CLP_logo_2.png',
    'PolyU E Formula Racing Team': '/projects/Racing_logo.jpg',
    'Thai German Graduate School of Engineering (TGGS)': '/projects/TGGS_logo.png',
    'World Green Organization (WGO) – ESG Accelerator': '/projects/world_green_org_2.jpg',
  };
  return logos[company] || null;
};

export const WorkExperience: React.FC = () => {
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const toggleTeam = (teamName: string) => {
    setExpandedTeams(prev => ({ ...prev, [teamName]: !prev[teamName] }));
  };

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
      <ScrollReveal>
        <NeuCard className="p-6 sm:p-10">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
            >
              <Briefcase className="w-6 h-6 text-[#1A2B4A]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Work Experience</h2>
          </div>

          {/* Experience List */}
          <div className="space-y-8">
            {(workExperience as WorkItem[]).map((work, index) => (
              <ScrollReveal key={work.company} delay={index * 0.1}>
                <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E2E8F0]">
                  {/* Company Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {getCompanyLogo(work.company) && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white shadow-sm p-1 flex items-center justify-center">
                          <img
                            src={getCompanyLogo(work.company)!}
                            alt={`${work.company} Logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#1A2B4A]">
                        {work.company}
                      </h3>
                      <p className="text-[#5F6B7A]">{work.role}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-[#8B95A5]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {work.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {work.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="space-y-4">
                    {work.teams.map((team, teamIndex) => (
                      <div key={teamIndex} className="ml-0 sm:ml-16">
                        {team.name && (
                          <h4 className="font-medium text-[#1A2B4A] mb-2">{team.name}</h4>
                        )}
                        <ul className="space-y-2">
                          {team.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-[#5F6B7A] flex gap-2">
                              <span className="text-[#8B95A5] mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Team Images */}
                        {team.images && team.images.length > 0 && (
                          <div className="mt-4">
                            <motion.button
                              onClick={() => toggleTeam(team.name)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1A2B4A] rounded-lg shadow-md hover:shadow-lg transition-all"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.span
                                animate={{ rotate: expandedTeams[team.name] ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.span>
                              {expandedTeams[team.name] ? 'Hide Images' : 'Show Images'}
                            </motion.button>

                            <AnimatePresence>
                              {expandedTeams[team.name] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                  className="mt-4 overflow-hidden"
                                >
                                  <div className={`grid gap-4 ${team.images?.length === 1 ? 'grid-cols-1' : team.images?.length === 2 ? 'grid-cols-1 md:grid-cols-2' : team.images?.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                                    {team.images?.map((imagePath, imgIndex) => (
                                      <motion.div
                                        key={imgIndex}
                                        onClick={() => openLightbox(team.images!, imgIndex)}
                                        className={`relative rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${team.images?.length === 1 ? 'min-h-[300px]' : team.images?.length === 2 ? 'min-h-[250px]' : 'min-h-[100px]'}`}
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
                  </div>

                  {/* Company Images */}
                  {work.images.length > 0 && (
                    <div className="mt-4 ml-0 sm:ml-16">
                      <motion.button
                        onClick={() => toggleCompany(work.company)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1A2B4A] rounded-lg shadow-md hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.span
                          animate={{ rotate: expandedCompanies[work.company] ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                        {expandedCompanies[work.company] ? 'Hide Images' : 'Show Images'}
                      </motion.button>

                      <AnimatePresence>
                        {expandedCompanies[work.company] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            className="mt-4 overflow-hidden"
                          >
                            {work.company === "Thai German Graduate School of Engineering (TGGS)" ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                  {work.images.slice(0, 3).map((imagePath, imgIndex) => (
                                    <div key={imgIndex} onClick={() => openLightbox(work.images, imgIndex)} className="relative min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                      <OptimizedImage
                                        src={imagePath}
                                        alt={`${work.company} - Image ${imgIndex + 1}`}
                                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                  ))}
                                </div>
                                {work.images[3] && (
                                  <div onClick={() => openLightbox(work.images, 3)} className="relative min-h-[300px] sm:min-h-[450px] rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
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
                                    onClick={() => openLightbox(work.images, imgIndex)}
                                    className={`relative rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${work.images.length === 1 ? 'min-h-[400px]' : work.images.length === 2 ? 'min-h-[350px]' : work.images.length === 3 ? 'min-h-[200px]' : 'min-h-[200px]'}`}
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
