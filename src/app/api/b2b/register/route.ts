import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { sendB2BRegistrationEmail, sendB2BAdminNotification } from '@/lib/email';

const b2bRegisterSchema = z.object({
  companyName: z.string().min(2).max(200),
  siret: z.string().regex(/^\d{14}$/),
  contactName: z.string().min(2).max(100),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().min(10).max(20),
  companyType: z.enum(['retailer', 'gym', 'distributor', 'hotel_restaurant', 'other']),
  estimatedVolume: z.enum(['100-500', '500-1000', '1000-5000', '5000+']),
  billingAddress: z.object({
    street: z.string().min(5).max(200),
    city: z.string().min(2).max(100),
    postalCode: z.string().regex(/^\d{5}$/),
  }),
  deliveryAddress: z.object({
    sameAsBilling: z.boolean(),
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  message: z.string().max(2000).optional(),
  acceptTerms: z.boolean().refine((val) => val === true),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = b2bRegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check if company already registered
    const { data: existing } = await supabase
      .from('b2b_clients')
      .select('id, status')
      .eq('siret', data.siret)
      .single();

    if (existing) {
      if (existing.status === 'pending') {
        return NextResponse.json(
          { error: 'Une demande est déjà en cours de traitement pour ce SIRET' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Ce SIRET est déjà enregistré. Contactez-nous si vous avez besoin d\'aide.' },
        { status: 409 }
      );
    }

    // Create B2B client record
    const { data: client, error } = await supabase
      .from('b2b_clients')
      .insert({
        company_name: data.companyName,
        siret: data.siret,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone,
        company_type: data.companyType,
        estimated_volume: data.estimatedVolume,
        billing_address: data.billingAddress,
        delivery_address: data.deliveryAddress.sameAsBilling
          ? data.billingAddress
          : data.deliveryAddress,
        message: data.message,
        status: 'pending',
        pricing_tier: determinePricingTier(data.estimatedVolume),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('B2B registration error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }

    // Send confirmation email to client
    try {
      await sendB2BRegistrationEmail({
        to: data.email,
        companyName: data.companyName,
        contactName: data.contactName,
      });
    } catch (emailError) {
      console.error('B2B confirmation email error:', emailError);
    }

    // Send notification to admin
    try {
      await sendB2BAdminNotification({
        clientId: client.id,
        companyName: data.companyName,
        email: data.email,
        companyType: data.companyType,
        estimatedVolume: data.estimatedVolume,
      });
    } catch (emailError) {
      console.error('B2B admin notification error:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Demande enregistrée avec succès',
      clientId: client.id,
    });
  } catch (error) {
    console.error('B2B registration error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

function determinePricingTier(volume: string): string {
  switch (volume) {
    case '5000+':
      return 'enterprise';
    case '1000-5000':
      return 'premium';
    case '500-1000':
      return 'standard';
    default:
      return 'starter';
  }
}
