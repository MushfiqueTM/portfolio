import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck, Trophy, GraduationCap, Wrench } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { ScrollReveal } from '@/components/ScrollReveal';

interface Certification {
  title: string;
  issuer: string;
  date: string;
  validUntil?: string;
  link: string;
}

interface CertCategory {
  label: string;
  icon: React.ReactNode;
  certs: Certification[];
}

const categories: CertCategory[] = [
  {
    label: 'Safety & Industry',
    icon: <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />,
    certs: [
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
    ],
  },
  {
    label: 'Technical (CAD)',
    icon: <Wrench className="w-5 h-5 text-[#3B82F6]" />,
    certs: [
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
    ],
  },
  {
    label: 'Awards & Achievements',
    icon: <Trophy className="w-5 h-5 text-[#3B82F6]" />,
    certs: [
      {
        title: "OUS Photo Contest 2023 — People's Choice Award (Nature Category)",
        issuer: 'PolyU Office of Undergraduate Studies',
        date: '2023',
        link: '/projects/OUS%20Photo%20Contest%202023%20(People%27s%20Choice%20Award).jpg',
      },
      {
        title: 'OUS Photo Contest 2023 — Bronze Award (Nature Category)',
        issuer: 'PolyU Office of Undergraduate Studies',
        date: '2023',
        link: '/projects/OUS%20Photo%20Contest%202023%20(Bronze%20Award).jpg',
      },
      {
        title: "The Duke of Edinburgh's International Award — Gold Standard",
        issuer: "The Duke of Edinburgh's International Award Foundation",
        date: 'August 10, 2020',
        link: '/projects/Duke%20of%20Edinburgh%20Gold%20Standard.pdf',
      },
    ],
  },
  {
    label: 'Programs',
    icon: <GraduationCap className="w-5 h-5 text-[#3B82F6]" />,
    certs: [
      {
        title: 'NYC Business Insider Program 2019',
        issuer: 'Fordham University — Gabelli School of Business',
        date: 'July 31, 2019',
        link: '/projects/FORDHAM.jpg',
      },
    ],
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

        {/* Categorized sections */}
        <div className="space-y-8">
          {categories.map((cat, catIndex) => (
            <ScrollReveal key={cat.label} delay={catIndex * 0.1}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF1F5] flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-[#1A2B4A]">{cat.label}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.certs.map((cert) => (
                    <motion.a
                      key={cert.title}
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all duration-300 h-full"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      data-cursor="View"
                    >
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

                      <ExternalLink className="w-4 h-4 text-[#8B95A5] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </NeuCard>
    </section>
  );
};
