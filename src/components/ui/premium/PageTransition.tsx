'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  type?: 'fade' | 'slide' | 'scale' | 'reveal' | 'curtain';
}

export default function PageTransition({
  children,
  className = '',
  type = 'fade',
}: PageTransitionProps) {
  const pathname = usePathname();

  const getVariants = () => {
    switch (type) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'slide':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 },
        };
      case 'reveal':
        return {
          initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          exit: { opacity: 0, y: -20, filter: 'blur(10px)' },
        };
      case 'curtain':
        return {
          initial: { clipPath: 'inset(0 0 100% 0)' },
          animate: { clipPath: 'inset(0 0 0% 0)' },
          exit: { clipPath: 'inset(100% 0 0 0)' },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const variants = getVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          type: 'tween',
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Full screen transition overlay
export function TransitionOverlay({
  isAnimating,
  color = '#FF6B35',
}: {
  isAnimating: boolean;
  color?: string;
}) {
  return (
    <AnimatePresence>
      {isAnimating && (
        <>
          {/* First layer */}
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{ backgroundColor: color }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
            style={{ transformOrigin: 'top' }}
          />
          {/* Second layer */}
          <motion.div
            className="fixed inset-0 z-[99] bg-white"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
            style={{ transformOrigin: 'top' }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// Staggered children animation
export function StaggerContainer({
  children,
  className = '',
  staggerChildren = 0.1,
  delayChildren = 0,
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Smooth scroll link with transition
export function TransitionLink({
  href,
  children,
  className = '',
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Trigger any custom transition logic
    if (onClick) onClick();

    // Smooth scroll to section if it's an anchor
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Navigate with Next.js router
    window.location.href = href;
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
