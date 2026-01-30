import { z } from 'zod';

// ==========================================
// Common validation patterns
// ==========================================

const emailSchema = z.string()
  .email('Adresse email invalide')
  .max(255, 'Email trop long')
  .transform(val => val.toLowerCase().trim());

const phoneSchema = z.string()
  .min(10, 'Numéro de téléphone invalide')
  .max(20, 'Numéro de téléphone trop long')
  .regex(/^[0-9+\-.\s()]+$/, 'Format de téléphone invalide');

const postalCodeSchema = z.string()
  .regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)');

const siretSchema = z.string()
  .regex(/^\d{14}$/, 'Le SIRET doit contenir 14 chiffres');

const passwordSchema = z.string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe est trop long')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

const strongPasswordSchema = passwordSchema
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un caractère spécial');

// Sanitize text input - removes potential XSS
const sanitizedString = (minLength = 1, maxLength = 1000) =>
  z.string()
    .min(minLength, `Minimum ${minLength} caractères`)
    .max(maxLength, `Maximum ${maxLength} caractères`)
    .transform(val => val.trim())
    // Basic XSS prevention - remove script tags and event handlers
    .refine(
      val => !/<script|javascript:|on\w+=/i.test(val),
      'Contenu non autorisé détecté'
    );

// ==========================================
// Contact form
// ==========================================

export const contactSchema = z.object({
  name: sanitizedString(2, 100),
  email: emailSchema,
  subject: sanitizedString(5, 200),
  message: sanitizedString(20, 5000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ==========================================
// Newsletter signup
// ==========================================

export const newsletterSchema = z.object({
  email: emailSchema,
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// ==========================================
// Authentication
// ==========================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis').max(128),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: sanitizedString(2, 100),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions générales',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>;

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'Le nouveau mot de passe doit être différent',
  path: ['newPassword'],
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ==========================================
// Profile
// ==========================================

export const profileSchema = z.object({
  name: sanitizedString(2, 100),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  address: z.object({
    street: sanitizedString(1, 200).optional().or(z.literal('')),
    city: sanitizedString(1, 100).optional().or(z.literal('')),
    postalCode: postalCodeSchema.optional().or(z.literal('')),
    country: z.string().max(100).optional().or(z.literal('')),
  }).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ==========================================
// B2B Registration
// ==========================================

export const b2bRegisterSchema = z.object({
  companyName: sanitizedString(2, 200),
  siret: siretSchema,
  contactName: sanitizedString(2, 100),
  email: emailSchema,
  phone: phoneSchema,
  region: z.string().min(1, 'La région est requise').max(100),
  billingAddress: z.object({
    street: sanitizedString(5, 200),
    city: sanitizedString(2, 100),
    postalCode: postalCodeSchema,
  }),
  message: sanitizedString(0, 2000).optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions générales',
  }),
});

export type B2BRegisterFormData = z.infer<typeof b2bRegisterSchema>;

// ==========================================
// B2B Contact
// ==========================================

export const b2bContactSchema = z.object({
  companyName: sanitizedString(2, 200),
  siret: siretSchema,
  contactName: sanitizedString(2, 100),
  email: emailSchema,
  phone: phoneSchema,
  region: z.string().min(1, 'La région est requise').max(100),
  message: sanitizedString(10, 2000).optional(),
});

export type B2BContactFormData = z.infer<typeof b2bContactSchema>;

// ==========================================
// B2B Order
// ==========================================

const orderItemSchema = z.object({
  productId: z.string().min(1, 'ID produit requis'),
  quantity: z.number()
    .int('La quantité doit être un entier')
    .min(1, 'Quantité minimale: 1')
    .max(100000, 'Quantité maximale dépassée'),
});

export const b2bOrderSchema = z.object({
  items: z.array(orderItemSchema)
    .min(1, 'Au moins un produit requis')
    .max(50, 'Maximum 50 produits par commande'),
  deliveryAddress: z.object({
    street: sanitizedString(5, 200),
    city: sanitizedString(2, 100),
    postalCode: postalCodeSchema,
  }),
  notes: sanitizedString(0, 1000).optional(),
}).refine(
  (data) => {
    const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
    return totalQuantity >= 100;
  },
  {
    message: 'Commande minimum: 100 unités',
    path: ['items'],
  }
);

export type B2BOrderFormData = z.infer<typeof b2bOrderSchema>;

// ==========================================
// Review
// ==========================================

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Note minimale: 1').max(5, 'Note maximale: 5'),
  title: sanitizedString(3, 100).optional(),
  comment: sanitizedString(10, 2000),
  productId: z.string().min(1, 'ID produit requis'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ==========================================
// Subscription
// ==========================================

export const subscriptionSchema = z.object({
  tierId: z.enum(['starter', 'athlete', 'team'], {
    message: 'Formule invalide',
  }),
  flavorMix: z.record(z.string(), z.number().int().min(0).max(100))
    .optional()
    .refine(
      (mix) => {
        if (!mix) return true;
        const total = Object.values(mix).reduce((sum, qty) => sum + qty, 0);
        return total > 0;
      },
      { message: 'Sélectionnez au moins une saveur' }
    ),
  billingInterval: z.enum(['month', 'year']).optional().default('month'),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

// ==========================================
// Pack Configurator
// ==========================================

export const packConfigSchema = z.object({
  size: z.enum(['6', '12', '24', '48'], {
    message: 'Taille de pack invalide',
  }),
  flavors: z.record(z.string(), z.number().int().min(0))
    .refine(
      (flavors) => {
        const total = Object.values(flavors).reduce((sum, qty) => sum + qty, 0);
        return total > 0;
      },
      { message: 'Sélectionnez au moins une saveur' }
    ),
});

export type PackConfigFormData = z.infer<typeof packConfigSchema>;

// ==========================================
// GDPR / Privacy
// ==========================================

export const gdprConsentSchema = z.object({
  necessary: z.literal(true), // Always required
  analytics: z.boolean(),
  marketing: z.boolean(),
});

export type GDPRConsentFormData = z.infer<typeof gdprConsentSchema>;

export const dataExportRequestSchema = z.object({
  email: emailSchema,
  type: z.enum(['export', 'delete']),
  reason: sanitizedString(0, 500).optional(),
});

export type DataExportRequestFormData = z.infer<typeof dataExportRequestSchema>;

// ==========================================
// API Query Parameters
// ==========================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export const searchSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.string().max(50).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
}).merge(paginationSchema);

export type SearchParams = z.infer<typeof searchSchema>;

// ==========================================
// Utility functions
// ==========================================

/**
 * Safely parse and validate data
 * Returns typed result or null on error
 */
export function safeParse<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Format Zod errors for API responses
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }

  return errors;
}

/**
 * Validate request body with schema
 * Throws standardized error for invalid input
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ValidationError('Invalid JSON body');
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    throw new ValidationError('Validation failed', formatZodErrors(result.error));
  }

  return result.data;
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }

  toJSON() {
    return {
      error: this.message,
      details: this.errors,
    };
  }
}
