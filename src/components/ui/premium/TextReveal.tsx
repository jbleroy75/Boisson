'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  type?: 'chars' | 'words' | 'lines';
  animation?: 'fade' | 'slide' | 'scale' | 'rotate';
  once?: boolean;
}

export default function TextReveal({
  children,
  className = '',
  delay = 0,
  staggerChildren = 0.03,
  type = 'chars',
  animation = 'slide',
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const splitText = () => {
    switch (type) {
      case 'chars':
        return children.split('');
      case 'words':
        return children.split(' ');
      case 'lines':
        return children.split('\n');
      default:
        return children.split('');
    }
  };

  const getAnimation = (): { hidden: Variants['hidden']; visible: Variants['visible'] } => {
    switch (animation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'slide':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'rotate':
        return {
          hidden: { opacity: 0, rotateX: 90 },
          visible: { opacity: 1, rotateX: 0 },
        };
      default:
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren,
      },
    },
  };

  const { hidden, visible } = getAnimation();

  const charVariants: Variants = {
    hidden,
    visible: {
      ...visible,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const elements = splitText();

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ perspective: animation === 'rotate' ? 1000 : undefined }}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={charVariants}
          style={{
            whiteSpace: type === 'chars' && element === ' ' ? 'pre' : undefined,
            transformStyle: animation === 'rotate' ? 'preserve-3d' : undefined,
          }}
        >
          {element}
          {type === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Variant for headlines with gradient reveal
export function GradientTextReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {/* Background text */}
      <span className="text-gray-200">{children}</span>

      {/* Gradient overlay that reveals */}
      <motion.span
        className="absolute inset-0 text-gradient bg-clip-text"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
        transition={{ duration: 1, delay, ease: [0.77, 0, 0.175, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
