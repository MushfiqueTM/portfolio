import React, { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ChevronDown } from 'lucide-react';
import { Plate } from '@/components/ui/Plate';
import { MetaRow } from '@/components/ui/MetaRow';
import { HighlightList } from '@/components/ui/HighlightList';
import { LightboxHost } from '@/components/LightboxHost';
import { useLightbox } from '@/hooks/useLightbox';
import { ScrollReveal } from '@/components/ScrollReveal';
import workExperience from '@/data/workExperience.json';

const ImageCarousel = lazy(() =>
  import('@/components/ui/ImageCarousel').then((m) => ({ default: m.ImageCarousel }))
);

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
    'Alpha Vision Technology Limited': '/projects/AlphaVisionLogo.webp',
    'MangDang Technology Co., Limited': '/projects/MANGDANG TECHNOLOGY COLIMITEDCompany Logo.webp',
    'CLP Power Hong Kong': '/projects/CLP_logo_2.webp',
    'PolyU E Formula Racing Team': '/projects/Racing_logo.webp',
    'Thai German Graduate School of Engineering (TGGS)': '/projects/TGGS_logo.webp',
    'World Green Organization (WGO) – ESG Accelerator': '/projects/world_green_org_2.webp',
  };
  return logos[company] || null;
};

export const WorkExperience: React.FC = () => {
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({
    [(workExperience as WorkItem[])[0]?.company]: true,
  });
  const lightbox = useLightbox();

  const toggleCompany = (company: string) => {
    setExpandedCompanies(prev => ({ ...prev, [company]: !prev[company] }));
  };

  return (
    <section id="experience" className="section-container py-12 sm:py-16 scroll-mt-24">
      <Plate className="p-6 sm:p-10">
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
            className="w-12 h-12 rounded-sm bg-paper border border-rule shadow-well flex items-center justify-center"
          >
            <Briefcase className="w-6 h-6 text-ink" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">Work Experience</h2>
        </motion.div>

        {/* Accordion Cards */}
        <div className="space-y-3">
          {(workExperience as WorkItem[]).map((work, index) => {
            const isExpanded = !!expandedCompanies[work.company];
            return (
              <ScrollReveal key={work.company} delay={index * 0.08}>
                <div className={`rounded-sm border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-cyan/30 bg-paper-raised shadow-plate' : 'border-rule bg-paper-raised hover:border-cyan/20'}`}>
                  {/* Collapsed header — always visible */}
                  <motion.button
                    onClick={() => toggleCompany(work.company)}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
                    whileTap={{ scale: 0.995 }}
                  >
                    {/* Logo */}
                    {getCompanyLogo(work.company) ? (
                      <div className="w-11 h-11 rounded-sm bg-paper-raised shadow-plate p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={getCompanyLogo(work.company)!}
                          alt={work.company}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-sm bg-paper-inset flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-ink-muted" />
                      </div>
                    )}

                    {/* Summary info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-ink truncate">
                        {work.company}
                      </h3>
                      <p className="text-sm text-ink-soft truncate">{work.role}</p>
                    </div>

                    {/* Right side: date + badges + chevron */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <MetaRow date={work.date} location={work.location} variant="stacked" />
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-ink-muted" />
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Mobile meta — only shown in header on small screens */}
                  {!isExpanded && (
                    <MetaRow
                      date={work.date}
                      location={work.location}
                      variant="inline"
                      className="px-5 pb-3 -mt-1"
                    />
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
                          <MetaRow date={work.date} location={work.location} variant="inline" className="mb-4" />

                          <div className="border-t border-rule pt-4 space-y-5">
                            {/* Teams */}
                            {work.teams.map((team, teamIndex) => (
                              <div key={teamIndex}>
                                {team.name && (
                                  <h4 className="font-medium text-ink mb-2 text-sm">{team.name}</h4>
                                )}
                                <HighlightList items={team.highlights} />

                                {/* Team images */}
                                {team.images && team.images.length > 0 && (
                                  <div className="mt-3">
                                    <Suspense fallback={null}>
                                      <ImageCarousel
                                        images={team.images}
                                        alt={team.name || 'Team'}
                                        onImageClick={(i) => lightbox.open(team.images!, i)}
                                      />
                                    </Suspense>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Company-level images */}
                            {work.images.length > 0 && (
                              <Suspense fallback={null}>
                                <ImageCarousel
                                  images={work.images}
                                  alt={work.company}
                                  onImageClick={(i) => lightbox.open(work.images, i)}
                                />
                              </Suspense>
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
      </Plate>

      <LightboxHost lightbox={lightbox} />
    </section>
  );
};
