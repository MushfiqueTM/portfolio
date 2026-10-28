import projectsData from '@/data/projects.json';
import type { ImageLayout } from '@/components/ui/ProjectImageGrid';

/**
 * Single source of truth for project content.
 *
 * `allProjects.json` and `projects3D.json` used to hold overlapping copies of the
 * same projects under different titles, with no shared id to join on. They are now
 * one file keyed by `slug`, and a project that spans disciplines carries several
 * `categories` so it can appear on more than one page without being duplicated.
 */
export type Category = 'mechanical' | 'robotics' | 'ai' | 'software';

export interface Project {
  slug: string;
  title: string;
  date: string;
  categories: Category[];
  highlights: string[];
  /** Employer or school the work was done for. Absent for personal projects. */
  org?: string;
  description?: string;
  /** CAD tool, used to group the mechanical page into its SOLIDWORKS / AutoCAD sections. */
  tools?: string[];
  images?: string[];
  imageLayout?: ImageLayout;
}

export const allProjects = projectsData as Project[];

/** Projects in any of the given categories, in source order (newest first). */
export function byCategory(...categories: Category[]): Project[] {
  return allProjects.filter((p) => categories.some((c) => p.categories.includes(c)));
}

export function byTool(tool: string): Project[] {
  return allProjects.filter((p) => p.tools?.includes(tool));
}

/**
 * Mechanical projects with no CAD tool tagged — concept and product design work that
 * would otherwise be dropped by the tool-based sections on the mechanical page.
 * Computed rather than hardcoded so it stays correct as projects gain tools.
 */
export function mechanicalWithoutTool(): Project[] {
  return allProjects.filter(
    (p) => p.categories.includes('mechanical') && (!p.tools || p.tools.length === 0)
  );
}

/**
 * Splits projects across sections so each appears exactly once on a page.
 *
 * A project can carry several categories on purpose — the humanoid arm is both
 * mechanical and robotics — which is what lets it surface on more than one *page*.
 * Within a single page that would double-list it, so each project is assigned to the
 * first section in `order` that it matches.
 *
 * Returns one entry per category in `order`, in that order, including empty ones so
 * the caller can decide what to render.
 */
export function partitionByCategory(order: Category[]): { category: Category; projects: Project[] }[] {
  const buckets = order.map((category) => ({ category, projects: [] as Project[] }));
  for (const project of allProjects) {
    const bucket = buckets.find((b) => project.categories.includes(b.category));
    if (bucket) bucket.projects.push(project);
  }
  return buckets;
}

/** Number of distinct projects across the given categories — used for the hero card counts. */
export function countFor(...categories: Category[]): number {
  return byCategory(...categories).length;
}

/** First N images across the given categories, for hero card preview collages. */
export function previewImages(categories: Category[], limit: number): string[] {
  const seen: string[] = [];
  for (const project of byCategory(...categories)) {
    for (const image of project.images ?? []) {
      if (!seen.includes(image)) seen.push(image);
      if (seen.length === limit) return seen;
    }
  }
  return seen;
}
