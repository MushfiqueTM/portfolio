import React from 'react';

/** Bulleted highlights, as used by every experience, project, and leadership card. */
export const HighlightList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((highlight, i) => (
      <li key={i} className="text-sm text-[#5F6B7A] flex gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1A2B4A] mt-2 flex-shrink-0" />
        <span>{highlight}</span>
      </li>
    ))}
  </ul>
);
