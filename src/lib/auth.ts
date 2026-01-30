import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { createServerSupabaseClient } from './supabase';
import {
  recordFailedAttempt,
  isAccountLocked,
  clearLockout,
  SECURITY_CONFIG,
} from './security';
import type { UserRole } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const email = credentials.email.toLowerCase().trim();

        // Check if account is locked
        const lockoutStatus = isAccountLocked(email);
        if (lockoutStatus.isLocked) {
          const remainingMinutes = lockoutStatus.lockedUntil
            ? Math.ceil((lockoutStatus.lockedUntil - Date.now()) / 60000)
            : 15;
          throw new Error(`Compte temporairement bloqué. Réessayez dans ${remainingMinutes} minutes.`);
        }

        const supabase = createServerSupabaseClient();
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !user) {
          // Record failed attempt even if user doesn't exist (prevent enumeration)
          recordFailedAttempt(email);
          throw new Error('Identifiants invalides');
        }

        if (!user.password_hash) {
          throw new Error('Veuillez vous connecter avec Google');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) {
          const lockoutResult = recordFailedAttempt(email);

          if (lockoutResult.isLocked) {
            throw new Error('Trop de tentatives échouées. Compte temporairement bloqué pour 15 minutes.');
          }

          if (lockoutResult.attemptsRemaining <= 2) {
            throw new Error(`Identifiants invalides. ${lockoutResult.attemptsRemaining} tentative(s) restante(s).`);
          }

          throw new Error('Identifiants invalides');
        }

        // Clear lockout on successful login
        clearLockout(email);

        // Update last login timestamp
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const supabase = createServerSupabaseClient();

        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email!)
          .single();

        if (!existingUser) {
          // Create new user
          const { error } = await supabase.from('users').insert({
            email: user.email!,
            name: user.name,
            role: 'customer',
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          });

          if (error) {
            console.error('Error creating user:', error);
            return false;
          }
        } else {
          // Update last login
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', existingUser.id);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }

      // Handle session update
      if (trigger === 'update') {
        // Refresh user data from database
        const supabase = createServerSupabaseClient();
        const { data: freshUser } = await supabase
          .from('users')
          .select('role, name')
          .eq('id', token.id)
          .single();

        if (freshUser) {
          token.role = freshUser.role;
          token.name = freshUser.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login',
  },
  session: {
    strategy: 'jwt',
    // Reduced session duration for security (24 hours instead of 30 days)
    maxAge: SECURITY_CONFIG.SESSION_MAX_AGE,
    // Update session every 15 minutes
    updateAge: 15 * 60,
  },
  jwt: {
    // JWT max age matches session
    maxAge: SECURITY_CONFIG.SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Host-next-auth.csrf-token'
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`[AUTH] User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`[AUTH] User signed out: ${token?.email}`);
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Hash password with bcrypt
 * Uses configurable salt rounds for security
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SECURITY_CONFIG.PASSWORD_SALT_ROUNDS);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + SECURITY_CONFIG.PASSWORD_RESET_TOKEN_EXPIRY_MS);

  return { token, hashedToken, expiresAt };
}

/**
 * Verify password reset token
 */
export function verifyPasswordResetToken(token: string, hashedToken: string): boolean {
  const crypto = require('crypto');
  const hashToCompare = crypto.createHash('sha256').update(token).digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hashToCompare),
      Buffer.from(hashedToken)
    );
  } catch {
    return false;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(userRole);
}

/**
 * Role hierarchy for permission checking
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  customer: 1,
  distributor: 2,
  admin: 3,
};

/**
 * Check if user has at least the required role level
 */
export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}
