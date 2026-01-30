import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js image
vi.mock('next/image', () => ({
  default: function MockImage(props: { src: string; alt: string; [key: string]: unknown }) {
    return React.createElement('img', props);
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: function MockDiv(props: { children?: React.ReactNode; [key: string]: unknown }) {
      return React.createElement('div', props, props.children);
    },
    span: function MockSpan(props: { children?: React.ReactNode; [key: string]: unknown }) {
      return React.createElement('span', props, props.children);
    },
    button: function MockButton(props: { children?: React.ReactNode; [key: string]: unknown }) {
      return React.createElement('button', props, props.children);
    },
  },
  AnimatePresence: function MockAnimatePresence(props: { children?: React.ReactNode }) {
    return React.createElement(React.Fragment, null, props.children);
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
