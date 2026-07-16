import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  ['#experience', 'EXPERIENCE'],
  ['#projects', 'PROJECTS'],
  ['#skills', 'SKILLS'],
  ['#achievements', 'RECORDS'],
  ['#contact', 'CONTACT'],
] as const;

/** Fixed top HUD bar: logo, nav, live clock, system status, scroll progress. */
export function StatusBar({ initials }: { initials: string }) {
  const [time, setTime] = useState(() => new Date());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearInterval(clock);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="statusbar">
        <a href="#top" className="logo">{initials}//SYS</a>
        <span className="sys">
          <span className="dot" /> ONLINE
        </span>
        <span className="sys">{time.toLocaleTimeString('en-GB')}</span>
        <nav>
          {NAV_ITEMS.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
      </header>
    </>
  );
}
