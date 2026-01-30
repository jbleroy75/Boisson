import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  recordCookieConsent,
  getCookieConsent,
  checkRateLimit,
  getClientIdentifier,
  logGdprEvent,
} from '@/lib/security';
import { gdprConsentSchema } from '@/lib/validations';

/**
 * GET /api/gdpr/consent - Get current cookie consent
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const anonymousId = request.cookies.get('anonymous_id')?.value;

    const consent = await getCookieConsent(
      session?.user?.id,
      anonymousId
    );

    if (!consent) {
      // No consent recorded - return null to show banner
      return NextResponse.json({ consent: null });
    }

    return NextResponse.json({ consent });
  } catch (error) {
    console.error('Error getting consent:', error);
    return NextResponse.json({ consent: null });
  }
}

/**
 * POST /api/gdpr/consent - Record cookie consent
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientIp, 'api:general');
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes' },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = gdprConsentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données de consentement invalides' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    let anonymousId = request.cookies.get('anonymous_id')?.value;

    // Generate anonymous ID if not logged in and no existing ID
    if (!session?.user?.id && !anonymousId) {
      const crypto = require('crypto');
      anonymousId = crypto.randomBytes(16).toString('hex');
    }

    // Record consent
    await recordCookieConsent(
      result.data,
      session?.user?.id,
      anonymousId,
      clientIp
    );

    // Log consent
    if (session?.user?.id) {
      await logGdprEvent('gdpr:consent_given', request, session.user.id, {
        consent: result.data,
      });
    }

    // Create response with anonymous ID cookie if needed
    const response = NextResponse.json({ success: true });

    if (anonymousId && !request.cookies.get('anonymous_id')) {
      response.cookies.set('anonymous_id', anonymousId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error recording consent:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement du consentement' },
      { status: 500 }
    );
  }
}
