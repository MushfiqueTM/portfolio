import React from 'react';

/** Bulleted highlights, as used by every experience, project, and leadership card. */
export const HighlightList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((highlight, i) => (
      <li key={i} className="text-sm text-ink-soft flex gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ink mt-2 flex-shrink-0" />
        <span>{highlight}</span>
      </li>
    ))}
  </ul>
);
