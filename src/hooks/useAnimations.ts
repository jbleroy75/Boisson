'use client';

import { useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Hook for motion-safe animations that respect user preferences
 * Returns animation variants that automatically disable for users who prefer reduced motion
 */
export function useAnimations() {
  const shouldReduceMotion = useReducedMotion();

  const variants = useMemo(() => {
    // If user prefers reduced motion, return instant transitions
    if (shouldReduceMotion) {
      return {
        // Fade in without movement
        fadeIn: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0 },
        },
        // Slide up without movement
        slideUp: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0 },
        },
        // Scale without movement
        scale: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0 },
        },
        // No stagger
        staggerContainer: {
          animate: {},
        },
        staggerItem: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        },
      };
    }

    // Full animations for users who don't prefer reduced motion
    return {
      fadeIn: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.6, ease: 'easeOut' },
      },
      slideUp: {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 40 },
        transition: { duration: 0.8, ease: 'easeOut' },
      },
      slideLeft: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
        transition: { duration: 0.8, ease: 'easeOut' },
      },
      slideRight: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 },
        transition: { duration: 0.8, ease: 'easeOut' },
      },
      scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.6, ease: 'easeOut' },
      },
      staggerContainer: {
        animate: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      },
      staggerItem: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      },
    };
  }, [shouldReduceMotion]);

  const getStaggerDelay = (index: number) => {
    if (shouldReduceMotion) return 0;
    return index * 0.1;
  };

  const getTransition = (duration: number = 0.6) => {
    if (shouldReduceMotion) return { duration: 0 };
    return { duration, ease: 'easeOut' };
  };

  return {
    shouldReduceMotion,
    variants,
    getStaggerDelay,
    getTransition,
  };
}

/**
 * Common viewport settings for whileInView animations
 */
export const viewportSettings = {
  once: true,
  margin: '-50px',
};

/**
 * Hover animation for cards (only if not reduced motion)
 */
export function useHoverAnimation() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {
      whileHover: {},
      whileTap: {},
    };
  }

  return {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 },
  };
}
