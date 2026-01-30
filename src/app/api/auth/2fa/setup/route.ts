import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// Generate a TOTP secret
function generateSecret(): string {
  // Generate 20 random bytes and encode as base32
  const buffer = crypto.randomBytes(20);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';

  for (let i = 0; i < buffer.length; i++) {
    secret += chars[buffer[i] % 32];
  }

  return secret;
}

// Generate otpauth URL for QR code
function generateOtpauthUrl(secret: string, email: string): string {
  const issuer = 'Tamarque';
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);

  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Generate new secret
    const secret = generateSecret();
    const otpauthUrl = generateOtpauthUrl(secret, session.user.email);

    // Store the pending secret (not activated yet)
    const { error } = await supabase
      .from('user_2fa')
      .upsert(
        {
          user_email: session.user.email,
          secret: secret,
          enabled: false,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'user_email' }
      );

    if (error) {
      console.error('2FA setup error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la configuration' },
        { status: 500 }
      );
    }

    // Generate QR code URL using Google Charts API
    // In production, use a library like 'qrcode' for better security
    const qrCodeUrl = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(
      otpauthUrl
    )}`;

    return NextResponse.json({
      secret,
      qrCodeUrl,
      otpauthUrl, // For apps that support direct URL import
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
