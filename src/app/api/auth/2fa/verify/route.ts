import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// TOTP verification
function verifyTOTP(secret: string, code: string): boolean {
  const counter = Math.floor(Date.now() / 30000);

  // Check current and adjacent time windows (for clock drift)
  for (let i = -1; i <= 1; i++) {
    const expectedCode = generateTOTP(secret, counter + i);
    if (expectedCode === code) {
      return true;
    }
  }

  return false;
}

function generateTOTP(secret: string, counter: number): string {
  // Convert counter to buffer (8 bytes, big-endian)
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  // Decode base32 secret
  const secretBuffer = base32Decode(secret);

  // Generate HMAC-SHA1
  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counterBuffer);
  const hash = hmac.digest();

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0xf;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  // Generate 6-digit code
  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

function base32Decode(encoded: string): Buffer {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleaned = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');

  let bits = '';
  for (const char of cleaned) {
    const index = chars.indexOf(char);
    if (index >= 0) {
      bits += index.toString(2).padStart(5, '0');
    }
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return Buffer.from(bytes);
}

function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Code invalide' }, { status: 400 });
    }

    // Get the pending secret
    const { data: twoFaData, error: fetchError } = await supabase
      .from('user_2fa')
      .select('secret, enabled')
      .eq('user_email', session.user.email)
      .single();

    if (fetchError || !twoFaData) {
      return NextResponse.json(
        { error: 'Configuration 2FA non trouvée' },
        { status: 404 }
      );
    }

    // Verify the code
    if (!verifyTOTP(twoFaData.secret, code)) {
      return NextResponse.json({ error: 'Code incorrect' }, { status: 400 });
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = backupCodes.map((c) =>
      crypto.createHash('sha256').update(c).digest('hex')
    );

    // Enable 2FA and store backup codes
    const { error: updateError } = await supabase
      .from('user_2fa')
      .update({
        enabled: true,
        backup_codes: hashedBackupCodes,
        enabled_at: new Date().toISOString(),
      })
      .eq('user_email', session.user.email);

    if (updateError) {
      console.error('2FA enable error:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'activation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      backupCodes, // Return plain text codes to show user once
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
