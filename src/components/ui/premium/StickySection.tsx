'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StickySectionProps {
  children: React.ReactNode;
  className?: string;
  height?: string; // e.g., '200vh' for 2x viewport height
  backgroundColor?: string;
}

export default function StickySection({
  children,
  className = '',
  height = '200vh',
  backgroundColor = 'transparent',
}: StickySectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      className={`relative ${className}`}
      style={{ height, backgroundColor }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">{children}</div>
    </section>
  );
}

// Horizontal scroll section
export function HorizontalScrollSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div
          ref={containerRef}
          className={`flex gap-8 ${className}`}
          style={{ x }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

// Parallax layers section
interface ParallaxLayer {
  content: React.ReactNode;
  speed: number; // 0 = fixed, 1 = normal scroll, <1 = slower, >1 = faster
  className?: string;
}

export function ParallaxSection({
  layers,
  className = '',
  height = '100vh',
}: {
  layers: ParallaxLayer[];
  className?: string;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {layers.map((layer, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [`${layer.speed * -50}%`, `${layer.speed * 50}%`]
        );

        return (
          <motion.div
            key={index}
            className={`absolute inset-0 ${layer.className || ''}`}
            style={{ y }}
          >
            {layer.content}
          </motion.div>
        );
      })}
    </section>
  );
}

// Scale reveal section
export function ScaleRevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [48, 0]);

  return (
    <motion.section
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{
        scale,
        opacity,
        borderRadius,
      }}
    >
      {children}
    </motion.section>
  );
}

// Reveal on scroll with clip path
export function ClipRevealSection({
  children,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const getClipPath = () => {
    switch (direction) {
      case 'up':
        return useTransform(
          scrollYProgress,
          [0, 1],
          ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']
        );
      case 'down':
        return useTransform(
          scrollYProgress,
          [0, 1],
          ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
        );
      case 'left':
        return useTransform(
          scrollYProgress,
          [0, 1],
          ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
        );
      case 'right':
        return useTransform(
          scrollYProgress,
          [0, 1],
          ['inset(0 0 0 100%)', 'inset(0 0 0 0%)']
        );
    }
  };

  const clipPath = getClipPath();

  return (
    <motion.section
      ref={ref}
      className={className}
      style={{ clipPath }}
    >
      {children}
    </motion.section>
  );
}
