import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, slugify, truncate, getInitials, cn } from '@/lib/utils';

describe('formatPrice', () => {
  it('formats price in EUR by default', () => {
    expect(formatPrice(29.99)).toBe('29,99\u00A0€');
  });

  it('handles whole numbers', () => {
    expect(formatPrice(100)).toBe('100,00\u00A0€');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('0,00\u00A0€');
  });
});

describe('formatDate', () => {
  it('formats date in French locale', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('janvier');
    expect(result).toContain('2024');
  });

  it('handles Date objects', () => {
    const date = new Date('2024-06-20');
    const result = formatDate(date);
    expect(result).toContain('juin');
    expect(result).toContain('2024');
  });
});

describe('slugify', () => {
  it('converts text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes accents', () => {
    expect(slugify('Café Résumé')).toBe('cafe-resume');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('--Hello World--')).toBe('hello-world');
  });
});

describe('truncate', () => {
  it('truncates long text', () => {
    const text = 'This is a very long text that should be truncated';
    expect(truncate(text, 20)).toBe('This is a very long...');
  });

  it('does not truncate short text', () => {
    const text = 'Short text';
    expect(truncate(text, 20)).toBe('Short text');
  });

  it('handles exact length', () => {
    const text = 'Exact';
    expect(truncate(text, 5)).toBe('Exact');
  });
});

describe('getInitials', () => {
  it('returns two letter initials', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('handles single name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('handles multiple names', () => {
    expect(getInitials('Jean Paul Belmondo')).toBe('JP');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges Tailwind classes correctly', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });
});
