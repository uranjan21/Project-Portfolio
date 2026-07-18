import { useRef } from 'react';
import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface Magnetic {
  ref: React.RefObject<HTMLElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
}

/**
 * Pulls an element a few pixels toward the cursor, spring-damped.
 *
 * Only responds to a fine pointer (mouse/trackpad) — on touch there is no
 * hover, and reacting to the tap position just makes the button feel loose.
 * Movement is capped so the control never drifts away from its hit area.
 */
export function useMagnetic(strength = 0.32, max = 8): Magnetic {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const spring = { stiffness: 260, damping: 20, mass: 0.4 };
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    rawX.set(Math.max(-max, Math.min(max, dx)));
    rawY.set(Math.max(-max, Math.min(max, dy)));
  };

  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, onPointerMove, onPointerLeave };
}
