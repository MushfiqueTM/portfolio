"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTopButton() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Scroll to navigation buttons
  const scrollToNav = () => {
    // Responsive position: -0.25 * screen width + 2340
    const navPosition = -0.25 * window.innerWidth + 2340;

    window.scrollTo({
      top: navPosition,
      behavior: 'smooth'
    });
  };

  // Show/hide scroll to nav button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      // Responsive position: -0.25 * screen width + 2340
      const navPosition = -0.25 * window.innerWidth + 2340;
      // Show button when scrolling past the navigation buttons
      setShowScrollToTop(scrollPos >= navPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showScrollToTop && (
        <div className="fixed inset-x-0 bottom-6 flex justify-end pointer-events-none z-50">
          <div className="w-full max-w-[1200px] mx-auto flex justify-end px-6 pointer-events-none">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={scrollToNav}
              className="pointer-events-auto z-50 w-12 h-12 bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white"
              aria-label="Scroll to navigation"
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ y: 0 }}
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
