import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { InstagramBadge } from '@/components/ui/Instagram';
import { MetaRow } from '@/components/ui/MetaRow';
import { OrgCardBody } from '@/components/OrgCardBody';
import type { OrgItem } from '@/components/OrgCardBody';
import { LightboxHost } from '@/components/LightboxHost';
import { useLightbox } from '@/hooks/useLightbox';
import { ScrollReveal } from '@/components/ScrollReveal';
import leadership from '@/data/leadership.json';

export const DesignView: React.FC = () => {
  const lightbox = useLightbox();

  return (
    <section id="design" className="section-container py-12 sm:py-16">
      <NeuCard className="p-6 sm:p-10">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
          >
            <Palette className="w-6 h-6 text-[#1A2B4A]" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Graphic Designs</h2>
        </motion.div>

        <p className="text-[#5F6B7A] mb-8">
          Click the Instagram badge beside any name to explore more content on the page.
        </p>

        {/* Design Cards — always expanded */}
        <div className="space-y-3">
          {(leadership as OrgItem[]).map((item, index) => (
            <ScrollReveal key={item.organization} delay={index * 0.08}>
              <div className="rounded-xl border border-[#3B82F6]/30 bg-white shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold text-[#1A2B4A]">
                        {item.organization}
                      </h3>
                      {item.instagram && <InstagramBadge href={item.instagram} />}
                    </div>
                    <p className="text-sm text-[#5F6B7A]">{item.role}</p>
                  </div>

                  <MetaRow
                    date={item.date}
                    location={item.location}
                    variant="stacked"
                    className="flex-shrink-0"
                  />
                </div>

                {/* Content — always visible */}
                <div className="px-5 pb-5 pt-0">
                  {/* Mobile meta */}
                  <MetaRow date={item.date} location={item.location} variant="inline" className="mb-3" />

                  <OrgCardBody item={item} onImageOpen={lightbox.open} reveal />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </NeuCard>

      <LightboxHost lightbox={lightbox} />
    </section>
  );
};
