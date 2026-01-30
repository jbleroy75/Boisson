/**
 * PDF Invoice Generation
 * Uses jsPDF for client-side PDF generation
 * For server-side, you can use @react-pdf/renderer or puppeteer
 */

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  company: {
    name: string;
    siret: string;
    address: string;
    city: string;
    postalCode: string;
    email: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
}

/**
 * Generate invoice PDF using HTML/CSS approach
 * This creates a printable HTML document that can be converted to PDF
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${data.invoiceNumber} - Tamarque</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #FF6B35;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #FF6B35;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-number {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
    }
    .invoice-date {
      color: #666;
      margin-top: 5px;
    }
    .addresses {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .address-block {
      width: 45%;
    }
    .address-title {
      font-weight: bold;
      color: #FF6B35;
      margin-bottom: 10px;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1px;
    }
    .company-name {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }
    th:last-child, td:last-child {
      text-align: right;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .totals {
      width: 300px;
      margin-left: auto;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .totals-row.total {
      font-size: 18px;
      font-weight: bold;
      color: #FF6B35;
      border-bottom: none;
      border-top: 2px solid #FF6B35;
      margin-top: 10px;
      padding-top: 15px;
    }
    .notes {
      margin-top: 40px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .notes-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 10px;
    }
    .payment-info {
      margin-top: 30px;
      padding: 15px;
      background: #FFF5F0;
      border-left: 4px solid #FF6B35;
    }
    .payment-title {
      font-weight: bold;
      color: #FF6B35;
      margin-bottom: 10px;
    }
    @media print {
      body { padding: 20px; }
      .header { page-break-after: avoid; }
      table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">TAMARQUE</div>
      <div style="color: #666; font-size: 11px; margin-top: 5px;">
        Boissons Protéinées Premium
      </div>
    </div>
    <div class="invoice-info">
      <div class="invoice-number">FACTURE</div>
      <div class="invoice-date">N° ${data.invoiceNumber}</div>
      <div class="invoice-date">Date: ${formatDate(data.date)}</div>
      <div class="invoice-date">Échéance: ${formatDate(data.dueDate)}</div>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <div class="address-title">Émetteur</div>
      <div class="company-name">TAMARQUE SAS</div>
      <div>123 Avenue de la Performance</div>
      <div>75008 Paris, France</div>
      <div style="margin-top: 10px; color: #666;">
        SIRET: 123 456 789 00012<br>
        TVA: FR12 345678901
      </div>
    </div>
    <div class="address-block">
      <div class="address-title">Facturé à</div>
      <div class="company-name">${data.company.name}</div>
      <div>${data.company.address}</div>
      <div>${data.company.postalCode} ${data.company.city}</div>
      <div style="margin-top: 10px; color: #666;">
        SIRET: ${data.company.siret}<br>
        Email: ${data.company.email}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50%;">Description</th>
        <th style="width: 15%;">Quantité</th>
        <th style="width: 15%;">Prix unitaire HT</th>
        <th style="width: 20%;">Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${data.items
        .map(
          (item) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${formatPrice(item.unitPrice)}</td>
          <td>${formatPrice(item.total)}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Sous-total HT</span>
      <span>${formatPrice(data.subtotal)}</span>
    </div>
    <div class="totals-row">
      <span>TVA (${data.taxRate}%)</span>
      <span>${formatPrice(data.tax)}</span>
    </div>
    <div class="totals-row total">
      <span>Total TTC</span>
      <span>${formatPrice(data.total)}</span>
    </div>
  </div>

  <div class="payment-info">
    <div class="payment-title">Informations de paiement</div>
    <div>
      Paiement à 30 jours fin de mois<br>
      IBAN: FR76 1234 5678 9012 3456 7890 123<br>
      BIC: TAMARQUEFR
    </div>
  </div>

  ${
    data.notes
      ? `
    <div class="notes">
      <div class="notes-title">Notes</div>
      <div>${data.notes}</div>
    </div>
  `
      : ''
  }

  <div class="footer">
    TAMARQUE SAS - Capital: 10 000€ - RCS Paris 123 456 789 - APE 1089Z<br>
    contact@tamarque.com - www.tamarque.com - +33 1 23 45 67 89
  </div>
</body>
</html>
  `;
}

/**
 * Convert HTML to PDF using browser print
 * Client-side solution
 */
export function printInvoice(data: InvoiceData) {
  const html = generateInvoiceHTML(data);
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Download invoice as HTML file
 * Can be opened in browser and printed to PDF
 */
export function downloadInvoiceHTML(data: InvoiceData) {
  const html = generateInvoiceHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `facture-${data.invoiceNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export type { InvoiceData };
