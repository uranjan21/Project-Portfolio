import { useEffect, useState } from 'react';

/** Text that periodically glitches with RGB-split slices. */
export function GlitchText({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 500);
        schedule();
      }, 3000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <span className={`glitch${glitching ? ' glitching' : ''}`} data-text={text}>
      {text}
    </span>
  );
}
