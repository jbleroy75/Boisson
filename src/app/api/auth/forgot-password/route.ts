import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes, createHash } from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendPasswordResetEmail } from '@/lib/email';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

// Token expires in 1 hour
const TOKEN_EXPIRY_HOURS = 1;

function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);
    const normalizedEmail = email.trim().toLowerCase();

    const supabase = createServerSupabaseClient();

    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', normalizedEmail)
      .single();

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate secure token
      const resetToken = generateSecureToken();
      const hashedToken = hashToken(resetToken);
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Invalidate any existing reset tokens for this user
      await supabase
        .from('password_reset_tokens')
        .update({ used: true })
        .eq('user_id', user.id)
        .eq('used', false);

      // Store the hashed token
      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .insert({
          user_id: user.id,
          token_hash: hashedToken,
          expires_at: expiresAt.toISOString(),
          used: false,
          created_at: new Date().toISOString(),
        });

      if (tokenError) {
        console.error('Error storing reset token:', tokenError);
        // Continue anyway - log the error but don't expose to user
      }

      // Build reset URL with the raw token (not hashed)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamarque.com';
      const resetUrl = `${siteUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

      // Send reset email
      await sendPasswordResetEmail({
        email: normalizedEmail,
        name: user.name,
        resetToken,
        resetUrl,
      });

      console.log(`Password reset email sent to: ${normalizedEmail}`);
    } else {
      console.log(`Password reset requested for non-existent email: ${normalizedEmail}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email invalide', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Forgot password error:', error);

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    });
  }
}
