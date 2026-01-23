"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const CertificationsSection = memo(() => {
  const ProjectItem = ({ children, index }: { children: React.ReactNode; index: number }) => {
    const [isInView, setIsInView] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        },
        { rootMargin: "-100px" }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="rounded-2xl shadow-sm p-4 sm:p-6 md:p-12 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <motion.div
          className="flex items-center gap-3 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Award className="w-6 h-6 text-[var(--color-body)]" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Certifications</h2>
        </motion.div>
        <div className="space-y-6">
          {/* 1. Construction Industry Safety Training Certificate (Hong Kong Green Card) */}
          <ProjectItem key="cert1" index={0}>
            <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-[var(--color-heading)] mb-1">Construction Industry Safety Training Certificate (Hong Kong Green Card)</h3>
                <p className="text-base text-[var(--color-body)] mb-1">Issued by The Hong Kong Safety Training Association</p>
                <p className="text-sm text-[var(--color-muted)]">Valid until March 2028</p>
                <a href="/projects/Green_card.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Certificate
                </a>
              </div>
            </div>
          </ProjectItem>

          {/* 2. Shipboard Cargo Handling Basic Safety Training Course (Hong Kong Blue Card) */}
          <ProjectItem key="cert2" index={1}>
            <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">Shipboard Cargo Handling Basic Safety Training Course (Hong Kong Blue Card)</h3>
                <p className="text-base text-[var(--color-body)] mb-1">Issued by Asia Venture Human Resources & Construction Limited</p>
                <p className="text-sm text-[var(--color-muted)]">Valid until January 2028</p>
                <a href="/projects/Blue_card.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Certificate
                </a>
              </div>
            </div>
          </ProjectItem>

          {/* 3. SOLIDWORKS: Modeling Gears */}
          <ProjectItem key="cert3" index={2}>
            <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">SOLIDWORKS: Modeling Gears</h3>
                <p className="text-base text-[var(--color-body)] mb-1">Issued by LinkedIn Learning</p>
                <p className="text-sm text-[var(--color-muted)]">Completed July 27, 2023</p>
                <a href="/projects/SOLIDWORKS%20Modeling%20Gears.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Certificate
                </a>
              </div>
            </div>
          </ProjectItem>

          {/* 4. SOLIDWORKS: Advanced Simulation */}
          <ProjectItem key="cert4" index={3}>
            <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">SOLIDWORKS: Advanced Simulation</h3>
                <p className="text-base text-[var(--color-body)] mb-1">Issued by LinkedIn Learning</p>
                <p className="text-sm text-[var(--color-muted)]">Completed July 24, 2023</p>
                <a href="/projects/SOLIDWORKS%20Advanced%20Simulation.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Certificate
                </a>
              </div>
            </div>
          </ProjectItem>

          {/* 5. SOLIDWORKS: Advanced Engineering Drawings */}
          <ProjectItem key="cert5" index={4}>
            <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">SOLIDWORKS: Advanced Engineering Drawings</h3>
                <p className="text-base text-[var(--color-body)] mb-1">Issued by LinkedIn Learning</p>
                <p className="text-sm text-[var(--color-muted)]">Completed July 24, 2023</p>
                <a href="/projects/SOLIDWORKS%20Advanced%20Engineering%20Drawings.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Certificate
                </a>
              </div>
            </div>
          </ProjectItem>

          {/* 6. Learning AutoCAD 2024 */}
          <ProjectItem key="cert6" index={5}>
            <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">Learning AutoCAD 2024</h3>
                <p className="text-base text-[var(--color-body)] mb-1">Issued by LinkedIn Learning</p>
                <p className="text-sm text-[var(--color-muted)]">Completed July 03, 2023</p>
                <a href="/projects/learning_autocad.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Certificate
                </a>
              </div>
            </div>
          </ProjectItem>
        </div>
      </div>
    </div>
  );
});

export default CertificationsSection;
