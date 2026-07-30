import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface MetaRowProps {
  date: string;
  location: string;
  /**
   * 'stacked' is the right-aligned column shown from `sm` up in card headers.
   * 'inline' is the single row shown below `sm`, where the header is too narrow.
   * Each variant carries its own responsive gating, so the two are meant to be
   * rendered as a pair.
   */
  variant: 'stacked' | 'inline';
  /** Per-site spacing (`mb-4`, `px-5 pb-3 -mt-1`, `flex-shrink-0`, …). */
  className?: string;
}

/** The date + location pair repeated in every experience, leadership, and design card. */
export const MetaRow: React.FC<MetaRowProps> = ({ date, location, variant, className }) => {
  const stacked = variant === 'stacked';
  const base = stacked
    ? 'hidden sm:flex flex-col items-end gap-1'
    : 'sm:hidden flex items-center gap-3 text-xs text-[#8B95A5]';
  const item = stacked ? 'flex items-center gap-1 text-xs text-[#8B95A5]' : 'flex items-center gap-1';

  return (
    <div className={className ? `${base} ${className}` : base}>
      <span className={item}>
        <Calendar className="w-3 h-3" />
        {date}
      </span>
      <span className={item}>
        <MapPin className="w-3 h-3" />
        {location}
      </span>
    </div>
  );
};
