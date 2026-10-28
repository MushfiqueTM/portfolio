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
  /**
   * Which section of the design page this belongs under. Not every org here is
   * graphic design work — the Halls of Residence role is event organizing.
   */
  categories: OrgCategory[];
  images?: string[];
  imageLayout?: ImageLayout;
  instagram?: string;
  reels?: Reel[];
}

export type OrgCategory = 'design' | 'leadership';

interface OrgCardBodyProps {
  item: OrgItem;
  onImageOpen: (images: string[], index: number) => void;
  /** Animate the image tiles in on scroll and lift them on hover. */
  reveal?: boolean;
}

/**
 * Highlights, reels, and images for one organization. Kept separate from the card
 * shell and meta rows so a caller can wrap this body in its own layout — an
 * accordion, say — without duplicating the content markup.
 */
export const OrgCardBody: React.FC<OrgCardBodyProps> = ({ item, onImageOpen, reveal = false }) => (
  <div className="border-t border-rule pt-4 space-y-4">
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
