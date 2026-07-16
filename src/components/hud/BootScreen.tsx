import { useEffect, useState } from 'react';

const BOOT_LINES = [
  '> INITIALIZING PORTFOLIO SYSTEM v2.0 ...',
  '> LOADING PROFILE DATA .............. OK',
  '> CALIBRATING HUD OVERLAY ........... OK',
  '> ESTABLISHING COMM CHANNEL ......... OK',
  '> ALL SYSTEMS NOMINAL',
];

/** Short cinematic boot sequence shown once per browser session. */
export function BootScreen() {
  const [skipped] = useState(() => sessionStorage.getItem('booted') === '1');
  const [done, setDone] = useState(skipped);

  useEffect(() => {
    if (skipped) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem('booted', '1');
      setDone(true);
    }, 1600);
    return () => clearTimeout(timer);
  }, [skipped]);

  if (skipped) return null;

  return (
    <div className={`boot${done ? ' done' : ''}`} aria-hidden="true">
      <div className="boot-lines">
        {BOOT_LINES.map((line, i) => (
          <div
            key={line}
            className={line.includes('OK') || line.includes('NOMINAL') ? 'ok' : ''}
            style={{ animationDelay: `${i * 0.22}s` }}
          >
            {line}
          </div>
        ))}
        <div className="boot-bar" />
      </div>
    </div>
  );
}
