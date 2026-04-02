import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { ScrollReveal } from '@/components/ScrollReveal';

interface Certification {
  title: string;
  issuer: string;
  date: string;
  validUntil?: string;
  link: string;
}

const certifications: Certification[] = [
  {
    title: 'Construction Industry Safety Training Certificate (Hong Kong Green Card)',
    issuer: 'The Hong Kong Safety Training Association',
    date: '',
    validUntil: 'March 2028',
    link: '/projects/Green_card.pdf',
  },
  {
    title: 'Shipboard Cargo Handling Basic Safety Training Course (Hong Kong Blue Card)',
    issuer: 'Asia Venture Human Resources & Construction Limited',
    date: '',
    validUntil: 'January 2028',
    link: '/projects/Blue_card.pdf',
  },
  {
    title: 'SOLIDWORKS: Modeling Gears',
    issuer: 'LinkedIn Learning',
    date: 'July 27, 2023',
    link: '/projects/SOLIDWORKS%20Modeling%20Gears.pdf',
  },
  {
    title: 'SOLIDWORKS: Advanced Simulation',
    issuer: 'LinkedIn Learning',
    date: 'July 24, 2023',
    link: '/projects/SOLIDWORKS%20Advanced%20Simulation.pdf',
  },
  {
    title: 'SOLIDWORKS: Advanced Engineering Drawings',
    issuer: 'LinkedIn Learning',
    date: 'July 24, 2023',
    link: '/projects/SOLIDWORKS%20Advanced%20Engineering%20Drawings.pdf',
  },
  {
    title: 'Learning AutoCAD 2024',
    issuer: 'LinkedIn Learning',
    date: 'July 03, 2023',
    link: '/projects/learning_autocad.pdf',
  },
];

export const Certifications: React.FC = () => {
  return (
    <section id="certifications" className="section-container py-12 sm:py-16">
      <NeuCard className="p-6 sm:p-10">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
          >
            <Award className="w-6 h-6 text-[#1A2B4A]" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Certifications</h2>
        </motion.div>

        {/* 2-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <ScrollReveal key={cert.title} delay={index * 0.08}>
              <motion.a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all duration-300 h-full"
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                data-cursor="View"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#EEF1F5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#3B82F6]/10 transition-colors">
                  {cert.validUntil ? (
                    <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
                  ) : (
                    <Award className="w-5 h-5 text-[#3B82F6]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#1A2B4A] leading-snug mb-1 group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-[#8B95A5] mb-1.5">{cert.issuer}</p>
                  <div className="flex items-center gap-2 text-xs text-[#8B95A5]">
                    {cert.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {cert.date}
                      </span>
                    )}
                    {cert.validUntil && (
                      <span className="px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                        Valid until {cert.validUntil}
                      </span>
                    )}
                  </div>
                </div>

                {/* External link icon */}
                <ExternalLink className="w-4 h-4 text-[#8B95A5] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </motion.a>
            </ScrollReveal>
          ))}
        </div>
      </NeuCard>
    </section>
  );
};
