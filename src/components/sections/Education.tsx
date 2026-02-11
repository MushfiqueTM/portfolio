import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { ScrollReveal } from '@/components/ScrollReveal';

export const Education: React.FC = () => {
  return (
    <section id="education" className="section-container py-12 sm:py-16">
      <ScrollReveal>
        <NeuCard className="p-6 sm:p-10">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
            >
              <GraduationCap className="w-6 h-6 text-[#1A2B4A]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Education</h2>
          </div>

          {/* Education Card */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* University Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex-shrink-0"
            >
              <motion.img 
                src="/projects/university.jpg" 
                alt="The Hong Kong Polytechnic University Logo" 
                className="w-16 h-16 object-contain rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>

            {/* Education Details */}
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1A2B4A] mb-2">
                The Hong Kong Polytechnic University
              </h3>
              <p className="text-lg text-[#5F6B7A] mb-3">
                Bachelor of Engineering (Honours) in Mechanical Engineering
              </p>
              <div className="flex items-center gap-2 text-[#8B95A5]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Graduation Date: June 2026</span>
              </div>
            </div>
          </div>
        </NeuCard>
      </ScrollReveal>
    </section>
  );
};
