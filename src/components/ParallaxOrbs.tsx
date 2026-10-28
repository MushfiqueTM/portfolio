import { useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

/**
 * Two blurred gradient orbs that drift with scroll and cursor.
 *
 * Driven by `scrollYProgress` rather than absolute `scrollY` — the old version mapped
 * `[0, 3000]` pixels, which assumed a document at least 3000px tall and so barely moved
 * on the shorter category pages.
 */
export function ParallaxOrbs() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 40, stiffness: 100 });
  const smoothMouseY = useSpring(mouseY, { damping: 40, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * 0.02);
      mouseY.set((e.clientY - window.innerHeight / 2) * 0.02);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-gradient-radial from-cyan/5 to-transparent rounded-full blur-3xl"
        style={{ y: y1, x: smoothMouseX, translateY: smoothMouseY }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-radial from-ink/5 to-transparent rounded-full blur-3xl"
        style={{ y: y2, x: smoothMouseX }}
      />
    </div>
  );
}
