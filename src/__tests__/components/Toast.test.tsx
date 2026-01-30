import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { showToast, ToastProvider } from '@/components/ui/Toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => {
  const mockFns = {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    custom: vi.fn(),
    dismiss: vi.fn(),
  };
  return {
    __esModule: true,
    default: mockFns,
    toast: mockFns,
    Toaster: () => React.createElement('div', { 'data-testid': 'toaster' }),
  };
});

describe('Toast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ToastProvider', () => {
    it('renders Toaster component', () => {
      render(React.createElement(ToastProvider));
      expect(screen.getByTestId('toaster')).toBeDefined();
    });
  });

  describe('showToast', () => {
    it('has success method', () => {
      expect(typeof showToast.success).toBe('function');
    });

    it('has error method', () => {
      expect(typeof showToast.error).toBe('function');
    });

    it('has loading method', () => {
      expect(typeof showToast.loading).toBe('function');
    });

    it('has cart method', () => {
      expect(typeof showToast.cart).toBe('function');
    });

    it('has subscription method', () => {
      expect(typeof showToast.subscription).toBe('function');
    });

    it('has loyalty method', () => {
      expect(typeof showToast.loyalty).toBe('function');
    });
  });
});
