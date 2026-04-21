import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Lightbox } from '@/components/Lightbox';
import leadership from '@/data/leadership.json';

interface Reel {
  title: string;
  url: string;
}

interface LeadershipItem {
  organization: string;
  role: string;
  date: string;
  location: string;
  highlights: string[];
  images?: string[];
  reels?: Reel[];
}

const instagramLinks: Record<string, string> = {
  'PolyU ENGL English Debate Club': 'https://www.instagram.com/polyu.englishdebate?igsh=cDc4ZXhocWd1aG5t',
  'PolyU International Student Association': 'https://www.instagram.com/polyusao_isa?igsh=MTk5c3VvdmphbHRkag==',
  'PolyU Student Halls of Residence': 'https://www.instagram.com/polyu_yellow_hall?igsh=cmI4bW15YXJieDZh',
};

export const Leadership: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'PolyU ENGL English Debate Club': true,
  });
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const toggleItem = (org: string) => {
    setExpandedItems(prev => ({ ...prev, [org]: !prev[org] }));
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
          {(leadership as LeadershipItem[]).map((item, index) => {
            const isExpanded = !!expandedItems[item.organization];

            return (
              <ScrollReveal key={item.organization} delay={index * 0.08}>
                <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#3B82F6]/30 bg-white shadow-md' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#3B82F6]/20'}`}>
                  {/* Clickable header */}
                  <motion.button
                    onClick={() => toggleItem(item.organization)}
                    className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
                    whileTap={{ scale: 0.995 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-semibold text-[#1A2B4A]">
                          {item.organization}
                        </h3>
                        {instagramLinks[item.organization] && (
                          <a
                            href={instagramLinks[item.organization]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B95A5] hover:text-[#E1306C] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-[#5F6B7A]">{item.role}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="hidden sm:flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1 text-xs text-[#8B95A5]">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#8B95A5]">
                          <MapPin className="w-3 h-3" />
                          {item.location}
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

                  {/* Mobile meta */}
                  {!isExpanded && (
                    <div className="sm:hidden flex items-center gap-3 px-5 pb-3 -mt-1 text-xs text-[#8B95A5]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
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
                              {item.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </span>
                          </div>

                          <div className="border-t border-[#E2E8F0] pt-4 space-y-4">
                            {/* Highlights */}
                            <ul className="space-y-1.5">
                              {item.highlights.map((highlight, i) => (
                                <li key={i} className="text-sm text-[#5F6B7A] flex gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A2B4A] mt-2 flex-shrink-0" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Images */}
                            {item.images && item.images.length > 0 && (
                              <div className={`grid gap-3 ${item.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                {item.images.map((imagePath, imgIndex) => (
                                  <motion.div
                                    key={imgIndex}
                                    onClick={() => openLightbox(item.images!, imgIndex)}
                                    className="relative rounded-lg overflow-hidden bg-[#EEF1F5] cursor-pointer group/img"
                                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.55, delay: 0.15 + imgIndex * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ scale: 1.03, y: -4 }}
                                    data-cursor="View"
                                  >
                                    <img
                                      src={imagePath}
                                      alt={`${item.organization} - ${imgIndex + 1}`}
                                      className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-105"
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Reels */}
                            {item.reels && item.reels.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-[#5F6B7A] mb-3">Instagram Reels</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {item.reels.map((reel, reelIndex) => (
                                    <motion.a
                                      key={reelIndex}
                                      href={reel.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/reel flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all"
                                      whileHover={{ scale: 1.02, y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#1A2B4A] truncate">{reel.title}</p>
                                        <p className="text-xs text-[#8B95A5]">View on Instagram</p>
                                      </div>
                                      <ExternalLink className="w-4 h-4 text-[#8B95A5] opacity-0 group-hover/reel:opacity-100 transition-opacity" />
                                    </motion.a>
                                  ))}
                                </div>
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
