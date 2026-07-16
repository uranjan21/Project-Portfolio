import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  layer: number; // 0 (far) .. 2 (near) — nearer layers move more
  twinkle: number;
}

/**
 * Full-screen canvas starfield with three parallax layers that respond to
 * both scroll position and mouse movement.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let raf = 0;

    const LAYER_SPEED = [0.06, 0.14, 0.28];
    const LAYER_ALPHA = [0.35, 0.55, 0.9];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(280, Math.floor((width * height) / 6500));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        layer: Math.floor(Math.random() * 3),
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / width - 0.5;
      mouseY = e.clientY / height - 0.5;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const scroll = window.scrollY;
      for (const star of stars) {
        const speed = LAYER_SPEED[star.layer];
        const offsetY = (star.y - scroll * speed) % height;
        const y = offsetY < 0 ? offsetY + height : offsetY;
        const x = (star.x - mouseX * speed * 120 + width) % width;
        const alpha = LAYER_ALPHA[star.layer] * (reduced ? 1 : 0.7 + 0.3 * Math.sin(t / 900 + star.twinkle));
        ctx.beginPath();
        ctx.arc(x, y - mouseY * speed * 60, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.layer === 2 ? `rgba(125, 211, 252, ${alpha})` : `rgba(219, 234, 254, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) window.addEventListener('mousemove', onMouseMove);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
