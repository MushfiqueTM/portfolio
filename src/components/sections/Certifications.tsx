import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { NeuButton } from '@/components/ui/NeuButton';
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

          {/* Certifications List */}
          <div className="space-y-6">
            {certifications.map((cert, index) => (
              <ScrollReveal key={cert.title} delay={index * 0.1}>
                <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E2E8F0] pb-6 last:pb-0">
                  <h3 className="text-base sm:text-lg font-semibold text-[#1A2B4A] mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-[#5F6B7A] mb-1">
                    Issued by {cert.issuer}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#8B95A5] mb-3">
                    {cert.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Completed {cert.date}
                      </span>
                    )}
                    {cert.validUntil && (
                      <span>Valid until {cert.validUntil}</span>
                    )}
                  </div>
                  <NeuButton
                    variant="secondary"
                    size="sm"
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Certificate
                  </NeuButton>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </NeuCard>
    </section>
  );
};
