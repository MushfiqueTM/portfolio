import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  /** Drawing number, e.g. "MD-001". Shown in the titleblock's first field. */
  dwg: string;
  /** Discipline name, set in the TITLE field. */
  discipline: string;
  /** The page's h1. */
  title: string;
  description: string;
  /** Position in the drawing set, e.g. [2, 5] renders "2 OF 5". */
  sheet: [number, number];
  /** Item count for this page, with its unit. */
  count?: number;
  countLabel?: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const Field: React.FC<{
  label: string;
  value: string;
  className?: string;
  delay: number;
  /** Amber — reserved for the one key figure, so the accent stays rare. */
  accent?: boolean;
}> = ({ label, value, className = '', delay, accent = false }) => (
  <motion.div
    className={`titleblock-cell ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, delay, ease: EASE }}
  >
    <div className="field-label">{label}</div>
    <div className={`field-value mt-1 truncate${accent ? ' text-amber' : ''}`}>{value}</div>
  </motion.div>
);

/**
 * The titleblock at the top of each category page — a drawing's title block, with the
 * page's real metadata in the fields.
 *
 * Also carries each route's only `<h1>`. Before the site was split into pages there was
 * one h1 for the whole site, so four of five routes had no top-level heading.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  dwg,
  discipline,
  title,
  description,
  sheet,
  count,
  countLabel,
}) => (
  <header className="mb-12">
    <div className="titleblock overflow-hidden">
      {/* The rule draws itself, then the fields fade in. One orchestrated moment per route. */}
      <motion.div
        className="draw-rule h-px origin-left bg-cyan"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, ease: EASE }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-ink/15">
        <Field label="Dwg No." value={dwg} delay={0.3} />
        <Field label="Title" value={discipline} delay={0.36} className="sm:col-span-2" />
        <Field
          label={countLabel ?? 'Sheet'}
          value={count !== undefined ? String(count).padStart(2, '0') : `${sheet[0]} of ${sheet[1]}`}
          delay={0.42}
          accent
        />
      </div>

      <div className="border-t border-ink/15 px-3 py-4 sm:px-4 sm:py-5">
        <motion.h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.46, ease: EASE }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mt-2.5 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-ink-soft"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.54, ease: EASE }}
        >
          {description}
        </motion.p>
        <motion.div
          className="mt-4 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.62 }}
        >
          <span className="field-label">Sheet {sheet[0]} of {sheet[1]}</span>
          <div className="dimension-line flex-1" />
        </motion.div>
      </div>
    </div>
  </header>
);
