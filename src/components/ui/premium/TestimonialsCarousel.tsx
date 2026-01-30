'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';

interface Testimonial {
  id: string;
  author: string;
  role?: string;
  avatar?: string;
  content: string;
  rating: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function TestimonialsCarousel({
  testimonials,
  className = '',
  autoPlay = true,
  autoPlayInterval = 5000,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = testimonials.length - 1;
      if (next >= testimonials.length) next = 0;
      return next;
    });
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      paginate(-1);
    } else if (info.offset.x < -threshold) {
      paginate(1);
    }
  };

  // Auto play
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Main carousel */}
      <div className="relative h-[400px] md:h-[350px] overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <div className="h-full flex flex-col items-center justify-center px-8 text-center">
              {/* Rating stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    className={`w-6 h-6 ${i < currentTestimonial.rating ? 'text-[#FFD700]' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>

              {/* Quote */}
              <motion.blockquote
                className="text-xl md:text-2xl font-medium text-gray-800 max-w-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                &ldquo;{currentTestimonial.content}&rdquo;
              </motion.blockquote>

              {/* Author */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentTestimonial.avatar ? (
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#FF6B35]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF1493] flex items-center justify-center text-white text-xl font-bold">
                    {currentTestimonial.author.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <div className="font-bold text-gray-900">{currentTestimonial.author}</div>
                  {currentTestimonial.role && (
                    <div className="text-sm text-gray-500">{currentTestimonial.role}</div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-[#FF6B35] hover:scale-110 transition-all"
        aria-label="Témoignage précédent"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-[#FF6B35] hover:scale-110 transition-all"
        aria-label="Témoignage suivant"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-[#FF6B35]'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Aller au témoignage ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <motion.div
            className="h-full bg-[#FF6B35]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: autoPlayInterval / 1000,
              ease: 'linear',
            }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
}

// Infinite scroll testimonials
export function InfiniteTestimonials({
  testimonials,
  speed = 30,
  direction = 'left',
}: {
  testimonials: Testimonial[];
  speed?: number;
  direction?: 'left' | 'right';
}) {
  const duplicated = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6"
        animate={{
          x: direction === 'left' ? [0, -50 * testimonials.length + '%'] : [-50 * testimonials.length + '%', 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {duplicated.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-shrink-0 w-[350px] bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < testimonial.rating ? 'text-[#FFD700]' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">&ldquo;{testimonial.content}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF1493] flex items-center justify-center text-white font-bold">
                {testimonial.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                {testimonial.role && (
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
