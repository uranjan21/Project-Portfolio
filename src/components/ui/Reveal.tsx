import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Fades content up when it scrolls into view. */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className || undefined}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

/** Grid/list wrapper that reveals its StaggerItem children one by one. */
export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className || undefined}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className || undefined} variants={staggerChild}>
      {children}
    </motion.div>
  );
}
