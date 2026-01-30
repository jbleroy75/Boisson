import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, STRIPE_WEBHOOK_EVENTS } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendPaymentFailedEmail } from '@/lib/email';
import type Stripe from 'stripe';

// Disable body parsing, we need the raw body for signature verification
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.instance.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  try {
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.CHECKOUT_COMPLETED: {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, supabase);
        break;
      }

      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_CREATED: {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription, supabase);
        break;
      }

      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, supabase);
        break;
      }

      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_DELETED: {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabase);
        break;
      }

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAID: {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice, supabase);
        break;
      }

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED: {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  const { metadata, customer, subscription } = session;

  if (!metadata?.userId || metadata.userId === 'guest') {
    console.log('Checkout completed for guest user');
    return;
  }

  // Update pending subscription status
  await supabase
    .from('pending_subscriptions')
    .update({ status: 'completed' })
    .eq('stripe_session_id', session.id);

  // Create subscription record
  await supabase.from('subscriptions').upsert({
    user_id: metadata.userId,
    stripe_customer_id: customer as string,
    stripe_subscription_id: subscription as string,
    tier_id: metadata.tierId,
    flavor_mix: metadata.flavorMix ? JSON.parse(metadata.flavorMix) : null,
    status: 'active',
    created_at: new Date().toISOString(),
  });

  console.log(`Subscription created for user ${metadata.userId}`);
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  const { metadata, customer, id, status } = subscription;
  // Access period dates from the subscription object
  const subData = subscription as unknown as {
    current_period_start: number;
    current_period_end: number;
  };

  if (metadata?.userId) {
    await supabase.from('subscriptions').upsert({
      user_id: metadata.userId,
      stripe_customer_id: customer as string,
      stripe_subscription_id: id,
      tier_id: metadata.tierId,
      status: status,
      current_period_start: new Date(subData.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
    });
  }

  console.log(`Subscription ${id} created with status ${status}`);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  const { id, status, cancel_at_period_end } = subscription;
  // Access period dates from the subscription object
  const subData = subscription as unknown as {
    current_period_start: number;
    current_period_end: number;
  };

  await supabase
    .from('subscriptions')
    .update({
      status: cancel_at_period_end ? 'canceling' : status,
      current_period_start: new Date(subData.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', id);

  console.log(`Subscription ${id} updated to status ${status}`);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  const { id } = subscription;

  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', id);

  console.log(`Subscription ${id} canceled`);
}

async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  // Access invoice properties with type assertion
  const invoiceData = invoice as unknown as {
    subscription: string | null;
    customer: string;
    amount_paid: number;
    hosted_invoice_url: string | null;
  };

  if (invoiceData.subscription) {
    // Record payment in subscription_payments table
    await supabase.from('subscription_payments').insert({
      stripe_subscription_id: invoiceData.subscription,
      stripe_customer_id: invoiceData.customer,
      amount: invoiceData.amount_paid,
      invoice_url: invoiceData.hosted_invoice_url,
      status: 'paid',
      paid_at: new Date().toISOString(),
    });

    console.log(`Invoice paid for subscription ${invoiceData.subscription}`);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  // Access invoice properties with type assertion
  const invoiceData = invoice as unknown as {
    subscription: string | null;
    customer: string;
    amount_due: number;
  };

  if (invoiceData.subscription) {
    // Update subscription status
    await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoiceData.subscription);

    // Get user details from subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', invoiceData.subscription)
      .single();

    if (subscription?.user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', subscription.user_id)
        .single();

      if (user) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamarque.com';
        await sendPaymentFailedEmail({
          email: user.email,
          name: user.name,
          subscriptionId: invoiceData.subscription,
          amount: invoiceData.amount_due / 100, // Convert from cents
          retryUrl: `${siteUrl}/account/subscription?retry=true`,
        });
      }
    }

    console.log(`Invoice payment failed for subscription ${invoiceData.subscription}`);
  }
}
