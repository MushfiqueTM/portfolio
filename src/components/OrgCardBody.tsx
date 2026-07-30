import React from 'react';
import { ProjectImageGrid } from '@/components/ui/ProjectImageGrid';
import type { ImageLayout } from '@/components/ui/ProjectImageGrid';
import { ReelGrid } from '@/components/ui/ReelGrid';
import type { Reel } from '@/components/ui/ReelGrid';
import { HighlightList } from '@/components/ui/HighlightList';

/** One entry of src/data/leadership.json. */
export interface OrgItem {
  organization: string;
  role: string;
  date: string;
  location: string;
  highlights: string[];
  images?: string[];
  imageLayout?: ImageLayout;
  instagram?: string;
  reels?: Reel[];
}

interface OrgCardBodyProps {
  item: OrgItem;
  onImageOpen: (images: string[], index: number) => void;
  /** Animate the image tiles in on scroll — DesignView does, Leadership doesn't. */
  reveal?: boolean;
}

/**
 * Highlights, reels, and images for one organization — the part Leadership and
 * DesignView render identically. Each supplies its own card shell and meta rows,
 * which genuinely differ (Leadership is a collapsible accordion).
 */
export const OrgCardBody: React.FC<OrgCardBodyProps> = ({ item, onImageOpen, reveal = false }) => (
  <div className="border-t border-[#E2E8F0] pt-4 space-y-4">
    {/* Highlights */}
    <HighlightList items={item.highlights} />

    {/* Reels */}
    {item.reels && item.reels.length > 0 && <ReelGrid reels={item.reels} />}

    {/* Images */}
    {item.images && item.images.length > 0 && (
      <ProjectImageGrid
        images={item.images}
        alt={item.organization}
        layout={item.imageLayout}
        reveal={reveal}
        onImageClick={(i) => onImageOpen(item.images!, i)}
      />
    )}
  </div>
);
