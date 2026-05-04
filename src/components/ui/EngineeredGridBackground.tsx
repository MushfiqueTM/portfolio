import { useEffect, useRef } from 'react';

/**
 * Engineered Grid Background
 * Drafting grid with cursor-tracking spotlight that reveals navy crosshairs,
 * axis labels (X/Y coordinates), and an accent halo.
 *
 * Performance:
 * - Static grid is rendered once into an offscreen canvas and blitted each frame
 * - The render loop runs only while the mouse is moving (or smoothing is catching up)
 * - Pauses when the tab is hidden, when the cursor leaves the document, or on prefers-reduced-motion
 * - No continuous scan-line redraw
 */
export const EngineeredGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Skip on small touch devices for perf
    const isTouchDevice = 'ontouchstart' in window && window.innerWidth < 768;
    if (isTouchDevice) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const minor = 24;
    const major = 96;

    let W = 0;
    let H = 0;
    let gridLayer: HTMLCanvasElement | null = null;
    let raf = 0;
    let running = false;
    const mouse = { x: -1000, y: -1000, tx: -1000, ty: -1000, active: false };

    const buildGrid = () => {
      const off = document.createElement('canvas');
      off.width = canvas.width;
      off.height = canvas.height;
      const o = off.getContext('2d');
      if (!o) return;
      o.scale(dpr, dpr);

      // Minor grid
      o.strokeStyle = 'rgba(26, 43, 74, 0.022)';
      o.lineWidth = 1;
      o.beginPath();
      for (let x = 0; x <= W; x += minor) { o.moveTo(x, 0); o.lineTo(x, H); }
      for (let y = 0; y <= H; y += minor) { o.moveTo(0, y); o.lineTo(W, y); }
      o.stroke();

      // Major grid
      o.strokeStyle = 'rgba(26, 43, 74, 0.05)';
      o.beginPath();
      for (let x = 0; x <= W; x += major) { o.moveTo(x, 0); o.lineTo(x, H); }
      for (let y = 0; y <= H; y += major) { o.moveTo(0, y); o.lineTo(W, y); }
      o.stroke();

      gridLayer = off;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      if (gridLayer) ctx.drawImage(gridLayer, 0, 0, W, H);
    };

    const drawSpotlight = () => {
      drawStatic();

      const mx = mouse.x;
      const my = mouse.y;
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

      // Stronger grid inside spotlight
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
    };

    const tick = () => {
      if (document.hidden) {
        running = false;
        return;
      }

      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      if (mouse.active) {
        drawSpotlight();
      } else {
        drawStatic();
      }

      // If smoothing has caught up, pause until the next mouse move / visibility change
      const settled =
        Math.abs(mouse.tx - mouse.x) < 0.5 && Math.abs(mouse.ty - mouse.y) < 0.5;
      if (settled) {
        running = false;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.hidden || reduceMotion) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      buildGrid();
      drawStatic();
      if (mouse.active) start();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.active = true;
      start();
    };
    const handleMouseLeave = () => {
      mouse.active = false;
      start();
    };
    const handleVisibility = () => {
      if (!document.hidden && mouse.active) start();
    };

    resize();

    // If the user prefers reduced motion, leave the static grid up and skip listeners entirely
    if (reduceMotion) return;

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
