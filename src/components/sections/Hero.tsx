import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Download, MapPin } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { NeuButton } from '@/components/ui/NeuButton';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="section-container py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <NeuCard className="p-6 sm:p-10 lg:p-12 overflow-hidden relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[#3B82F6]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-[#1A2B4A]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0"
              >
                <motion.div 
                  className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-xl border-4 ring-4 ring-white/40"
                  style={{ borderColor: 'var(--color-border)' }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/projects/my_picture_2.jpg"
                    alt="Mushfique Tanzim Muztaba"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2B4A] tracking-tight mb-2">
                    Hey! I am <span className="text-[#3B82F6]">Mushfique Tanzim Muztaba</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-[#5F6B7A] font-light mb-6">
                    Final Year Undergraduate Student in Mechanical Engineering
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-4 text-[#5F6B7A] leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8"
                >
                  <p>
                    I am passionate about mechanical design and prototyping. From concept development 
                    to physical fabrication, I enjoy turning ideas into functional solutions while 
                    also bringing experience in project management and digital automation.
                  </p>
                  <p>
                    I am seeking opportunities where I can apply and further enhance my engineering skills.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-wrap gap-2 justify-center lg:justify-start"
                >
                  <NeuButton
                    variant="primary"
                    href="/projects/MUSHFIQUE TANZIM MUZTABA_CV.pdf"
                    download="Mushfique_Tanzim_Muztaba_CV.pdf"
                    className="text-sm px-3 py-2"
                  >
                    <Download className="w-4 h-4" />
                    Download CV
                  </NeuButton>
                  
                  <NeuButton
                    variant="secondary"
                    href="https://www.linkedin.com/in/mushfique-tanzim-muztaba-331228242/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </NeuButton>
                  
                  <NeuButton
                    variant="secondary"
                    href="mailto:mushfiquetm@gmail.com"
                    className="text-sm px-3 py-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </NeuButton>
                  
                  <NeuButton
                    variant="secondary"
                    href="tel:+85256014576"
                    className="text-sm px-3 py-2"
                  >
                    <Phone className="w-4 h-4" />
                    Phone
                  </NeuButton>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-6 flex items-center gap-2 justify-center lg:justify-start text-[#8B95A5]"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Hong Kong</span>
                </motion.div>
              </div>
            </div>
          </div>
        </NeuCard>
      </motion.div>
    </section>
  );
};
