import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Newsletter } from '@/components/newsletter/Newsletter';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock showToast
vi.mock('@/components/ui/Toast', () => ({
  showToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Newsletter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('Inline Variant', () => {
    it('renders with default props', () => {
      render(React.createElement(Newsletter));
      expect(screen.getByRole('textbox')).toBeDefined();
      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeDefined();
    });

    it('renders custom title and description', () => {
      render(
        React.createElement(Newsletter, {
          title: 'Custom Title',
          description: 'Custom description',
        })
      );
      expect(screen.getByText('Custom Title')).toBeDefined();
      expect(screen.getByText('Custom description')).toBeDefined();
    });
  });

  describe('Card Variant', () => {
    it('renders card variant correctly', () => {
      render(React.createElement(Newsletter, { variant: 'card' }));
      expect(screen.getByRole('textbox')).toBeDefined();
    });
  });

  describe('Footer Variant', () => {
    it('renders footer variant correctly', () => {
      render(React.createElement(Newsletter, { variant: 'footer' }));
      expect(screen.getByRole('textbox')).toBeDefined();
      expect(screen.getByRole('button', { name: /ok/i })).toBeDefined();
    });
  });

  describe('Form Validation', () => {
    it('shows error for invalid email', async () => {
      const user = userEvent.setup();
      render(React.createElement(Newsletter));

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /s'inscrire/i });

      await user.type(input, 'invalid-email');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText(/email invalide/i)).toBeDefined();
      });
    });

    it('submits valid email', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const user = userEvent.setup();
      render(React.createElement(Newsletter));

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /s'inscrire/i });

      await user.type(input, 'test@example.com');
      await user.click(button);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' }),
        });
      });
    });
  });

  describe('Success State', () => {
    it('shows success message after subscription', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const user = userEvent.setup();
      render(React.createElement(Newsletter));

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /s'inscrire/i });

      await user.type(input, 'test@example.com');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText(/merci pour votre inscription/i)).toBeDefined();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles API error gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      const { showToast } = await import('@/components/ui/Toast');
      const user = userEvent.setup();
      render(React.createElement(Newsletter));

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /s'inscrire/i });

      await user.type(input, 'test@example.com');
      await user.click(button);

      await waitFor(() => {
        expect(showToast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label on input', () => {
      render(React.createElement(Newsletter));
      const input = screen.getByRole('textbox');
      expect(input.getAttribute('aria-label')).toBe('Adresse email');
    });

    it('input is properly labeled', () => {
      render(React.createElement(Newsletter));
      const input = screen.getByLabelText(/email/i);
      expect(input).toBeDefined();
    });
  });
});
