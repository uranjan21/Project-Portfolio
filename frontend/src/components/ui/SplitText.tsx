import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reveals a headline word by word on mount.
 *
 * Split by word, not character: character splitting shreds the text for screen
 * readers and breaks text selection. The whole string is still exposed once via
 * `aria-label`, with the animated fragments hidden from the accessibility tree.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'span';
}) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        style={{ display: 'inline' }}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
      >
        {words.map((word, i) => (
          // The clipping wrapper is what makes words rise out of a mask rather
          // than simply fading in.
          <span key={`${word}-${i}`} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <motion.span
              style={{ display: 'inline-block', willChange: 'transform' }}
              variants={{
                hidden: { y: '110%' },
                show: { y: 0, transition: { duration: 0.62, ease: [0.2, 0, 0, 1] } },
              }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
