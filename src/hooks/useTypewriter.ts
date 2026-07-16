import { useEffect, useState } from 'react';

/** Types out `text`, character by character. Restarts when `text` changes. */
export function useTypewriter(text: string, speed = 45, startDelay = 300) {
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput('');
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setOutput(text.slice(0, i));
        if (i >= text.length && interval) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return output;
}
