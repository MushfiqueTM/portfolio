import { useEffect, useRef } from 'react';

/**
 * Engineered Grid Background
 * Drafting grid with cursor-tracking spotlight that reveals navy crosshairs,
 * axis labels (X/Y coordinates), and an accent halo.
 *
 * Drop-in replacement for the existing <ParticleBackground />.
 * Theme-locked: #F2F4F6 surface, #1A2B4A navy, #3B82F6 accent.
 */
export const EngineeredGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000, active: false });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Skip on small touch devices for perf
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
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let t = 0;
    const draw = () => {
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.clearRect(0, 0, W, H);
      t += 0.005;

      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.12;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = mouseRef.current.active;

      const minor = 24;
      const major = 96;

      // Minor grid
      ctx.strokeStyle = 'rgba(26, 43, 74, 0.022)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x += minor) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0; y <= H; y += minor) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();

      // Major grid
      ctx.strokeStyle = 'rgba(26, 43, 74, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x += major) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0; y <= H; y += major) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();

      if (active) {
        const R = 220;

        // Accent halo
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, R);
        halo.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
        halo.addColorStop(0.6, 'rgba(59, 130, 246, 0.02)');
        halo.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(mx, my, R, 0, Math.PI * 2);
        ctx.fill();

        // Reveal stronger grid inside spotlight
        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, R, 0, Math.PI * 2);
        ctx.clip();

        ctx.strokeStyle = 'rgba(26, 43, 74, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const startX = Math.floor((mx - R) / minor) * minor;
        const endX = Math.ceil((mx + R) / minor) * minor;
        const startY = Math.floor((my - R) / minor) * minor;
        const endY = Math.ceil((my + R) / minor) * minor;
        for (let x = startX; x <= endX; x += minor) { ctx.moveTo(x, my - R); ctx.lineTo(x, my + R); }
        for (let y = startY; y <= endY; y += minor) { ctx.moveTo(mx - R, y); ctx.lineTo(mx + R, y); }
        ctx.stroke();

        // Highlight major intersections
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        for (let x = startX; x <= endX; x += major) {
          for (let y = startY; y <= endY; y += major) {
            const d = Math.hypot(x - mx, y - my);
            if (d < R) {
              ctx.globalAlpha = 1 - d / R;
              ctx.beginPath();
              ctx.arc(x, y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.globalAlpha = 1;
        ctx.restore();

        // Crosshair
        ctx.strokeStyle = 'rgba(26, 43, 74, 0.18)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(mx - R, my); ctx.lineTo(mx + R, my);
        ctx.moveTo(mx, my - R); ctx.lineTo(mx, my + R);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cursor dot + ring
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.stroke();

        // Coord readout
        ctx.font = '500 11px ui-monospace, "SF Mono", Menlo, monospace';
        ctx.fillStyle = 'rgba(26, 43, 74, 0.45)';
        ctx.fillText(
          `X ${Math.round(mx).toString().padStart(4, '0')}  Y ${Math.round(my).toString().padStart(4, '0')}`,
          mx + 16,
          my - 12
        );
      }

      // Drifting scan line
      const scanY = (t * 80 * 100) % H;
      const scan = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      scan.addColorStop(0, 'rgba(59,130,246,0)');
      scan.addColorStop(0.5, 'rgba(59,130,246,0.025)');
      scan.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = scan;
      ctx.fillRect(0, scanY - 60, W, 120);

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
