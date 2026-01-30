'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface NumberCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
  decimals?: number;
  once?: boolean;
}

export default function NumberCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  delay = 0,
  className = '',
  decimals = 0,
  once = true,
}: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(0, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) => {
    return current.toFixed(decimals);
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(() => {
        spring.set(value);
        setHasAnimated(true);
      }, delay * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isInView, value, delay, spring, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

// Animated stats component
interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  color?: string;
}

export function AnimatedStats({
  stats,
  className = '',
}: {
  stats: StatItem[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={`flex flex-wrap gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="text-center"
        >
          <div
            className="text-4xl md:text-5xl font-bold"
            style={{ color: stat.color || '#FF6B35' }}
          >
            <NumberCounter
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              delay={index * 0.2}
            />
          </div>
          <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
