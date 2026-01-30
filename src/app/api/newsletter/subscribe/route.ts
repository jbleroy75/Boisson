import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendNewsletterWelcome } from '@/lib/email';

const subscribeSchema = z.object({
  email: z.string().email('Email invalide'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = createServerSupabaseClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json({
          success: true,
          message: 'Vous êtes déjà inscrit(e) à notre newsletter !',
          alreadySubscribed: true,
        });
      }
      // Reactivate unsubscribed user
      await supabase
        .from('newsletter_subscribers')
        .update({ status: 'active', resubscribed_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      // New subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: normalizedEmail,
          status: 'active',
          source: 'website_footer',
          subscribed_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error saving newsletter subscription:', insertError);
        // Continue even if DB save fails - we'll still send the welcome email
      }
    }

    // Send welcome email
    await sendNewsletterWelcome(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: 'Merci pour votre inscription ! Vérifiez votre boîte mail.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email invalide', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
