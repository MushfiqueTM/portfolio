"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, memo, useCallback, lazy, Suspense } from 'react';
import { Mail, Phone, Globe, BookOpen, Briefcase, ExternalLink, X, Code, Palette, Monitor, Award, Linkedin, Download, Wrench } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton';
import workExperience from '../src/data/workExperience.json';
import projects3D from '../src/data/projects3D.json';
import leadership from '../src/data/leadership.json';
import allExperiencesProjects from '../src/data/allProjects.json';

// Lazy load view components
const AllExperiencesView = lazy(() => import('../src/views/AllExperiencesView'));
const CADView = lazy(() => import('../src/views/CADView'));
const DesignView = lazy(() => import('../src/views/DesignView'));

// Loading fallback component
const ViewLoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-[var(--color-muted)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      <p className="text-[var(--color-muted)] text-sm">Loading...</p>
    </div>
  </div>
);

// Image component with loading states and error handling
const OptimizedImage = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  onClick,
  motionProps = {},
  disableHover = false
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  motionProps?: any;
  disableHover?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${containerClassName}`}
      onClick={onClick}
      {...motionProps}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] z-10">
          <div className="w-8 h-8 border-2 border-[var(--color-muted)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-muted)] z-10">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${!disableHover ? 'group-hover:scale-105' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// Interactive Background Component
const InteractiveBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement so it feels fluid, not jittery
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update motion values directly to avoid re-renders
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 1. Engineering Grid Pattern (Static) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #6B4BDD 1px, transparent 1px),
            linear-gradient(to bottom, #6B4BDD 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 2. Interactive Glowing Orb (Follows Mouse) */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #6B4BDD 0%, rgba(107, 75, 221, 0) 70%)',
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          filter: "blur(60px)",
        }}
      />

      {/* 3. Ambient Floating Orbs (Auto-animate for when mouse isn't moving) */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7C5DD8] opacity-10 blur-[80px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#5A3BC7] opacity-10 blur-[80px]"
        animate={{
          x: [0, -70, 0],
          y: [0, -100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default memo(function Portfolio() {

  const [activeView, setActiveView] = useState<'3d' | 'all' | 'design'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLightboxTransitioning, setIsLightboxTransitioning] = useState(false);

  // Consolidated expanded state for image visibility
  const [expanded, setExpanded] = useState<{
    work: {[key: string]: boolean};
    team: {[key: string]: boolean};
    project: {[key: string]: boolean};
    leadership: {[key: string]: boolean};
  }>({
    work: {},
    team: {},
    project: {},
    leadership: {}
  });

  // Scroll position management
  const scrollPositionRef = useRef<number>(0);
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);

  const openLightbox = (imagePath: string, allImages: string[], index: number) => {
    setLightboxImages(allImages);
    setCurrentImageIndex(index);
    setLightboxImage(imagePath);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxImages([]);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (lightboxImages.length === 0 || isLightboxTransitioning) return;

    setIsLightboxTransitioning(true);
    let newIndex = currentImageIndex;
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % lightboxImages.length;
    } else {
      newIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
    }

    // Update index immediately for smooth transition
    setCurrentImageIndex(newIndex);
    setLightboxImage(lightboxImages[newIndex]);

    // Reset transition state after animation completes
    setTimeout(() => setIsLightboxTransitioning(false), 300);
  };

  // Memoized toggle function for image visibility
  const toggleImages = useCallback((category: 'work' | 'team' | 'project' | 'leadership', key: string) => {
    scrollPositionRef.current = window.scrollY;
    setIsUpdatingImages(true);
    setExpanded(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: !prev[category][key] }
    }));
  }, []);

  useLayoutEffect(() => {
    if (isUpdatingImages) {
      window.scrollTo(0, scrollPositionRef.current);
      setIsUpdatingImages(false);
    }
  }, [expanded, isUpdatingImages]);


    

  // Preload images for lightbox
  useEffect(() => {
    if (lightboxImages.length > 0) {
      lightboxImages.forEach((imagePath) => {
        const img = new Image();
        img.src = imagePath;
      });
    }
  }, [lightboxImages]);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') navigateLightbox('prev');
      else if (e.key === 'ArrowRight') navigateLightbox('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, currentImageIndex, lightboxImages.length]);

  const ProjectItem = ({ children, index }: { children: React.ReactNode; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };







  return (
    <motion.div
      className="min-h-screen relative selection:bg-[#6B4BDD] selection:text-white"
      style={{ backgroundColor: 'var(--color-background)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <InteractiveBackground />

      <div className="relative z-10">
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-sm p-5 sm:p-7 md:p-12 border"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <div className="absolute inset-0 opacity-70 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 20%, rgba(107, 75, 221, 0.12), transparent 35%), radial-gradient(circle at 80% 10%, rgba(124, 93, 216, 0.12), transparent 30%), radial-gradient(circle at 50% 80%, rgba(107, 75, 221, 0.08), transparent 35%)" }} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
          <div className="relative">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <motion.div 
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <motion.div
                className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-xl border-4 ring-4 ring-white/40"
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
            <motion.div 
              className="flex-1 space-y-4 text-center md:text-left"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2" style={{ color: 'var(--color-heading)' }}>Hey! I am Mushfique Tanzim Muztaba</h1>
                <p className="text-base sm:text-lg md:text-xl font-light" style={{ color: 'var(--color-body)' }}>Final Year Undergraduate Student in Mechanical Engineering</p>
              </motion.div>
              <motion.div 
                className="space-y-3 leading-relaxed"
                style={{ color: 'var(--color-body)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <p>I am passionate about mechanical design and prototyping. From concept development to physical fabrication, I enjoy turning ideas into functional solutions while also bringing experience in project management and digital automation.</p>
                <p>I am seeking opportunities where I can apply and further enhance my engineering skills.</p>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6 pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <motion.a
                    href="/projects/MUSHFIQUE TANZIM MUZTABA_CV.pdf"
                    download="Mushfique_Tanzim_Muztaba_CV.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] shadow-md hover:shadow-lg transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Download className="w-4 h-4" /> Download CV
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/mushfique-tanzim-muztaba-331228242/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-heading)] bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </motion.a>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <motion.a
                    href="mailto:mushfiquetm@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-heading)] bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Mail className="w-4 h-4" /> Email
                  </motion.a>
                  <motion.a
                    href="tel:+85256014576"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-heading)] bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Phone className="w-4 h-4" /> Phone
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="rounded-2xl shadow-sm p-4 sm:p-6 md:p-12 border"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="w-6 h-6 text-[var(--color-body)]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Education</h2>
          </motion.div>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <motion.img 
                src="/projects/university.jpg" 
                alt="The Hong Kong Polytechnic University Logo" 
                className="w-16 h-16 object-contain rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-heading)]">The Hong Kong Polytechnic University</h3>
                <p className="text-base sm:text-lg text-[var(--color-body)]">Bachelor of Engineering (Honours) in Mechanical Engineering</p>
                <p className="text-[var(--color-body)]">Graduation Date: June 2026</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="rounded-2xl shadow-sm p-4 sm:p-6 md:p-12 border"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Code className="w-6 h-6 text-[var(--color-body)]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Skills</h2>
          </motion.div>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Technical Skills */}
            <div className="space-y-6">
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Monitor className="w-5 h-5 text-[#6B4BDD]" />
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">Technical Skills</h3>
              </motion.div>

              {/* CAD & Design */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">CAD & Design</h4>
                <div className="flex flex-wrap gap-2">
                  {['SOLIDWORKS', 'AutoCAD'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.4 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Programming */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Programming</h4>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'MATLAB', 'SQL', 'JavaScript', 'TypeScript', 'HTML', 'CSS'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.5 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* AI/ML & Computer Vision */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">AI/ML & Computer Vision</h4>
                <div className="flex flex-wrap gap-2">
                  {['OpenCV', 'PyTorch', 'Ultralytics YOLO', 'Roboflow', 'Object Detection', 'Image Classification', 'Computer Vision'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.6 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Web Development */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Web Development</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'Tailwind CSS', 'Framer Motion (Animation Library)', 'CSS Variables'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.7 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Hardware & Embedded Systems */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Hardware & Embedded Systems</h4>
                <div className="flex flex-wrap gap-2">
                  {['Raspberry Pi', 'GPIO', 'I2C', 'PID Control'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.8 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Microsoft Suite */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Microsoft Suite</h4>
                <div className="flex flex-wrap gap-2">
                  {['Microsoft Power Platform (Power Apps, Power Automate, Power BI)', ' Microsoft Office (Excel, PowerPoint, Word)'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.9 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Industrial Skills */}
            <div className="space-y-6">
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Briefcase className="w-5 h-5 text-[#6B4BDD]" />
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">Industrial Skills</h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="flex flex-wrap gap-2">
                  {['3D Printing', 'Metal Casting', 'Surface Engineering', 'Sheet Metal', 'Welding', 'Machining'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.7 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Design & Media */}
            <div className="space-y-6">
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Palette className="w-5 h-5 text-[#6B4BDD]" />
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">Design & Media</h3>
              </motion.div>

              {/* Photo & Video Editing */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Photo & Video Editing</h4>
                <div className="flex flex-wrap gap-2">
                  {['Adobe Lightroom', 'CAPCUT', 'Da Vinci Resolve'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.6 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Graphic Design Tools */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Graphic Design Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {['Canva', 'Adobe Illustrator','Adobe Photoshop'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.7 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Design Principles */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Design Principles</h4>
                <div className="flex flex-wrap gap-2">
                  {['UI/UX Design', 'Responsive Web Design', 'Animation Design', 'Interaction Design', 'User Experience Optimization'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.8 + index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
          <motion.button
            onClick={() => setActiveView('all')}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 min-h-[44px] flex items-center justify-center ${activeView === 'all' ? 'text-white shadow-md hover:shadow-lg bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD]' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            All Experiences
          </motion.button>
          <motion.button
            onClick={() => setActiveView('3d')}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 min-h-[44px] flex items-center justify-center ${activeView === '3d' ? 'text-white shadow-md hover:shadow-lg bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD]' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Computer Aided Designs
          </motion.button>
          <motion.button
            onClick={() => setActiveView('design')}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 min-h-[44px] flex items-center justify-center ${activeView === 'design' ? 'text-white shadow-md hover:shadow-lg bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD]' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Graphic Designs
          </motion.button>
        </div>
      </motion.div>

      {activeView === '3d' && (
        <CADView
          openLightbox={openLightbox}
        />
      )}

      {activeView === 'all' && (
        <AllExperiencesView
          expanded={expanded}
          toggleImages={toggleImages}
          openLightbox={openLightbox}
        />
      )}

      {activeView === 'design' && (
        <DesignView
          openLightbox={openLightbox}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="text-center text-[var(--color-muted)] text-xs sm:text-sm space-y-2">
          <p>© 2026 Mushfique Tanzim Muztaba</p>
          <a href="https://www.linkedin.com/in/mushfique-tanzim-muztaba-331228242/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--color-body)] transition-colors min-h-[44px] px-2">
            LinkedIn <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>

      {/* Closing the wrapper content div */}
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4" 
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
            />
            <motion.button 
              onClick={closeLightbox} 
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-[var(--color-muted)] transition-colors z-10 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" 
              aria-label="Close lightbox"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.button>
            {lightboxImages.length > 1 && (
              <>
                <motion.button 
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }} 
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-muted)] transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" 
                  aria-label="Previous image"
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button 
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }} 
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-muted)] transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" 
                  aria-label="Next image"
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}
            <motion.div
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center px-4 sm:px-0"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              key={lightboxImage}
            >
              <OptimizedImage
                src={lightboxImage}
                alt="Lightbox image"
                className="max-w-full max-h-[85vh] sm:max-h-full object-contain"
                motionProps={{
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.95 },
                  transition: { duration: 0.3, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }
                }}
              />
            </motion.div>
            {lightboxImages.length > 1 && (
              <motion.div 
                className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-black bg-opacity-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {currentImageIndex + 1} / {lightboxImages.length}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

    </motion.div>
  );
});
