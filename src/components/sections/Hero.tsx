import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Mail, Phone, Linkedin, Download, MapPin, Layers, Box, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import allProjects from '@/data/allProjects.json';
import projects3D from '@/data/projects3D.json';
import workExperience from '@/data/workExperience.json';
import leadership from '@/data/leadership.json';

type ViewType = 'all' | 'cad' | 'design';

interface HeroProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const allCount = workExperience.length + allProjects.length + leadership.length;
const cadCount = projects3D.length;
const designCount = leadership.length;

const cards: {
  id: ViewType;
  label: string;
  desc: string;
  count: string;
  Icon: LucideIcon;
}[] = [
  {
    id: 'all',
    label: 'All Experiences',
    desc: 'CAD, robotics, software, and design. The full mix.',
    count: `${allCount} entries`,
    Icon: Layers,
  },
  {
    id: 'cad',
    label: 'Computer Aided Designs',
    desc: 'Mechanical design and analysis using SolidWorks, AutoCAD, and FEA tools.',
    count: `${cadCount} projects`,
    Icon: Box,
  },
  {
    id: 'design',
    label: 'Graphic Designs',
    desc: 'Posters, social content, and visual experiments.',
    count: `${designCount} projects`,
    Icon: Palette,
  },
];

/* Faint drafting grid laid over the selected card, echoing the page background. */
const BLUEPRINT_HATCH = {
  backgroundImage:
    'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

export const Hero: React.FC<HeroProps> = ({ activeView, onViewChange }) => {
  const handleCardClick = (view: ViewType) => {
    onViewChange(view);
  };

  return (
    <section id="hero" className="section-container py-12 sm:py-16">
      <NeuCard className="p-6 sm:p-10 lg:p-12">
      {/* Hero text + portrait + actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 lg:gap-12"
      >
        {/* Portrait — large, beside the name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0"
        >
          <motion.div
            whileHover={{ scale: 1.04, rotate: 1.5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-[8px_8px_16px_rgba(163,177,198,0.55),-8px_-8px_16px_rgba(255,255,255,0.95)] ring-4 ring-[#1A2B4A]"
          >
            <img
              src="/projects/my_picture_2.webp"
              alt="Mushfique Tanzim Muztaba"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2B4A] tracking-tight leading-[1.08]">
            <AnimatedText text="Hey! I am" delay={0.15} />
            {' '}
            <AnimatedText text="Mushfique Tanzim Muztaba" delay={0.25} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="mt-4 text-sm sm:text-[15px] text-[#5F6B7A] leading-[1.65] max-w-[760px] mx-auto sm:mx-0"
          >
            I'm a Mechanical Engineering student at PolyU with experience spanning CAD design and FEA, ROS2 robotics,
            AI and computer vision, and enterprise software development. I've interned at CLP Power Hong Kong where I built workflow tools used by 100+ members,
            designed crash-test equipment at a research lab in Bangkok, and worked on quadruped robot software at MangDang Technology.
            I'm comfortable working across hardware and software, whether that's tuning a PID controller,
            training an object detection model, or shipping a Power Apps solution for a live infrastructure project.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5 }}
            className="mt-3 text-sm text-[#5F6B7A] font-medium"
          >
            Open to graduate opportunities in engineering and technology.
          </motion.p>

          {/* Action row — primary CV + icon contact buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.6 }}
            className="mt-6 flex items-center justify-center sm:justify-start gap-2.5 flex-wrap"
          >
            <a
              href="/projects/MUSHFIQUE TANZIM MUZTABA_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="View"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1A2B4A] text-white text-sm font-semibold shadow-[4px_4px_12px_rgba(26,43,74,0.3),-2px_-2px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_16px_rgba(26,43,74,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Download className="w-4 h-4" />
              Download CV
            </a>

            <IconButton
              href="https://www.linkedin.com/in/mushfique-tanzim-muztaba-331228242/"
              label="LinkedIn"
              icon={<Linkedin className="w-[18px] h-[18px]" />}
            />
            <IconButton
              href="mailto:mushfiquetm@gmail.com"
              label="Email"
              icon={<Mail className="w-[18px] h-[18px]" />}
            />
            <IconButton
              href="tel:+85256014576"
              label="Phone"
              icon={<Phone className="w-[18px] h-[18px]" />}
            />

            <span className="hidden sm:inline-flex items-center text-xs text-[#8B95A5] ml-1">
              or pick a portfolio slice ↓
            </span>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.7 }}
            className="mt-4 flex items-center gap-1.5 justify-center sm:justify-start text-[#8B95A5]"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">Hong Kong</span>
          </motion.div>
        </div>
      </motion.div>
      </NeuCard>

      {/* Visual category cards — outside the hero card, sit on the page background */}
      <motion.div
        id="view-cards"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-24 sm:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 scroll-mt-24"
      >
        <LayoutGroup id="hero-view-cards">
          {cards.map((c, i) => {
            const isActive = activeView === c.id;
            return (
              <motion.button
                key={c.id}
                onClick={() => handleCardClick(c.id)}
                data-cursor="View"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: isActive ? -4 : 0,
                  backgroundColor: isActive ? '#1A2B4A' : '#FFFFFF',
                }}
                transition={{
                  opacity: { duration: 0.4, delay: 0.6 + i * 0.06, ease: [0.16, 1, 0.3, 1] },
                  y: { type: 'spring', stiffness: 300, damping: 28 },
                  backgroundColor: { duration: 0.35 },
                }}
                whileHover={{ y: isActive ? -6 : -3 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={isActive}
                className={`group relative flex h-full flex-col items-start rounded-[20px] overflow-hidden p-6 text-left transition-shadow duration-300 ${
                  isActive
                    ? 'shadow-[0_0_0_3px_#1A2B4A,0_0_24px_rgba(26,43,74,0.25),14px_14px_32px_rgba(26,43,74,0.45)]'
                    : 'shadow-[8px_8px_18px_rgba(163,177,198,0.55),-6px_-6px_14px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(26,43,74,0.06)]'
                }`}
              >
                {isActive && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={BLUEPRINT_HATCH} />
                )}

                {/* Icon well + index — the well matches every section header on the page */}
                <div className="relative flex w-full items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:-translate-y-0.5 ${
                      isActive
                        ? 'bg-white/10 text-white ring-1 ring-white/15'
                        : 'bg-[#F2F4F6] text-[#1A2B4A] shadow-[4px_4px_10px_rgba(163,177,198,0.55),-3px_-3px_8px_rgba(255,255,255,1)]'
                    }`}
                  >
                    <c.Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
                  </div>

                  {isActive ? (
                    <motion.div
                      layoutId="card-active-check"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1A2B4A] shadow-md"
                      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <span className="font-mono text-[11px] tabular-nums text-[#B4BDC9]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Label + count */}
                <div className="relative mt-5 w-full">
                  <div className={`text-[17px] font-bold leading-tight tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#1A2B4A]'}`}>
                    {c.label}
                  </div>
                  <div className={`mt-1.5 font-mono text-[11px] tabular-nums transition-colors duration-300 ${isActive ? 'text-white/55' : 'text-[#8B95A5]'}`}>
                    {c.count}
                  </div>
                </div>

                {/* Hairline with an accent segment that extends on hover */}
                <div className="relative mt-4 h-px w-full">
                  <span className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-white/15' : 'bg-[#1A2B4A]/8'}`} />
                  <span
                    className={`absolute left-0 top-0 h-px w-8 transition-all duration-500 ease-out group-hover:w-20 ${
                      isActive ? 'bg-white/70' : 'bg-[#3B82F6]'
                    }`}
                  />
                </div>

                <p className={`relative mt-4 text-[13px] leading-[1.55] transition-colors duration-300 ${isActive ? 'text-white/75' : 'text-[#5F6B7A]'}`}>
                  {c.desc}
                </p>
              </motion.button>
            );
          })}
        </LayoutGroup>
      </motion.div>
    </section>
  );
};

const IconButton: React.FC<{ href: string; label: string; icon: React.ReactNode }> = ({ href, label, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    data-cursor={label}
    className="w-[42px] h-[42px] rounded-xl bg-[#F2F4F6] text-[#1A2B4A] flex items-center justify-center shadow-[6px_6px_14px_rgba(163,177,198,0.7),-4px_-4px_10px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(26,43,74,0.04)] hover:-translate-y-0.5 hover:text-[#3B82F6] hover:shadow-[8px_8px_18px_rgba(163,177,198,0.75),-4px_-4px_10px_rgba(255,255,255,1)] active:translate-y-0 transition-all"
  >
    {icon}
  </a>
);
