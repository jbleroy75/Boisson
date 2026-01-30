import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

interface ContactFormData {
  companyName: string;
  siret: string;
  contactName: string;
  email: string;
  phone: string;
  estimatedVolume: string;
  region: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      siret,
      contactName,
      email,
      phone,
      estimatedVolume,
      region,
      message,
    } = body as ContactFormData;

    // Validate required fields
    const requiredFields = {
      companyName,
      siret,
      contactName,
      email,
      phone,
      estimatedVolume,
      region,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || !value.trim()) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate SIRET (14 digits)
    const siretClean = siret.replace(/\s/g, '');
    if (!/^\d{14}$/.test(siretClean)) {
      return NextResponse.json(
        { error: 'SIRET must be 14 digits' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Store the contact request
    const { data, error } = await supabase
      .from('b2b_contact_requests')
      .insert({
        company_name: companyName.trim(),
        siret: siretClean,
        contact_name: contactName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        estimated_volume: estimatedVolume,
        region,
        message: message?.trim() || null,
        status: 'new',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A request with this email already exists. Our team will contact you soon.' },
          { status: 409 }
        );
      }
      console.error('Error saving contact request:', error);
      return NextResponse.json(
        { error: 'Failed to submit request' },
        { status: 500 }
      );
    }

    // TODO: Send notification email to B2B team
    // TODO: Send confirmation email to the requester

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      requestId: data.id,
    });
  } catch (error) {
    console.error('Error in POST /api/b2b/contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
