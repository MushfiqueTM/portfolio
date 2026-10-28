import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Plate } from '@/components/ui/Plate';
import { InstagramBadge } from '@/components/ui/Instagram';
import { MetaRow } from '@/components/ui/MetaRow';
import { OrgCardBody } from '@/components/OrgCardBody';
import type { OrgItem } from '@/components/OrgCardBody';
import { LightboxHost } from '@/components/LightboxHost';
import { useLightbox } from '@/hooks/useLightbox';
import { ScrollReveal } from '@/components/ScrollReveal';

interface OrgSectionProps {
  /** Anchor id — must match the matching nav item id in FloatingNav. */
  id: string;
  title: string;
  icon: LucideIcon;
  orgs: OrgItem[];
  /** Short line under the heading, e.g. the Instagram hint. */
  note?: string;
  headerDelay?: number;
}

/**
 * A titled list of organizations with their highlights, reels, and images.
 *
 * Cards are always expanded — these sections hold two or three entries, so an accordion
 * would hide most of the page behind clicks for no scrolling benefit.
 */
export const OrgSection: React.FC<OrgSectionProps> = ({
  id,
  title,
  icon: Icon,
  orgs,
  note,
  headerDelay = 0,
}) => {
  const lightbox = useLightbox();

  if (orgs.length === 0) return null;

  return (
    <div id={id} className="mb-12 scroll-mt-24">
      <Plate className="p-6 sm:p-10">
        <motion.div
          className="flex items-center gap-3 mb-4"
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
              {String(orgs.length).padStart(2, '0')}
            </span>
          </span>
        </motion.div>

        {note && <p className="text-ink-soft mb-8">{note}</p>}

        <div className="space-y-3">
          {orgs.map((item, index) => (
            <ScrollReveal key={item.organization} delay={index * 0.08}>
              <div className="corner-ticks rounded-sm border border-rule bg-paper-raised shadow-plate overflow-hidden">
                <div className="p-4 sm:p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold text-ink">
                        {item.organization}
                      </h3>
                      {item.instagram && <InstagramBadge href={item.instagram} />}
                    </div>
                    <p className="text-sm text-ink-soft">{item.role}</p>
                  </div>

                  <MetaRow
                    date={item.date}
                    location={item.location}
                    variant="stacked"
                    className="flex-shrink-0"
                  />
                </div>

                <div className="px-5 pb-5 pt-0">
                  <MetaRow
                    date={item.date}
                    location={item.location}
                    variant="inline"
                    className="mb-3"
                  />
                  <OrgCardBody item={item} onImageOpen={lightbox.open} reveal />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Plate>

      <LightboxHost lightbox={lightbox} />
    </div>
  );
};
