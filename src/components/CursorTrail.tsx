import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface TapRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const SPARK_COLORS = ['#DB9558', '#A8BBA3', '#97A87A', '#FCF9EA'];

export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const points: TrailPoint[] = [];
    const sparks: SparkParticle[] = [];
    const ripples: TapRipple[] = [];

    let lastX = -999;
    let lastY = -999;
    let rafId: number | null = null;
    let lastTime = performance.now();

    const startLoop = () => {
      if (rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(render);
      }
    };

    const addTrailPoint = (x: number, y: number, spawnSpark = true) => {
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist < 2 && points.length > 0) return;

      points.push({ x, y, age: 0, maxAge: 280 });
      if (points.length > 26) {
        points.shift();
      }

      if (spawnSpark && dist > 6 && sparks.length < 40) {
        const count = dist > 26 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.25 + Math.random() * 0.75;
          sparks.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.15,
            size: 1.5 + Math.random() * 2.2,
            color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
            alpha: 0.75,
            decay: 0.022 + Math.random() * 0.018,
          });
        }
      }

      lastX = x;
      lastY = y;
      startLoop();
    };

    const handlePointerMove = (e: PointerEvent) => {
      addTrailPoint(e.clientX, e.clientY, e.pointerType !== 'touch');
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        addTrailPoint(t.clientX, t.clientY, false);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 3,
        maxRadius: 24,
        alpha: 0.55,
      });
      startLoop();
    };

    const render = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Age and prune ribbon points
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].age += dt;
        if (points[i].age >= points[i].maxAge) {
          points.splice(i, 1);
        }
      }

      // Draw tapered glowing ribbon
      if (points.length > 1) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const life = 1 - p1.age / p1.maxAge;
          const progress = i / (points.length - 1);
          const alpha = Math.max(0, life * progress * 0.65);

          const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
          grad.addColorStop(0, `rgba(168, 187, 163, ${alpha * 0.65})`);
          grad.addColorStop(1, `rgba(219, 149, 88, ${alpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = Math.max(0.8, progress * life * 5.5);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }

        // Soft glowing head orb at latest pointer
        const head = points[points.length - 1];
        const headLife = Math.max(0, 1 - head.age / head.maxAge);
        if (headLife > 0.05) {
          const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
          glow.addColorStop(0, `rgba(252, 249, 234, ${headLife * 0.45})`);
          glow.addColorStop(0.4, `rgba(219, 149, 88, ${headLife * 0.28})`);
          glow.addColorStop(1, 'rgba(219, 149, 88, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 14, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Draw drifting micro-sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * (dt / 16);
        s.y += s.vy * (dt / 16);
        s.alpha -= s.decay * (dt / 16);

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw subtle tap/click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 1.2 * (dt / 16);
        r.alpha -= 0.028 * (dt / 16);

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(219, 149, 88, ${Math.max(0, r.alpha)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (points.length > 0 || sparks.length > 0 || ripples.length > 0) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-9999"
    />
  );
};
