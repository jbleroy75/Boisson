import { describe, it, expect } from 'vitest';
import {
  contactSchema,
  newsletterSchema,
  loginSchema,
  registerSchema,
  profileSchema,
} from '@/lib/validations';

describe('contactSchema', () => {
  it('validates correct data', () => {
    const result = contactSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      subject: 'Question sur ma commande',
      message: 'Bonjour, je souhaite savoir où en est ma commande.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Jean',
      email: 'invalid-email',
      subject: 'Test subject',
      message: 'This is a long enough message for validation.',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short name', () => {
    const result = contactSchema.safeParse({
      name: 'J',
      email: 'jean@example.com',
      subject: 'Test subject',
      message: 'This is a long enough message for validation.',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short message', () => {
    const result = contactSchema.safeParse({
      name: 'Jean',
      email: 'jean@example.com',
      subject: 'Test subject',
      message: 'Too short',
    });
    expect(result.success).toBe(false);
  });
});

describe('newsletterSchema', () => {
  it('validates correct email', () => {
    const result = newsletterSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = newsletterSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('validates correct credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('validates correct registration', () => {
    const result = registerSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects password without uppercase', () => {
    const result = registerSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      password: 'password1',
      confirmPassword: 'password1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without number', () => {
    const result = registerSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      password: 'Password',
      confirmPassword: 'Password',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      password: 'Password1',
      confirmPassword: 'Password2',
    });
    expect(result.success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('validates profile with optional fields', () => {
    const result = profileSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('validates profile with address', () => {
    const result = profileSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      address: {
        street: '123 Rue de Paris',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid postal code', () => {
    const result = profileSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      address: {
        postalCode: '123', // Should be 5 digits
      },
    });
    expect(result.success).toBe(false);
  });
});
