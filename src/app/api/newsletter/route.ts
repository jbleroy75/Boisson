import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';

const newsletterSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Re-subscribe
        await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'subscribed',
            resubscribed_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      }

      return NextResponse.json({ success: true, message: 'Déjà inscrit' });
    }

    // Add new subscriber
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email,
      status: 'subscribed',
      source: 'website',
      subscribed_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Newsletter subscription error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      await sendWelcomeEmail({
        to: email,
        name: email.split('@')[0],
      });
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Verify token (simple hash verification)
    const expectedToken = Buffer.from(email + process.env.NEXTAUTH_SECRET)
      .toString('base64')
      .slice(0, 32);

    if (token !== expectedToken) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase());

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la désinscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Désinscription réussie' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
