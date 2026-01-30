'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';

interface LiquidAnimationProps {
  color?: string;
  secondaryColor?: string;
  className?: string;
  intensity?: number;
  speed?: number;
}

// SVG filter-based liquid effect
export default function LiquidAnimation({
  color = '#FF6B35',
  secondaryColor = '#FF1493',
  className = '',
  intensity = 30,
  speed = 3,
}: LiquidAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* SVG Filter for liquid effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquid-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur={`${speed}s`}
                values="0.01;0.02;0.01"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={intensity}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Animated blobs */}
      <motion.div
        className="absolute inset-0"
        style={{ filter: 'url(#liquid-filter)' }}
        animate={isInView ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute w-32 h-32 rounded-full blur-xl"
          style={{ backgroundColor: color, opacity: 0.6 }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: speed * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full blur-xl right-0 bottom-0"
          style={{ backgroundColor: secondaryColor, opacity: 0.6 }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: speed * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
}

// Liquid button effect
export function LiquidButton({
  children,
  className = '',
  color = '#FF6B35',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  onClick?: () => void;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Liquid blob that follows cursor */}
      <motion.div
        className="absolute w-40 h-40 rounded-full blur-2xl pointer-events-none"
        style={{
          backgroundColor: color,
          opacity: 0.4,
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Liquid fill effect for bottles
export function LiquidFill({
  fillPercent = 75,
  color = '#FF6B35',
  className = '',
}: {
  fillPercent?: number;
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Wave SVG */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ height: '0%' }}
        animate={isInView ? { height: `${fillPercent}%` } : {}}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{ backgroundColor: color }}
      >
        {/* Animated wave on top */}
        <svg
          className="absolute -top-3 left-0 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            fill={color}
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            animate={{
              d: [
                'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z',
                'M0,0V15.81C47.64,35.53,103.14,45.89,158,41.61c70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,9,1113-30.29,1200,37.47V0Z',
                'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
