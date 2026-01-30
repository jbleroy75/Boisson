import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = 'Tamarque <noreply@tamarque.com>';

export interface OrderConfirmationData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface ShipmentNotificationData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
  estimatedDelivery: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
}

export interface B2BOrderNotificationData {
  distributorName: string;
  distributorEmail: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
  total: number;
  discount: number;
}

// Template functions
function orderConfirmationTemplate(data: OrderConfirmationData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">€${item.price.toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #FF6B35, #FF1493); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Merci pour votre commande !</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; color: #333;">Bonjour ${data.customerName},</p>
          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            Nous avons bien reçu votre commande <strong>#${data.orderId}</strong>.
            Vous recevrez un email de confirmation dès l'expédition.
          </p>

          <!-- Order Details -->
          <div style="margin: 30px 0; background-color: #f9f9f9; border-radius: 8px; padding: 20px;">
            <h2 style="font-size: 18px; margin: 0 0 20px;">Récapitulatif de commande</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #1A1A1A; color: #fff;">
                  <th style="padding: 12px; text-align: left;">Produit</th>
                  <th style="padding: 12px; text-align: center;">Qté</th>
                  <th style="padding: 12px; text-align: right;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Sous-total</span>
                <span>€${data.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Livraison</span>
                <span>${data.shipping === 0 ? 'Gratuit' : `€${data.shipping.toFixed(2)}`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; margin-top: 12px;">
                <span>Total</span>
                <span style="color: #FF6B35;">€${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div style="margin: 30px 0;">
            <h3 style="font-size: 16px; margin: 0 0 10px;">Adresse de livraison</h3>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              ${data.shippingAddress.street}<br>
              ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
              ${data.shippingAddress.country}
            </p>
          </div>

          <a href="https://tamarque.com/account" style="display: inline-block; background-color: #FF6B35; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px;">
            Suivre ma commande
          </a>
        </div>

        <!-- Footer -->
        <div style="background-color: #1A1A1A; padding: 30px 20px; text-align: center;">
          <p style="color: #888; margin: 0 0 10px; font-size: 14px;">
            Des questions ? Répondez à cet email ou contactez-nous à contact@tamarque.com
          </p>
          <p style="color: #666; margin: 0; font-size: 12px;">
            © 2024 Tamarque. Tous droits réservés.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function shipmentNotificationTemplate(data: ShipmentNotificationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #00D9A5, #00B589); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">📦 Votre commande est en route !</h1>
        </div>

        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; color: #333;">Bonjour ${data.customerName},</p>
          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            Votre commande <strong>#${data.orderId}</strong> a été expédiée !
          </p>

          <div style="margin: 30px 0; background-color: #f9f9f9; border-radius: 8px; padding: 20px;">
            <h3 style="margin: 0 0 15px;">Informations de suivi</h3>
            <p style="margin: 0 0 8px;"><strong>Transporteur :</strong> ${data.carrier}</p>
            <p style="margin: 0 0 8px;"><strong>N° de suivi :</strong> ${data.trackingNumber}</p>
            <p style="margin: 0;"><strong>Livraison estimée :</strong> ${data.estimatedDelivery}</p>
          </div>

          <a href="${data.trackingUrl}" style="display: inline-block; background-color: #FF6B35; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Suivre mon colis
          </a>
        </div>

        <div style="background-color: #1A1A1A; padding: 30px 20px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            © 2024 Tamarque. Tous droits réservés.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function welcomeEmailTemplate(data: WelcomeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #FF6B35, #FF1493); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Bienvenue chez Tamarque ! 🎉</h1>
        </div>

        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; color: #333;">Bonjour ${data.name},</p>
          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            Merci de rejoindre la famille Tamarque ! Vous êtes maintenant prêt(e) à découvrir
            nos boissons protéinées légère et rafraîchissante.
          </p>

          <div style="margin: 30px 0; background-color: #fff3e0; border-radius: 8px; padding: 20px; border-left: 4px solid #FF6B35;">
            <h3 style="margin: 0 0 10px; color: #FF6B35;">🎁 Offre de bienvenue</h3>
            <p style="margin: 0; color: #666;">
              Utilisez le code <strong>WELCOME15</strong> pour bénéficier de 15% de réduction
              sur votre première commande !
            </p>
          </div>

          <h3 style="margin: 30px 0 15px;">Pourquoi Tamarque ?</h3>
          <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
            <li><strong>20g de protéines</strong> par bouteille</li>
            <li>Texture <strong>légère</strong> unique et rafraîchissante</li>
            <li>Ingrédients <strong>100% naturels</strong></li>
            <li><strong>Zéro ballonnement</strong></li>
          </ul>

          <a href="https://tamarque.com/shop" style="display: inline-block; background-color: #FF6B35; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px;">
            Découvrir nos produits
          </a>
        </div>

        <div style="background-color: #1A1A1A; padding: 30px 20px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            © 2024 Tamarque. Tous droits réservés.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email sending functions
export async function sendOrderConfirmation(data: OrderConfirmationData) {
  if (!resend) {
    console.log('Email (dev mode):', 'Order confirmation', data);
    return { success: true, id: 'dev-mode' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Confirmation de commande #${data.orderId} - Tamarque`,
      html: orderConfirmationTemplate(data),
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    return { success: false, error };
  }
}

export async function sendShipmentNotification(data: ShipmentNotificationData) {
  if (!resend) {
    console.log('Email (dev mode):', 'Shipment notification', data);
    return { success: true, id: 'dev-mode' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Votre commande #${data.orderId} est en route ! - Tamarque`,
      html: shipmentNotificationTemplate(data),
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send shipment notification:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  if (!resend) {
    console.log('Email (dev mode):', 'Welcome email', data);
    return { success: true, id: 'dev-mode' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Bienvenue chez Tamarque ! 🎉',
      html: welcomeEmailTemplate(data),
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function sendB2BOrderNotification(data: B2BOrderNotificationData) {
  if (!resend) {
    console.log('Email (dev mode):', 'B2B order notification', data);
    return { success: true, id: 'dev-mode' };
  }

  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${(item.quantity * item.unitPrice).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  try {
    // Send to distributor
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.distributorEmail,
      subject: `Confirmation commande B2B #${data.orderId} - Tamarque`,
      html: `
        <h2>Confirmation de commande B2B</h2>
        <p>Bonjour ${data.distributorName},</p>
        <p>Votre commande #${data.orderId} a bien été reçue.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #1A1A1A; color: #fff;">
              <th style="padding: 10px; text-align: left;">Produit</th>
              <th style="padding: 10px; text-align: center;">Qté</th>
              <th style="padding: 10px; text-align: right;">Prix unit.</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p><strong>Remise appliquée :</strong> ${data.discount}%</p>
        <p><strong>Total :</strong> €${data.total.toFixed(2)}</p>
        <p>Votre commande sera traitée sous 24h.</p>
        <p>L'équipe Tamarque B2B</p>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: 'b2b@tamarque.com',
      subject: `[B2B] Nouvelle commande #${data.orderId} de ${data.distributorName}`,
      html: `
        <h2>Nouvelle commande B2B</h2>
        <p><strong>Distributeur :</strong> ${data.distributorName}</p>
        <p><strong>Commande :</strong> #${data.orderId}</p>
        <p><strong>Total :</strong> €${data.total.toFixed(2)}</p>
        <p><strong>Remise :</strong> ${data.discount}%</p>
        <a href="https://tamarque.com/admin/orders/${data.orderId}">Voir la commande</a>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send B2B order notification:', error);
    return { success: false, error };
  }
}

export async function sendNewsletterWelcome(email: string) {
  if (!resend) {
    console.log('Email (dev mode):', 'Newsletter welcome', email);
    return { success: true, id: 'dev-mode' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Bienvenue dans la newsletter Tamarque ! 💪',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF6B35, #FF1493); padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Merci de vous être inscrit(e) !</h1>
          </div>
          <div style="padding: 30px;">
            <p>Vous recevrez désormais :</p>
            <ul>
              <li>Nos offres exclusives</li>
              <li>Les nouveaux produits en avant-première</li>
              <li>Des conseils nutrition & fitness</li>
            </ul>
            <p>À très vite !</p>
            <p>L'équipe Tamarque</p>
          </div>
        </div>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send newsletter welcome:', error);
    return { success: false, error };
  }
}

// B2B Registration Emails
export interface B2BRegistrationEmailData {
  to: string;
  companyName: string;
  contactName: string;
}

export async function sendB2BRegistrationEmail(data: B2BRegistrationEmailData) {
  if (!resend) {
    console.log('Email (dev mode):', 'B2B registration confirmation', data);
    return { success: true, id: 'dev-mode' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: 'Demande de partenariat B2B reçue - Tamarque',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff;">
            <div style="background: linear-gradient(135deg, #FF6B35, #FF1493); padding: 40px; text-align: center;">
              <h1 style="color: #fff; margin: 0;">Demande reçue ! 🤝</h1>
            </div>
            <div style="padding: 40px;">
              <p style="font-size: 16px;">Bonjour ${data.contactName},</p>
              <p style="color: #666; line-height: 1.6;">
                Nous avons bien reçu votre demande de partenariat B2B pour
                <strong>${data.companyName}</strong>.
              </p>
              <div style="background: #fff3e0; border-left: 4px solid #FF6B35; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 10px; color: #FF6B35;">Prochaines étapes</h3>
                <ol style="color: #666; padding-left: 20px; margin: 0;">
                  <li style="margin-bottom: 8px;">Notre équipe commerciale examine votre dossier</li>
                  <li style="margin-bottom: 8px;">Vérification de votre SIRET et informations</li>
                  <li style="margin-bottom: 8px;">Contact sous 48h pour discuter de vos besoins</li>
                  <li>Activation de votre compte et envoi de vos identifiants</li>
                </ol>
              </div>
              <p style="color: #666;">
                En attendant, n'hésitez pas à nous contacter si vous avez des questions.
              </p>
              <p style="color: #666; margin-top: 30px;">
                À très bientôt,<br>
                <strong>L'équipe commerciale Tamarque</strong>
              </p>
            </div>
            <div style="background: #1A1A1A; padding: 30px; text-align: center;">
              <p style="color: #888; margin: 0; font-size: 14px;">
                b2b@tamarque.com | +33 1 23 45 67 89
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send B2B registration email:', error);
    return { success: false, error };
  }
}

export interface B2BAdminNotificationData {
  clientId: string;
  companyName: string;
  email: string;
  companyType: string;
  estimatedVolume: string;
}

export async function sendB2BAdminNotification(data: B2BAdminNotificationData) {
  const adminEmail = process.env.B2B_ADMIN_EMAIL || 'b2b@tamarque.com';

  if (!resend) {
    console.log('Email (dev mode):', 'B2B admin notification', data);
    return { success: true, id: 'dev-mode' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `🆕 Nouveau partenaire B2B: ${data.companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif;">
          <h2>Nouvelle demande de partenariat B2B</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Entreprise</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Type</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.companyType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Volume estimé</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.estimatedVolume} unités/mois</td>
            </tr>
          </table>
          <p style="margin-top: 30px;">
            <a href="https://tamarque.com/admin/b2b/${data.clientId}"
               style="background: #FF6B35; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Voir la demande
            </a>
          </p>
        </body>
        </html>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send B2B admin notification:', error);
    return { success: false, error };
  }
}

// Password Reset Email
export interface PasswordResetEmailData {
  email: string;
  name: string | null;
  resetToken: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  if (!resend) {
    console.log('Email (dev mode):', 'Password reset', data);
    return { success: true, id: 'dev-mode' };
  }

  const displayName = data.name || 'cher client';

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Réinitialisation de votre mot de passe - Tamarque',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #FF6B35, #FF1493); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Réinitialisation du mot de passe</h1>
            </div>

            <div style="padding: 40px 20px;">
              <p style="font-size: 16px; color: #333;">Bonjour ${displayName},</p>
              <p style="font-size: 16px; color: #666; line-height: 1.6;">
                Vous avez demandé la réinitialisation de votre mot de passe.
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
              </p>

              <div style="text-align: center; margin: 40px 0;">
                <a href="${data.resetUrl}" style="display: inline-block; background-color: #FF6B35; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Réinitialiser mon mot de passe
                </a>
              </div>

              <div style="background-color: #fff3e0; border-left: 4px solid #FF6B35; padding: 15px 20px; margin: 30px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>Ce lien expire dans 1 heure.</strong><br>
                  Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
                </p>
              </div>

              <p style="font-size: 14px; color: #999; margin-top: 30px;">
                Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
                <span style="color: #666; word-break: break-all;">${data.resetUrl}</span>
              </p>
            </div>

            <div style="background-color: #1A1A1A; padding: 30px 20px; text-align: center;">
              <p style="color: #888; margin: 0 0 10px; font-size: 14px;">
                Des questions ? Contactez-nous à contact@tamarque.com
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                © 2024 Tamarque. Tous droits réservés.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}

// Payment Failed Email
export interface PaymentFailedEmailData {
  email: string;
  name: string | null;
  subscriptionId: string;
  amount: number;
  retryUrl: string;
}

export async function sendPaymentFailedEmail(data: PaymentFailedEmailData) {
  if (!resend) {
    console.log('Email (dev mode):', 'Payment failed', data);
    return { success: true, id: 'dev-mode' };
  }

  const displayName = data.name || 'cher client';

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Échec de paiement - Action requise - Tamarque',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background-color: #FF4444; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Échec de paiement</h1>
            </div>

            <div style="padding: 40px 20px;">
              <p style="font-size: 16px; color: #333;">Bonjour ${displayName},</p>
              <p style="font-size: 16px; color: #666; line-height: 1.6;">
                Nous n'avons pas pu traiter votre paiement de <strong>€${data.amount.toFixed(2)}</strong>
                pour votre abonnement Tamarque.
              </p>

              <div style="background-color: #FFF5F5; border-left: 4px solid #FF4444; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 10px; color: #FF4444;">Action requise</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">
                  Veuillez mettre à jour vos informations de paiement pour éviter
                  l'interruption de votre abonnement.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.retryUrl}" style="display: inline-block; background-color: #FF6B35; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Mettre à jour mon paiement
                </a>
              </div>

              <p style="font-size: 14px; color: #666; line-height: 1.6;">
                <strong>Raisons possibles :</strong>
              </p>
              <ul style="color: #666; font-size: 14px; line-height: 1.8;">
                <li>Carte expirée</li>
                <li>Fonds insuffisants</li>
                <li>Informations de carte incorrectes</li>
                <li>Blocage par votre banque</li>
              </ul>

              <p style="font-size: 14px; color: #999; margin-top: 30px;">
                Si vous avez des questions, contactez-nous à support@tamarque.com
              </p>
            </div>

            <div style="background-color: #1A1A1A; padding: 30px 20px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                © 2024 Tamarque. Tous droits réservés.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send payment failed email:', error);
    return { success: false, error };
  }
}

// B2B Order Status Update
export async function sendB2BOrderStatusUpdate(data: {
  to: string;
  companyName: string;
  orderId: string;
  status: string;
  message?: string;
}) {
  if (!resend) {
    console.log('Email (dev mode):', 'B2B order status update', data);
    return { success: true, id: 'dev-mode' };
  }

  const statusMessages: Record<string, { title: string; color: string }> = {
    confirmed: { title: 'Commande confirmée', color: '#00D9A5' },
    processing: { title: 'Commande en préparation', color: '#FF6B35' },
    shipped: { title: 'Commande expédiée', color: '#00B589' },
    delivered: { title: 'Commande livrée', color: '#00D9A5' },
    cancelled: { title: 'Commande annulée', color: '#FF4444' },
  };

  const statusInfo = statusMessages[data.status] || { title: data.status, color: '#666' };

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `${statusInfo.title} - Commande #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${statusInfo.color}; padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">${statusInfo.title}</h1>
          </div>
          <div style="padding: 30px;">
            <p>Bonjour,</p>
            <p>La commande <strong>#${data.orderId}</strong> pour <strong>${data.companyName}</strong>
               a été mise à jour.</p>
            ${data.message ? `<p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${data.message}</p>` : ''}
            <a href="https://tamarque.com/fournisseurs/orders/${data.orderId}"
               style="display: inline-block; background: #FF6B35; color: #fff; padding: 12px 24px;
                      text-decoration: none; border-radius: 6px; margin-top: 20px;">
              Voir la commande
            </a>
          </div>
        </div>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send B2B order status update:', error);
    return { success: false, error };
  }
}
