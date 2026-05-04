import { useEffect } from 'react';
import workExperience from '@/data/workExperience.json';
import allProjects from '@/data/allProjects.json';
import leadership from '@/data/leadership.json';
import projects3D from '@/data/projects3D.json';

interface Team { images?: string[] }
interface WorkItem { images?: string[]; teams?: Team[] }
interface ProjectItem { images?: string[] }
interface LeadershipItem { images?: string[]; reels?: { thumbnail?: string }[] }
interface CADItem { images?: string[] }

const HERO_CARD_IMAGES = [
  '/projects/All%20Experience_card.jpeg',
  '/projects/CAD%20View_card.jpeg',
  '/projects/Graphic%20Design_card.jpeg',
  '/projects/my_picture_2.jpg',
];

function collectAllImages(): string[] {
  const work = (workExperience as WorkItem[]).flatMap((w) => [
    ...(w.images || []),
    ...((w.teams || []).flatMap((t) => t.images || [])),
  ]);
  const projects = (allProjects as ProjectItem[]).flatMap((p) => p.images || []);
  const lead = (leadership as LeadershipItem[]).flatMap((l) => [
    ...(l.images || []),
    ...((l.reels || []).map((r) => r.thumbnail).filter((s): s is string => Boolean(s))),
  ]);
  const cad = (projects3D as CADItem[]).flatMap((c) => c.images || []);

  return [...HERO_CARD_IMAGES, ...work, ...projects, ...lead, ...cad];
}

/**
 * Kick off background image fetch+decode for every project image at app start.
 *
 * Fires synchronously on mount (no requestIdleCallback) so that on production —
 * where each image is a real network request to the CDN — the downloads start as
 * early as possible, ideally before the user has time to open a section. Idle
 * callbacks were getting deferred behind hydration / Framer Motion / Lenis init
 * for 1–3s, leaving sections to "snap in" once the user clicked them.
 */
export function useImagePreloader() {
  useEffect(() => {
    const sources = Array.from(new Set(collectAllImages()));
    sources.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  }, []);
}
