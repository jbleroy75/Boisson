'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Printer, Mail, CheckCircle, Clock, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { printInvoice, type InvoiceData } from '@/lib/pdf';

// Mock invoice data
const MOCK_INVOICE: InvoiceData & { status: string; orderId: string; paidAt?: string } = {
  invoiceNumber: 'INV-2024-00142',
  date: '2024-01-15',
  dueDate: '2024-02-15',
  status: 'paid',
  paidAt: '2024-01-20',
  orderId: 'B2B-2024-00142',
  company: {
    name: 'FitGym SAS',
    siret: '123 456 789 00012',
    address: '42 Avenue des Champions',
    city: 'Paris',
    postalCode: '75008',
    email: 'contact@fitgym.fr',
  },
  items: [
    { description: 'Tamarque Mango Sunrise (x240)', quantity: 240, unitPrice: 2.2, total: 528 },
    { description: 'Tamarque Dragon Fruit Rush (x120)', quantity: 120, unitPrice: 2.2, total: 264 },
    { description: 'Tamarque Citrus Energy (x180)', quantity: 180, unitPrice: 2.2, total: 396 },
    { description: 'Tamarque Berry Boost (x60)', quantity: 60, unitPrice: 2.2, total: 132 },
  ],
  subtotal: 990, // After 25% discount
  tax: 54.45,
  taxRate: 5.5,
  total: 1044.45,
  notes: 'Remise partenaire Standard appliquée: -25%',
};

export default function B2BInvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  // In production, fetch invoice based on invoiceId
  const invoice = MOCK_INVOICE;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handlePrint = () => {
    printInvoice(invoice);
  };

  const handleDownload = () => {
    // In production, this would trigger a PDF download from the server
    // For now, we'll use the print dialog
    printInvoice(invoice);
  };

  const handleSendEmail = async () => {
    // In production, this would trigger an API call to resend the invoice
    alert('Facture envoyée par email à ' + invoice.company.email);
  };

  const isPaid = invoice.status === 'paid';
  const isOverdue =
    !isPaid && new Date(invoice.dueDate) < new Date();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back link */}
          <Link
            href="/fournisseurs/invoices"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux factures
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Facture {invoice.invoiceNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Émise le {formatDate(invoice.date)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                  isPaid
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : isOverdue
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}
              >
                {isPaid ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
                {isPaid ? 'Payée' : isOverdue ? 'En retard' : 'En attente'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Télécharger PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-5 w-5" />
              Imprimer
            </button>
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Mail className="h-5 w-5" />
              Envoyer par email
            </button>
          </div>

          {/* Invoice preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Invoice header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold">TAMARQUE</h2>
                  <p className="text-white/80 mt-1">Boissons Protéinées Premium</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">FACTURE</p>
                  <p className="text-white/80">N° {invoice.invoiceNumber}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Addresses */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Émetteur
                  </h3>
                  <p className="font-semibold text-gray-900 dark:text-white">TAMARQUE SAS</p>
                  <p className="text-gray-600 dark:text-gray-400">123 Avenue de la Performance</p>
                  <p className="text-gray-600 dark:text-gray-400">75008 Paris, France</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                    SIRET: 123 456 789 00012
                    <br />
                    TVA: FR12 345678901
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Facturé à
                  </h3>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {invoice.company.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{invoice.company.address}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {invoice.company.postalCode} {invoice.company.city}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                    SIRET: {invoice.company.siret}
                    <br />
                    Email: {invoice.company.email}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex flex-wrap gap-8 mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date d'émission</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(invoice.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Échéance</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
                {invoice.paidAt && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payée le</p>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      {formatDate(invoice.paidAt)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Commande associée</p>
                  <Link
                    href={`/fournisseurs/orders/${invoice.orderId}`}
                    className="font-medium text-orange-500 hover:text-orange-600"
                  >
                    {invoice.orderId}
                  </Link>
                </div>
              </div>

              {/* Items table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                    <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </th>
                    <th className="py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      Qté
                    </th>
                    <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      Prix unit. HT
                    </th>
                    <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total HT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4 text-gray-900 dark:text-white">{item.description}</td>
                      <td className="py-4 text-center text-gray-600 dark:text-gray-400">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right text-gray-600 dark:text-gray-400">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="py-4 text-right text-gray-900 dark:text-white font-medium">
                        {formatPrice(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Sous-total HT</span>
                    <span>{formatPrice(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>TVA ({invoice.taxRate}%)</span>
                    <span>{formatPrice(invoice.tax)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t-2 border-orange-500">
                    <span>Total TTC</span>
                    <span className="text-orange-500">{formatPrice(invoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.notes}</p>
                </div>
              )}

              {/* Payment info */}
              <div className="mt-8 p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Informations de paiement
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Paiement à 30 jours fin de mois
                  <br />
                  IBAN: FR76 1234 5678 9012 3456 7890 123
                  <br />
                  BIC: TAMARQUEFR
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  TAMARQUE SAS - Capital: 10 000€ - RCS Paris 123 456 789 - APE 1089Z
                </p>
                <p>contact@tamarque.com - www.tamarque.com - +33 1 23 45 67 89</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
