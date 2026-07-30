import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Instagram';

export interface Reel {
  title: string;
  url: string;
  thumbnail?: string;
}

/**
 * Grid of Instagram reel cards, each linking out to the post. Entries without a
 * thumbnail fall back to a gradient tile with the Instagram glyph.
 */
export const ReelGrid: React.FC<{ reels: Reel[] }> = ({ reels }) => {
  if (reels.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-[#5F6B7A] mb-3">Instagram Reels</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {reels.map((reel, reelIndex) => (
          <motion.a
            key={reelIndex}
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/reel block rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            data-cursor="View"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {reel.thumbnail ? (
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/reel:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
                  <InstagramIcon className="w-12 h-12 text-white/90" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/reel:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-[#1A2B4A] ml-0.5" fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-2 right-2 w-7 h-7 rounded-md bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center shadow-sm">
                <InstagramIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-xs sm:text-sm font-medium text-[#1A2B4A] line-clamp-2 leading-snug">{reel.title}</p>
              <p className="text-[10px] sm:text-xs text-[#8B95A5] mt-0.5">View on Instagram</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
