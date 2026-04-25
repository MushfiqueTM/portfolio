import { useEffect, useRef } from 'react';

/**
 * Aurora Mesh Background
 * Slow-flowing gradient blobs in theme colors with cursor parallax.
 *
 * Drop-in replacement for the existing <ParticleBackground />.
 * Theme-locked: #F2F4F6 / #1A2B4A / #3B82F6.
 */
export const AuroraMeshBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isTouchDevice = 'ontouchstart' in window && window.innerWidth < 768;
    if (isTouchDevice) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX / window.innerWidth;
      mouseRef.current.ty = e.clientY / window.innerHeight;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    const blobs = [
      { color: 'rgba(59, 130, 246, 0.55)',  r: 0.55, cx: 0.2, cy: 0.3, sx: 0.18, sy: 0.14, sp: 0.0006, ph: 0,    pull: 0.10 },
      { color: 'rgba(26, 43, 74, 0.35)',    r: 0.50, cx: 0.8, cy: 0.7, sx: 0.20, sy: 0.16, sp: 0.0005, ph: 1.7,  pull: 0.08 },
      { color: 'rgba(59, 130, 246, 0.28)',  r: 0.45, cx: 0.7, cy: 0.2, sx: 0.14, sy: 0.18, sp: 0.0008, ph: 3.1,  pull: 0.14 },
      { color: 'rgba(26, 43, 74, 0.20)',    r: 0.55, cx: 0.25, cy: 0.8, sx: 0.16, sy: 0.12, sp: 0.0004, ph: 4.5,  pull: 0.06 },
      { color: 'rgba(139, 149, 165, 0.30)', r: 0.40, cx: 0.5, cy: 0.5, sx: 0.22, sy: 0.10, sp: 0.0007, ph: 2.2,  pull: 0.05 },
    ];

    let t = 0;
    const draw = () => {
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      t += 16;

      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      ctx.fillStyle = '#F2F4F6';
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.filter = 'blur(60px)';
      for (const b of blobs) {
        const px = b.cx + Math.sin(t * b.sp + b.ph) * b.sx + (mouseRef.current.x - 0.5) * b.pull;
        const py = b.cy + Math.cos(t * b.sp * 1.2 + b.ph) * b.sy + (mouseRef.current.y - 0.5) * b.pull;
        const radius = Math.min(W, H) * b.r;
        const grad = ctx.createRadialGradient(px * W, py * H, 0, px * W, py * H, radius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, b.color.replace(/[\d.]+\)$/, '0)'));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px * W, py * H, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Top-left light wash
      const wash = ctx.createLinearGradient(0, 0, W, H);
      wash.addColorStop(0, 'rgba(255,255,255,0.4)');
      wash.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Static grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.4,
          mixBlendMode: 'overlay',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(26,43,74,0.18) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />
    </div>
  );
};
