'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  hoverType: 'default' | 'link' | 'button' | 'image' | 'text';
  text?: string;
}

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    hoverType: 'default',
  });
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device has fine pointer (not touch)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => {
      setCursorState((prev) => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      setCursorState((prev) => ({ ...prev, isClicking: false }));
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('a, button, [role="button"]')) {
        setCursorState((prev) => ({ ...prev, isHovering: true, hoverType: 'button' }));
      } else if (target.closest('img, video, [data-cursor="image"]')) {
        setCursorState((prev) => ({ ...prev, isHovering: true, hoverType: 'image' }));
      } else if (target.closest('p, span, h1, h2, h3, h4, h5, h6')) {
        setCursorState((prev) => ({ ...prev, isHovering: true, hoverType: 'text' }));
      }

      // Check for custom cursor text
      const cursorText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
      if (cursorText) {
        setCursorState((prev) => ({ ...prev, text: cursorText }));
      }
    };

    const handleMouseLeave = () => {
      setCursorState({
        isHovering: false,
        isClicking: false,
        hoverType: 'default',
        text: undefined,
      });
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Add hover listeners to interactive elements
    document.querySelectorAll('a, button, [role="button"], img, video, [data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter as EventListener);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const getCursorSize = () => {
    if (cursorState.isClicking) return 8;
    if (cursorState.isHovering) return 60;
    return 20;
  };

  const getCursorColor = () => {
    switch (cursorState.hoverType) {
      case 'button':
        return 'rgba(255, 107, 53, 0.3)';
      case 'image':
        return 'rgba(0, 217, 165, 0.3)';
      default:
        return 'rgba(255, 107, 53, 0.2)';
    }
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FF6B35] flex items-center justify-center"
          animate={{
            width: getCursorSize(),
            height: getCursorSize(),
            backgroundColor: getCursorColor(),
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {cursorState.text && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[10px] font-bold text-white whitespace-nowrap"
            >
              {cursorState.text}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]"
          animate={{
            scale: cursorState.isClicking ? 0 : 1,
          }}
        />
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
