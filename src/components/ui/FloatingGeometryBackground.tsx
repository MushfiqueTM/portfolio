import { useEffect, useRef } from 'react';

type ShapeType = 'cube' | 'sphere' | 'ring' | 'triangle' | 'square';

interface Shape {
  type: ShapeType;
  x: number;
  y: number;
  z: number;
  size: number;
  rot: number;
  rotSpeed: number;
  floatPh: number;
  floatSp: number;
  floatAmp: number;
  accent: boolean;
}

/**
 * Floating Geometry Background
 * 2.5D primitives (cubes, spheres, rings, triangles, squares) drifting with
 * pseudo-3D depth and cursor parallax.
 *
 * Drop-in replacement for the existing <ParticleBackground />.
 * Theme-locked: #F2F4F6 / #1A2B4A / #3B82F6.
 */
export const FloatingGeometryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
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
      mouseRef.current.tx = e.clientX / window.innerWidth - 0.5;
      mouseRef.current.ty = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    const types: ShapeType[] = ['cube', 'sphere', 'ring', 'triangle', 'square'];
    const shapes: Shape[] = [];
    let seed = 7;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 22; i++) {
      shapes.push({
        type: types[Math.floor(rng() * types.length)],
        x: rng(),
        y: rng(),
        z: 0.2 + rng() * 1.0,
        size: 30 + rng() * 70,
        rot: rng() * Math.PI * 2,
        rotSpeed: (rng() - 0.5) * 0.004,
        floatPh: rng() * Math.PI * 2,
        floatSp: 0.0004 + rng() * 0.0006,
        floatAmp: 8 + rng() * 22,
        accent: rng() < 0.28,
      });
    }

    const drawShape = (s: Shape, x: number, y: number, scale: number, t: number) => {
      const sz = s.size * scale;
      const rot = s.rot + t * s.rotSpeed;
      const navy = '26, 43, 74';
      const accent = '59, 130, 246';
      const c = s.accent ? accent : navy;
      const a = 0.08 + Math.min(s.z, 1) * 0.18;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      if (s.type === 'cube') {
        ctx.strokeStyle = `rgba(${c}, ${a + 0.08})`;
        ctx.lineWidth = 1.2;
        const h = sz * 0.5;
        const w = sz * 0.5;
        const d = sz * 0.25;
        ctx.fillStyle = `rgba(${c}, ${a * 0.4})`;
        ctx.beginPath();
        ctx.moveTo(-w, 0); ctx.lineTo(0, -d); ctx.lineTo(w, 0); ctx.lineTo(0, d); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = `rgba(${c}, ${a * 0.7})`;
        ctx.beginPath();
        ctx.moveTo(-w, 0); ctx.lineTo(-w, h); ctx.lineTo(0, h + d); ctx.lineTo(0, d); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = `rgba(${c}, ${a * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(w, 0); ctx.lineTo(w, h); ctx.lineTo(0, h + d); ctx.lineTo(0, d); ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else if (s.type === 'sphere') {
        const grad = ctx.createRadialGradient(-sz * 0.15, -sz * 0.15, sz * 0.05, 0, 0, sz * 0.55);
        grad.addColorStop(0, `rgba(${c}, ${a + 0.18})`);
        grad.addColorStop(0.6, `rgba(${c}, ${a * 0.6})`);
        grad.addColorStop(1, `rgba(${c}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${c}, ${a + 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (s.type === 'ring') {
        ctx.strokeStyle = `rgba(${c}, ${a + 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, sz * 0.55, sz * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(${c}, ${a * 0.55})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, sz * 0.55, sz * 0.22, Math.PI / 2.5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (s.type === 'triangle') {
        ctx.strokeStyle = `rgba(${c}, ${a + 0.1})`;
        ctx.fillStyle = `rgba(${c}, ${a * 0.35})`;
        ctx.lineWidth = 1.2;
        const r = sz * 0.45;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const ang = -Math.PI / 2 + (i * Math.PI * 2) / 3;
          const px = Math.cos(ang) * r;
          const py = Math.sin(ang) * r;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else if (s.type === 'square') {
        ctx.strokeStyle = `rgba(${c}, ${a + 0.1})`;
        ctx.fillStyle = `rgba(${c}, ${a * 0.3})`;
        ctx.lineWidth = 1.2;
        const r = sz * 0.4;
        ctx.beginPath();
        ctx.rect(-r, -r, r * 2, r * 2);
        ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    };

    let t = 0;
    const draw = () => {
      t += 16;
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06;

      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.fillStyle = '#F2F4F6';
      ctx.fillRect(0, 0, W, H);

      const sorted = [...shapes].sort((a, b) => a.z - b.z);
      for (const s of sorted) {
        const parX = mouseRef.current.x * 60 * s.z;
        const parY = mouseRef.current.y * 60 * s.z;
        const fx = Math.sin(t * s.floatSp + s.floatPh) * s.floatAmp;
        const fy = Math.cos(t * s.floatSp * 0.8 + s.floatPh) * s.floatAmp * 0.7;
        const x = s.x * W + parX + fx;
        const y = s.y * H + parY + fy;
        drawShape(s, x, y, 0.6 + s.z * 0.7, t);
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
