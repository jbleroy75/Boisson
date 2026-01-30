'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

interface ImageDistortionProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  effect?: 'wave' | 'glitch' | 'ripple' | 'zoom';
}

export default function ImageDistortion({
  src,
  alt,
  width,
  height,
  className = '',
  effect = 'wave',
}: ImageDistortionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = (e.clientX - rect.left) / rect.width - 0.5;
    const centerY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(centerX);
    mouseY.set(centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const getEffectStyle = () => {
    switch (effect) {
      case 'wave':
        return {
          filter: isHovered ? 'url(#wave-filter)' : 'none',
        };
      case 'glitch':
        return {};
      case 'ripple':
        return {
          filter: isHovered ? 'url(#ripple-filter)' : 'none',
        };
      case 'zoom':
        return {};
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* SVG Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          {/* Wave filter */}
          <filter id="wave-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Ripple filter */}
          <filter id="ripple-filter">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <motion.div
        style={{
          rotateX,
          rotateY,
          ...getEffectStyle(),
        }}
        whileHover={effect === 'zoom' ? { scale: 1.05 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Glitch effect layers */}
        {effect === 'glitch' && isHovered && (
          <>
            <motion.div
              className="absolute inset-0 z-10 mix-blend-multiply"
              style={{ backgroundColor: 'cyan' }}
              animate={{ x: [-2, 2, -2], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </motion.div>
            <motion.div
              className="absolute inset-0 z-10 mix-blend-multiply"
              style={{ backgroundColor: 'red' }}
              animate={{ x: [2, -2, 2], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 0.15, repeat: Infinity }}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </motion.div>
          </>
        )}

        {/* Main image */}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover transition-all duration-300"
        />

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%', opacity: 0 }}
          animate={isHovered ? { x: '100%', opacity: 1 } : { x: '-100%', opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
}

// Parallax tilt card
export function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
    >
      {children}

      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          background: useTransform(
            [x, y],
            ([latestX, latestY]) =>
              `radial-gradient(circle at ${(latestX as number + 0.5) * 100}% ${(latestY as number + 0.5) * 100}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
          ),
        }}
      />
    </motion.div>
  );
}
