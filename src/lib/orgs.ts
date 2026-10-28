import leadershipData from '@/data/leadership.json';
import type { OrgItem, OrgCategory } from '@/components/OrgCardBody';

/**
 * Organizations from src/data/leadership.json. Kept separate from projects.ts because
 * the shape genuinely differs — orgs carry a role, an Instagram handle, and reels.
 */
export const allOrgs = leadershipData as OrgItem[];

export function orgsByCategory(category: OrgCategory): OrgItem[] {
  return allOrgs.filter((o) => o.categories.includes(category));
}

/** Graphic design orgs only — the real count for the hero's design card. */
export function designOrgCount(): number {
  return orgsByCategory('design').length;
}

/** First N images across design orgs, for the hero card preview collage. */
export function designPreviewImages(limit: number): string[] {
  const seen: string[] = [];
  for (const org of orgsByCategory('design')) {
    for (const image of org.images ?? []) {
      if (!seen.includes(image)) seen.push(image);
      if (seen.length === limit) return seen;
    }
  }
  return seen;
}
