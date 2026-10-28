import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, Linkedin, Download, MapPin, Box, Bot, Palette, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Plate } from '@/components/ui/Plate';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { countFor, previewImages } from '@/lib/projects';
import { designOrgCount, designPreviewImages } from '@/lib/orgs';

/**
 * The site index. Counts and preview images are derived from the data rather than
 * hardcoded, so a new project shows up here without anyone remembering to bump a number.
 */
const cards: {
  path: string;
  label: string;
  desc: string;
  count: number;
  unit: string;
  previews: string[];
  Icon: LucideIcon;
}[] = [
  {
    path: '/mechanical',
    label: 'Mechanical Design',
    desc: 'Enclosures, assemblies, and crash-test rigs in SOLIDWORKS and AutoCAD, with FEA.',
    count: countFor('mechanical'),
    unit: 'projects',
    previews: previewImages(['mechanical'], 3),
    Icon: Box,
  },
  {
    path: '/robotics',
    label: 'Robotics & AI',
    desc: 'ROS 2 autonomy, SLAM and navigation, computer vision, and control systems.',
    count: countFor('robotics', 'ai', 'software'),
    unit: 'projects',
    previews: previewImages(['robotics', 'ai'], 3),
    Icon: Bot,
  },
  {
    path: '/design',
    label: 'Graphic Design',
    desc: 'Posters, logos, merchandise, and social video for student organizations.',
    count: designOrgCount(),
    unit: 'organizations',
    previews: designPreviewImages(3),
    Icon: Palette,
  },
];

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="section-container pt-24 sm:pt-28 pb-12 sm:pb-16 scroll-mt-24">
      <Plate className="p-6 sm:p-10 lg:p-12">
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
              className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-plate-lg ring-4 ring-ink"
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.08]">
              <AnimatedText text="Hey! I am" delay={0.15} />
              {' '}
              <AnimatedText text="Mushfique Tanzim Muztaba" delay={0.25} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="mt-4 text-sm sm:text-[15px] text-ink-soft leading-[1.65] max-w-[760px] mx-auto sm:mx-0"
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
              className="mt-3 text-sm text-ink-soft font-medium"
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-ink text-paper text-sm font-semibold shadow-ink hover:shadow-plate-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
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
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.7 }}
              className="mt-4 flex items-center gap-1.5 justify-center sm:justify-start text-ink-muted"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">Hong Kong</span>
            </motion.div>
          </div>
        </motion.div>
      </Plate>

      {/* Page index — one card per portfolio section, sitting on the page background */}
      <motion.nav
        aria-label="Portfolio sections"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-20 sm:mt-28"
      >
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted mb-5">
          Explore the work
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.985 }}
              className="h-full"
            >
              <Link
                to={c.path}
                data-cursor="View"
                className="corner-ticks group relative flex h-full flex-col items-start overflow-hidden rounded-sm border border-rule bg-paper-raised p-6 text-left shadow-plate transition-all duration-300 hover:shadow-plate-lg hover:border-cyan/40"
              >
                {/* Icon well + index */}
                <div className="relative flex w-full items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-paper text-ink border border-rule shadow-well transition-transform duration-300 group-hover:-translate-y-0.5">
                    <c.Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Label + count */}
                <div className="relative mt-5 w-full">
                  <div className="text-[17px] font-bold leading-tight tracking-tight text-ink">
                    {c.label}
                  </div>
                  <div className="mt-1.5 font-mono text-[11px] tabular-nums text-ink-muted">
                    {c.count} {c.unit}
                  </div>
                </div>

                {/* Hairline with an accent segment that extends on hover */}
                <div className="relative mt-4 h-px w-full">
                  <span className="absolute inset-0 bg-ink/8" />
                  <span className="absolute left-0 top-0 h-px w-8 bg-cyan transition-all duration-500 ease-out group-hover:w-20" />
                </div>

                <p className="relative mt-4 text-[13px] leading-[1.55] text-ink-soft">
                  {c.desc}
                </p>

                {/* Preview strip — a glance at what the page holds */}
                {c.previews.length > 0 && (
                  <div className="relative mt-5 grid w-full grid-cols-3 gap-2">
                    {c.previews.map((src) => (
                      <div
                        key={src}
                        className="relative aspect-[4/3] overflow-hidden rounded-sm bg-paper-inset"
                      >
                        <OptimizedImage
                          src={src}
                          alt=""
                          containerClassName="w-full h-full"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Affordance */}
                <div className="relative mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-cyan">
                  View work
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.nav>
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
    className="w-[42px] h-[42px] rounded-sm bg-paper text-ink flex items-center justify-center border border-rule shadow-plate hover:-translate-y-0.5 hover:text-cyan hover:shadow-plate-lg active:translate-y-0 transition-all"
  >
    {icon}
  </a>
);
