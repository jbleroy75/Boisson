import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSubscriptionCheckout, STRIPE_PRICE_IDS } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const { tierId, flavorMix } = body as {
      tierId: keyof typeof STRIPE_PRICE_IDS;
      flavorMix: Record<string, number>;
    };

    // Validate tier
    if (!tierId || !STRIPE_PRICE_IDS[tierId]) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get user email
    const customerEmail = session?.user?.email || undefined;

    // Create the base URL for redirects
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const checkoutSession = await createSubscriptionCheckout({
      tierId,
      customerEmail,
      successUrl: `${baseUrl}/merci?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/subscribe?canceled=true`,
      metadata: {
        userId: session?.user?.id || 'guest',
        flavorMix: JSON.stringify(flavorMix),
      },
    });

    // Store pending subscription in Supabase (optional - for tracking)
    if (session?.user?.id) {
      try {
        const supabase = createServerSupabaseClient();
        await supabase.from('pending_subscriptions').upsert({
          user_id: session.user.id,
          tier_id: tierId,
          flavor_mix: flavorMix,
          stripe_session_id: checkoutSession.id,
          status: 'pending',
          created_at: new Date().toISOString(),
        });
      } catch (dbError) {
        // Log but don't fail - subscription can still proceed
        console.error('Error storing pending subscription:', dbError);
      }
    }

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
