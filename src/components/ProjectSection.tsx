import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, ImageIcon, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Plate } from '@/components/ui/Plate';
import { ProjectImageGrid } from '@/components/ui/ProjectImageGrid';
import { HighlightList } from '@/components/ui/HighlightList';
import { LightboxHost } from '@/components/LightboxHost';
import { useLightbox } from '@/hooks/useLightbox';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { Project } from '@/lib/projects';

interface ProjectSectionProps {
  /** Anchor id — must match the matching nav item id in FloatingNav. */
  id: string;
  title: string;
  icon: LucideIcon;
  projects: Project[];
  /** Expanded on mount. Defaults to the first project in the list. */
  defaultOpenSlug?: string;
  /** Stagger the section header in, for sections below the first on a page. */
  headerDelay?: number;
}

/**
 * A titled, collapsible list of projects — the body of every category page.
 *
 * Cards are an accordion rather than always expanded: a collapsed card never mounts
 * its ProjectImageGrid, so a ten-project page issues no image requests until the
 * reader actually opens something.
 */
export const ProjectSection: React.FC<ProjectSectionProps> = ({
  id,
  title,
  icon: Icon,
  projects,
  defaultOpenSlug,
  headerDelay = 0,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const openSlug = defaultOpenSlug ?? projects[0]?.slug;
    return openSlug ? { [openSlug]: true } : {};
  });
  const lightbox = useLightbox();

  if (projects.length === 0) return null;

  const toggle = (slug: string) => setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));

  return (
    <div id={id} className="mb-12 scroll-mt-24">
      <Plate className="p-6 sm:p-10">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: headerDelay, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-sm bg-paper border border-rule shadow-well flex items-center justify-center"
          >
            <Icon className="w-6 h-6 text-ink" />
          </motion.div>
          <h2 className="font-mono text-xl sm:text-2xl font-semibold uppercase tracking-[0.04em] text-ink">
            {title}
          </h2>
          <span className="ml-auto flex items-baseline gap-1.5">
            <span className="field-label">Qty</span>
            <span className="font-mono text-sm text-amber tabular-nums">
              {String(projects.length).padStart(2, '0')}
            </span>
          </span>
        </motion.div>

        <div className="space-y-3">
          {projects.map((project, index) => {
            const isExpanded = !!expanded[project.slug];
            const hasImages = !!project.images && project.images.length > 0;

            return (
              <ScrollReveal key={project.slug} delay={index * 0.08}>
                <div
                  className={`corner-ticks rounded-sm border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? 'border-cyan/30 bg-paper-raised shadow-plate'
                      : 'border-rule bg-paper-raised hover:border-cyan/20'
                  }`}
                >
                  <motion.button
                    onClick={() => toggle(project.slug)}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
                    whileTap={{ scale: 0.995 }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-ink">
                        <span className="font-mono text-xs text-ink-muted mr-2 tabular-nums">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-ink-soft mt-0.5">{project.description}</p>
                      )}
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {project.date}
                        </span>
                        {project.org && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {project.org}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {hasImages && (
                        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-sm bg-paper-inset text-xs text-ink-muted">
                          <ImageIcon className="w-3 h-3" />
                          {project.images!.length}
                        </div>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-ink-muted" />
                      </motion.div>
                    </div>
                  </motion.button>

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
                          <div className="border-t border-rule pt-4 space-y-4">
                            <HighlightList items={project.highlights} />

                            {hasImages && (
                              <ProjectImageGrid
                                images={project.images!}
                                alt={project.title}
                                layout={project.imageLayout}
                                sizing="natural"
                                withSkeleton
                                onImageClick={(i) => lightbox.open(project.images!, i)}
                              />
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
    </div>
  );
};
