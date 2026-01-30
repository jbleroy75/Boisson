/**
 * CSV Export Utilities
 * Generate and download CSV files from data
 */

interface CSVOptions {
  filename: string;
  headers?: string[];
  delimiter?: string;
}

/**
 * Convert array of objects to CSV string
 */
export function objectsToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: { headers?: string[]; delimiter?: string } = {}
): string {
  if (data.length === 0) return '';

  const { headers, delimiter = ';' } = options;
  const keys = headers || Object.keys(data[0]);

  // Escape CSV values
  const escapeCSV = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // Escape quotes and wrap in quotes if contains delimiter, quotes, or newlines
    if (
      stringValue.includes(delimiter) ||
      stringValue.includes('"') ||
      stringValue.includes('\n')
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Create header row
  const headerRow = keys.map(escapeCSV).join(delimiter);

  // Create data rows
  const dataRows = data.map((item) =>
    keys.map((key) => escapeCSV(item[key])).join(delimiter)
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download data as CSV file
 */
export function downloadCSV<T extends Record<string, unknown>>(
  data: T[],
  options: CSVOptions
): void {
  const { filename, headers, delimiter = ';' } = options;

  const csv = objectsToCSV(data, { headers, delimiter });

  // Add BOM for Excel compatibility with UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export orders to CSV
 */
export interface OrderExportData {
  orderNumber: string;
  date: string;
  status: string;
  clientName: string;
  clientEmail: string;
  items: string;
  quantity: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: string;
  deliveryAddress: string;
}

export function exportOrdersToCSV(orders: OrderExportData[], filename?: string): void {
  const headers = [
    'Numéro commande',
    'Date',
    'Statut',
    'Client',
    'Email',
    'Produits',
    'Quantité totale',
    'Sous-total HT',
    'TVA',
    'Total TTC',
    'Paiement',
    'Adresse livraison',
  ];

  const formattedData = orders.map((order) => ({
    'Numéro commande': order.orderNumber,
    Date: new Date(order.date).toLocaleDateString('fr-FR'),
    Statut: order.status,
    Client: order.clientName,
    Email: order.clientEmail,
    Produits: order.items,
    'Quantité totale': order.quantity,
    'Sous-total HT': order.subtotal.toFixed(2) + ' €',
    TVA: order.tax.toFixed(2) + ' €',
    'Total TTC': order.total.toFixed(2) + ' €',
    Paiement: order.paymentStatus,
    'Adresse livraison': order.deliveryAddress,
  }));

  downloadCSV(formattedData, {
    filename: filename || `commandes-${new Date().toISOString().split('T')[0]}.csv`,
    headers,
  });
}

/**
 * Export clients to CSV
 */
export interface ClientExportData {
  companyName: string;
  siret: string;
  contactName: string;
  email: string;
  phone: string;
  companyType: string;
  pricingTier: string;
  totalOrders: number;
  totalRevenue: number;
  createdAt: string;
  status: string;
}

export function exportClientsToCSV(clients: ClientExportData[], filename?: string): void {
  const headers = [
    'Entreprise',
    'SIRET',
    'Contact',
    'Email',
    'Téléphone',
    'Type',
    'Tarif',
    'Nb commandes',
    'CA total',
    'Date création',
    'Statut',
  ];

  const formattedData = clients.map((client) => ({
    Entreprise: client.companyName,
    SIRET: client.siret,
    Contact: client.contactName,
    Email: client.email,
    Téléphone: client.phone,
    Type: client.companyType,
    Tarif: client.pricingTier,
    'Nb commandes': client.totalOrders,
    'CA total': client.totalRevenue.toFixed(2) + ' €',
    'Date création': new Date(client.createdAt).toLocaleDateString('fr-FR'),
    Statut: client.status,
  }));

  downloadCSV(formattedData, {
    filename: filename || `clients-${new Date().toISOString().split('T')[0]}.csv`,
    headers,
  });
}

/**
 * Export products/inventory to CSV
 */
export interface ProductExportData {
  sku: string;
  name: string;
  flavor: string;
  price: number;
  b2bPrice: number;
  stock: number;
  status: string;
}

export function exportProductsToCSV(products: ProductExportData[], filename?: string): void {
  const headers = ['SKU', 'Nom', 'Saveur', 'Prix public', 'Prix B2B', 'Stock', 'Statut'];

  const formattedData = products.map((product) => ({
    SKU: product.sku,
    Nom: product.name,
    Saveur: product.flavor,
    'Prix public': product.price.toFixed(2) + ' €',
    'Prix B2B': product.b2bPrice.toFixed(2) + ' €',
    Stock: product.stock,
    Statut: product.status,
  }));

  downloadCSV(formattedData, {
    filename: filename || `produits-${new Date().toISOString().split('T')[0]}.csv`,
    headers,
  });
}
