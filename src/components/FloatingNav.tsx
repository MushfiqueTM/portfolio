import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
}

interface PageLink {
  path: string;
  label: string;
  shortLabel: string;
}

const PAGES: PageLink[] = [
  { path: '/', label: 'Home', shortLabel: 'Home' },
  { path: '/mechanical', label: 'Mechanical', shortLabel: 'Mech' },
  { path: '/robotics', label: 'Robotics & AI', shortLabel: 'Robo' },
  { path: '/design', label: 'Design', shortLabel: 'Design' },
  { path: '/about', label: 'About', shortLabel: 'About' },
];

/**
 * In-page section links per route. Module scope on purpose: the scroll handler reads
 * this, and a function declared in the component body would be captured stale by the
 * effect that registers the handler.
 *
 * Ids must match the anchor ids the page components render.
 */
const SECTIONS_BY_PATH: Record<string, NavItem[]> = {
  '/': [
    { id: 'hero', label: 'Top', shortLabel: 'Top' },
    { id: 'experience', label: 'Experience', shortLabel: 'Work' },
  ],
  '/mechanical': [
    { id: 'solidworks', label: 'SOLIDWORKS', shortLabel: 'SW' },
    { id: 'autocad', label: 'AutoCAD', shortLabel: 'CAD' },
    { id: 'concept', label: 'Concept', shortLabel: 'Concept' },
  ],
  '/robotics': [
    { id: 'robotics', label: 'Robotics', shortLabel: 'Robo' },
    { id: 'ai', label: 'AI & Vision', shortLabel: 'AI' },
    { id: 'software', label: 'Software', shortLabel: 'Code' },
  ],
  '/design': [
    { id: 'design', label: 'Graphic Design', shortLabel: 'Design' },
    { id: 'leadership', label: 'Leadership', shortLabel: 'Lead' },
  ],
  '/about': [
    { id: 'skills', label: 'Skills', shortLabel: 'Skills' },
    { id: 'certifications', label: 'Certs', shortLabel: 'Certs' },
  ],
};

/** Matches the fixed nav height, so anchored sections land below it rather than under it. */
const NAV_OFFSET = -96;

export const FloatingNav: React.FC = () => {
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const sections = SECTIONS_BY_PATH[pathname] ?? [];
  // Resolved once per route instead of on every scroll event, which is what the old
  // handler did — it called getElementById for each nav item on every tick.
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const items = SECTIONS_BY_PATH[pathname] ?? [];

    const handleScroll = () => {
      const elements = elementsRef.current;
      if (elements.length === 0) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(items[i].id);
          return;
        }
      }
      setActiveSection(items[0].id);
    };

    // Sections mount with the route, so wait a frame before resolving them — then seed
    // the pill from actual scroll position rather than assuming the first section.
    const frame = requestAnimationFrame(() => {
      elementsRef.current = items.map((item) => document.getElementById(item.id));
      handleScroll();
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(element, { offset: NAV_OFFSET });
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">
      <nav className="floating-nav px-2 sm:px-3 py-1.5 flex flex-wrap sm:flex-nowrap justify-center items-center gap-y-1.5 gap-x-1 sm:gap-x-2 max-w-[95vw] sm:max-w-[92vw]">
        {/* Page links — real anchors, so they are crawlable and middle-clickable */}
        <LayoutGroup id="page-nav">
          <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-paper flex-shrink-0">
            {PAGES.map((page) => (
              <NavLink
                key={page.path}
                to={page.path}
                end={page.path === '/'}
                className="relative px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold rounded-full whitespace-nowrap transition-colors duration-200"
                style={({ isActive }) => ({ color: isActive ? 'hsl(var(--paper))' : 'hsl(var(--ink-soft))' })}
                data-cursor="Go"
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="page-pill"
                        className="absolute inset-0 bg-ink rounded-full shadow-well"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      {isMobile ? page.shortLabel : page.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </LayoutGroup>

        {sections.length > 1 && (
          <>
            {/* Divider — hidden on mobile where the section links wrap to their own row */}
            <div className="hidden sm:block w-px h-6 bg-ink/12 flex-shrink-0" />

            <LayoutGroup id="section-nav">
              <div className="flex flex-wrap justify-center items-center gap-y-1 gap-x-0.5 sm:gap-x-1">
                {sections.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="relative px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 transition-colors duration-200"
                    style={{ color: activeSection === item.id ? 'hsl(var(--paper))' : 'hsl(var(--ink-soft))' }}
                  >
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-ink rounded-full shadow-well"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      {isMobile && item.shortLabel ? item.shortLabel : item.label}
                    </span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </>
        )}
      </nav>
    </div>
  );
};
