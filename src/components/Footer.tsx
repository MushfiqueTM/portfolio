import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, ExternalLink } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export const Footer: React.FC = () => {
  return (
    <footer className="section-container py-12 sm:py-16">
      <ScrollReveal>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#8B95A5]">© 2026 Mushfique Tanzim Muztaba</span>
          </div>
          
          <motion.a
            href="https://www.linkedin.com/in/mushfique-tanzim-muztaba-331228242/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#5F6B7A] hover:text-[#1A2B4A] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3" />
          </motion.a>
          
        </div>
      </ScrollReveal>
    </footer>
  );
};
