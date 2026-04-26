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
 * Avoids the animation-time hitch when a section first mounts.
 */
export function useImagePreloader() {
  useEffect(() => {
    const sources = Array.from(new Set(collectAllImages()));
    const start = () => {
      sources.forEach((src) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
      });
    };
    if ('requestIdleCallback' in window) {
      (window as Window & typeof globalThis).requestIdleCallback(start, { timeout: 1500 });
    } else {
      setTimeout(start, 0);
    }
  }, []);
}
