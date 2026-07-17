import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

/**
 * Animates the numeric part of a stat value ("20+" counts 0→20, keeping the
 * suffix). Non-numeric values render as-is.
 */
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [current, setCurrent] = useState(0);

  const target = match ? parseInt(match[2], 10) : 0;

  useEffect(() => {
    if (!inView || !match) return;
    const controls = animate(0, target, {
      duration: 1.3,
      ease: 'easeOut',
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target]);

  if (!match) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {match[1]}
      {current}
      {match[3]}
    </span>
  );
}
