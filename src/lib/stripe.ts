import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

// Subscription tier price IDs (create these in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter',
  athlete: process.env.STRIPE_PRICE_ATHLETE || 'price_athlete',
  team: process.env.STRIPE_PRICE_TEAM || 'price_team',
} as const;

// Create a Stripe Checkout Session for subscriptions
export async function createSubscriptionCheckout(params: {
  tierId: keyof typeof STRIPE_PRICE_IDS;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const { tierId, customerEmail, successUrl, cancelUrl, metadata } = params;

  const priceId = STRIPE_PRICE_IDS[tierId];

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      tierId,
      ...metadata,
    },
    subscription_data: {
      metadata: {
        tierId,
        ...metadata,
      },
    },
  });

  return session;
}

// Create a customer portal session for managing subscriptions
export async function createCustomerPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const { customerId, returnUrl } = params;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Retrieve subscription details
export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string, immediately = false) {
  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Webhook event types we handle
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
} as const;
