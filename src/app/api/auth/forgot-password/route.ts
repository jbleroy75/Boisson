import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // In production, this would:
    // 1. Check if user exists in database
    // 2. Generate a secure reset token
    // 3. Store token with expiration in database
    // 4. Send reset email via Resend/SendGrid

    // For now, we just simulate success
    // Always return success to prevent email enumeration attacks
    console.log(`Password reset requested for: ${email}`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // TODO: Implement actual password reset logic
    // Example with Supabase:
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    // });

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
