import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
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
      <ScrollReveal>
        <NeuCard className="p-6 sm:p-10">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
            >
              <Users className="w-6 h-6 text-[#1A2B4A]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Leadership & Campus Engagement</h2>
          </div>

          {/* Leadership List */}
          <div className="space-y-8">
            {(leadership as LeadershipItem[]).map((item, index) => (
              <ScrollReveal key={item.organization} delay={index * 0.1}>
                <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E2E8F0]">
                  {/* Organization Header */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#1A2B4A]">
                        {item.organization}
                      </h3>
                      {instagramLinks[item.organization] && (
                        <a
                          href={instagramLinks[item.organization]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8B95A5] hover:text-[#1A2B4A] transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-[#5F6B7A]">{item.role}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-[#8B95A5]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-4">
                    {item.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-[#5F6B7A] flex gap-2">
                        <span className="text-[#8B95A5] mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Images */}
                  {item.images && item.images.length > 0 && (
                    <div className="mb-4">
                      <motion.button
                        onClick={() => toggleItem(item.organization)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1A2B4A] rounded-lg shadow-md hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.span
                          animate={{ rotate: expandedItems[item.organization] ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                        {expandedItems[item.organization] ? 'Hide Images' : 'Show Images'}
                      </motion.button>

                      <AnimatePresence>
                        {expandedItems[item.organization] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className={`grid gap-4 ${item.images?.length === 1 ? 'grid-cols-1' : item.images?.length === 2 ? 'grid-cols-1 md:grid-cols-2' : item.images?.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                              {item.images?.map((imagePath, imgIndex) => (
                                <motion.div
                                  key={imgIndex}
                                  onClick={() => openLightbox(item.images!, imgIndex)}
                                  className={`relative rounded-lg overflow-hidden bg-[#F2F4F6] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${item.images?.length === 1 ? 'min-h-[300px]' : item.images?.length === 2 ? 'min-h-[250px]' : 'min-h-[200px]'}`}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                  whileHover={{ scale: 1.05, y: -5 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <OptimizedImage
                                    src={imagePath}
                                    alt={`${item.organization} - Image ${imgIndex + 1}`}
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
                            className="group flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1A2B4A]/20 transition-all"
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
                            <ExternalLink className="w-4 h-4 text-[#8B95A5] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.a>
                        ))}
                      </div>
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
