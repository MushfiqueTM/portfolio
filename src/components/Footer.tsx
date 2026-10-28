import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Phone } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export const Footer: React.FC = () => {
  return (
    <footer className="section-container py-12 sm:py-16">
      <ScrollReveal>
        <div className="text-center space-y-6">
          {/* Contact links */}
          <div className="flex items-center justify-center gap-4">
            <motion.a
              href="https://www.linkedin.com/in/mushfique-tanzim-muztaba-331228242/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-paper border border-rule shadow-well flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="mailto:mushfiquetm@gmail.com"
              className="w-10 h-10 rounded-full bg-paper border border-rule shadow-well flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="tel:+85256014576"
              className="w-10 h-10 rounded-full bg-paper border border-rule shadow-well flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Phone className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Tagline + copyright */}
          <div>
            <p className="text-sm text-ink-soft mb-1">Designed & built by Mushfique Tanzim Muztaba</p>
            <p className="text-xs text-ink-muted">© 2026 All rights reserved</p>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
};
