import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // Check if Resend API key is configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send notification email to admin
      await resend.emails.send({
        from: 'Tamarque Contact <noreply@tamarque.com>',
        to: ['contact@tamarque.com'],
        subject: `[Contact] ${subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      });

      // Send confirmation to user
      await resend.emails.send({
        from: 'Tamarque <noreply@tamarque.com>',
        to: [email],
        subject: 'Nous avons bien reçu votre message - Tamarque',
        html: `
          <h2>Merci pour votre message, ${name} !</h2>
          <p>Nous avons bien reçu votre demande concernant : <strong>${subject}</strong></p>
          <p>Notre équipe vous répondra dans les plus brefs délais (sous 24h ouvrées).</p>
          <hr />
          <p>Récapitulatif de votre message :</p>
          <blockquote style="border-left: 3px solid #FF6B35; padding-left: 15px; color: #666;">
            ${message.replace(/\n/g, '<br />')}
          </blockquote>
          <hr />
          <p>L'équipe Tamarque</p>
        `,
      });
    } else {
      // Development: log to console
      console.log('Contact form submission:', { name, email, subject, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
