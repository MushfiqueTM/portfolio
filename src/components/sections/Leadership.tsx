import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { InstagramBadge } from '@/components/ui/Instagram';
import { MetaRow } from '@/components/ui/MetaRow';
import { OrgCardBody } from '@/components/OrgCardBody';
import type { OrgItem } from '@/components/OrgCardBody';
import { LightboxHost } from '@/components/LightboxHost';
import { useLightbox } from '@/hooks/useLightbox';
import { ScrollReveal } from '@/components/ScrollReveal';
import leadership from '@/data/leadership.json';

export const Leadership: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'PolyU ENGL English Debate Club': true,
  });
  const lightbox = useLightbox();

  const toggleItem = (org: string) => {
    setExpandedItems(prev => ({ ...prev, [org]: !prev[org] }));
  };

  return (
    <section id="leadership" className="section-container py-12 sm:py-16">
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
            <Users className="w-6 h-6 text-[#1A2B4A]" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Leadership & Campus Engagement</h2>
        </motion.div>

        {/* Accordion Cards */}
        <div className="space-y-3">
          {(leadership as OrgItem[]).map((item, index) => {
            const isExpanded = !!expandedItems[item.organization];

            return (
              <ScrollReveal key={item.organization} delay={index * 0.08}>
                <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#3B82F6]/30 bg-white shadow-md' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#3B82F6]/20'}`}>
                  {/* Clickable header */}
                  <motion.button
                    onClick={() => toggleItem(item.organization)}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
                    whileTap={{ scale: 0.995 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-semibold text-[#1A2B4A]">
                          {item.organization}
                        </h3>
                        {item.instagram && (
                          <InstagramBadge
                            href={item.instagram}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                      <p className="text-sm text-[#5F6B7A]">{item.role}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <MetaRow date={item.date} location={item.location} variant="stacked" />
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-[#8B95A5]" />
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Mobile meta */}
                  {!isExpanded && (
                    <MetaRow
                      date={item.date}
                      location={item.location}
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
                          <MetaRow date={item.date} location={item.location} variant="inline" className="mb-4" />

                          <OrgCardBody item={item} onImageOpen={lightbox.open} />
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

      <LightboxHost lightbox={lightbox} />
    </section>
  );
};
