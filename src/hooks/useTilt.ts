import { useRef } from 'react';
import type { CSSProperties, MouseEvent } from 'react';

/** 3D tilt-toward-cursor effect for cards. Returns handlers + ref to spread onto the element. */
export function useTilt(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${px * maxDeg}deg) rotateX(${-py * maxDeg}deg) translateZ(4px)`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  const style: CSSProperties = { transformStyle: 'preserve-3d' };

  return { ref, onMouseMove, onMouseLeave, style };
}
