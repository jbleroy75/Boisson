import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  exportUserData,
  deleteUserData,
  createGdprRequest,
  formatDataExport,
  checkRateLimit,
  getClientIdentifier,
  logGdprEvent,
  getAuditContext,
} from '@/lib/security';
import { dataExportRequestSchema, validateRequestBody } from '@/lib/validations';

/**
 * GET /api/gdpr - Export user data (GDPR Right to Access)
 */
export async function GET(request: NextRequest) {
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

    // Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Export user data
    const userData = await exportUserData(session.user.id);

    if (!userData) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'export des données' },
        { status: 500 }
      );
    }

    // Log the export
    await logGdprEvent('gdpr:consent_given', request, session.user.id, {
      action: 'data_export',
    });

    // Return as downloadable JSON
    const exportContent = formatDataExport(userData);

    return new NextResponse(exportContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="tamarque-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('GDPR export error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des données' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gdpr - Request data deletion (GDPR Right to Erasure)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - strict for deletion requests
    const clientIp = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientIp, 'contact:submit');
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez plus tard.' },
        { status: 429 }
      );
    }

    // Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Validate request body
    const body = await validateRequestBody(request, dataExportRequestSchema);

    // Verify email matches session
    if (body.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'L\'email ne correspond pas à votre compte' },
        { status: 400 }
      );
    }

    if (body.type === 'export') {
      // Create export request record
      const result = await createGdprRequest(
        session.user.id,
        session.user.email,
        'export',
        body.reason
      );

      if (!result.success) {
        return NextResponse.json(
          { error: 'Erreur lors de la création de la demande' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Demande d\'export créée. Vous recevrez vos données par email sous 48h.',
        requestId: result.requestId,
      });
    }

    if (body.type === 'delete') {
      // Create deletion request record
      const result = await createGdprRequest(
        session.user.id,
        session.user.email,
        'delete',
        body.reason
      );

      if (!result.success) {
        return NextResponse.json(
          { error: 'Erreur lors de la création de la demande' },
          { status: 500 }
        );
      }

      // For immediate deletion (optional - could be async)
      const deleteResult = await deleteUserData(session.user.id, request);

      if (!deleteResult.success) {
        return NextResponse.json(
          { error: deleteResult.error || 'Erreur lors de la suppression' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Vos données ont été supprimées. Votre compte a été désactivé.',
        requestId: result.requestId,
      });
    }

    return NextResponse.json(
      { error: 'Type de demande invalide' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GDPR request error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la demande' },
      { status: 500 }
    );
  }
}
