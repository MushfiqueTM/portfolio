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

const CONCURRENCY = 4;

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

  // Hero card images first so they win the queue when the preloader starts.
  return [...HERO_CARD_IMAGES, ...work, ...projects, ...lead, ...cad];
}

/**
 * Background fetch+decode of every project image, with bounded concurrency.
 *
 * Firing all ~75 `new Image()` requests at once on mobile saturates the connection
 * and starves the section images that the user is actively scrolling toward. We
 * keep the eager start (no idle-callback deferral, which previously got stuck
 * 1–3s behind hydration), but hold the in-flight count to CONCURRENCY so visible
 * content has bandwidth headroom.
 */
export function useImagePreloader() {
  useEffect(() => {
    const sources = Array.from(new Set(collectAllImages()));
    let cursor = 0;

    const next = () => {
      if (cursor >= sources.length) return;
      const src = sources[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.onload = next;
      img.onerror = next;
      img.src = src;
    };

    for (let i = 0; i < CONCURRENCY; i++) next();
  }, []);
}
