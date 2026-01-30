'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  Download,
  Printer,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Mock order data
const MOCK_ORDER = {
  id: 'B2B-2024-00142',
  date: '2024-01-15T10:30:00',
  status: 'shipped',
  deliveryDate: '2024-01-18',
  trackingNumber: 'FR123456789',
  trackingUrl: 'https://www.laposte.fr/outils/suivre-vos-envois?code=FR123456789',
  items: [
    { id: '1', name: 'Tamarque Mango Sunrise', quantity: 240, unitPrice: 2.2, total: 528 },
    { id: '2', name: 'Tamarque Dragon Fruit Rush', quantity: 120, unitPrice: 2.2, total: 264 },
    { id: '3', name: 'Tamarque Citrus Energy', quantity: 180, unitPrice: 2.2, total: 396 },
    { id: '4', name: 'Tamarque Berry Boost', quantity: 60, unitPrice: 2.2, total: 132 },
  ],
  subtotal: 1320,
  discount: 330, // 25%
  discountPercent: 25,
  shipping: 0,
  tax: 54.45, // 5.5%
  total: 1044.45,
  deliveryAddress: {
    company: 'FitGym Paris',
    street: '42 Avenue des Champions',
    city: 'Paris',
    postalCode: '75008',
    country: 'France',
  },
  billingAddress: {
    company: 'FitGym SAS',
    street: '42 Avenue des Champions',
    city: 'Paris',
    postalCode: '75008',
    country: 'France',
    siret: '12345678901234',
  },
  timeline: [
    { date: '2024-01-15T10:30:00', status: 'created', label: 'Commande reçue' },
    { date: '2024-01-15T14:00:00', status: 'confirmed', label: 'Commande confirmée' },
    { date: '2024-01-16T09:00:00', status: 'processing', label: 'En préparation' },
    { date: '2024-01-17T16:30:00', status: 'shipped', label: 'Expédiée' },
  ],
  invoiceId: 'INV-2024-00142',
};

const statusConfig = {
  pending: { label: 'En attente', color: 'yellow', icon: Clock },
  confirmed: { label: 'Confirmée', color: 'blue', icon: CheckCircle },
  processing: { label: 'En préparation', color: 'orange', icon: Package },
  shipped: { label: 'Expédiée', color: 'green', icon: Truck },
  delivered: { label: 'Livrée', color: 'green', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'red', icon: Clock },
};

export default function B2BOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  // In production, fetch order data based on orderId
  const order = MOCK_ORDER;
  const status = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back link */}
          <Link
            href="/fournisseurs/orders"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux commandes
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Commande {order.id}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Passée le {formatDate(order.date)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                  status.color === 'green'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : status.color === 'orange'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    : status.color === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                }`}
              >
                <StatusIcon className="h-5 w-5" />
                {status.label}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tracking info */}
              {order.status === 'shipped' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-orange-500" />
                    Suivi de livraison
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">N° de suivi</p>
                      <p className="font-mono font-medium text-gray-900 dark:text-white">
                        {order.trackingNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Livraison estimée
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(order.deliveryDate).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm:ml-auto btn-primary"
                    >
                      Suivre le colis
                    </a>
                  </div>
                </div>
              )}

              {/* Order items */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-500" />
                    Produits commandés
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Produit
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Quantité
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Prix unit.
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                            {formatPrice(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-900 dark:text-white font-medium">
                            {formatPrice(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
                  <div className="max-w-xs ml-auto space-y-2">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Sous-total HT</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Remise ({order.discountPercent}%)</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Livraison</span>
                      <span>{order.shipping === 0 ? 'Offerte' : formatPrice(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>TVA (5,5%)</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span>Total TTC</span>
                      <span className="text-orange-500">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-6">
                  Historique de la commande
                </h2>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === order.timeline.length - 1
                              ? 'bg-orange-500'
                              : 'bg-green-500'
                          }`}
                        />
                        {index < order.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.label}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-3">
                <Link
                  href={`/fournisseurs/invoices/${order.invoiceId}`}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  Voir la facture
                </Link>
                <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="h-5 w-5" />
                  Télécharger PDF
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Printer className="h-5 w-5" />
                  Imprimer
                </button>
              </div>

              {/* Delivery address */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Adresse de livraison
                </h3>
                <div className="text-gray-600 dark:text-gray-400 space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.deliveryAddress.company}
                  </p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>
                    {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
                  </p>
                  <p>{order.deliveryAddress.country}</p>
                </div>
              </div>

              {/* Billing info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  Facturation
                </h3>
                <div className="text-gray-600 dark:text-gray-400 space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.billingAddress.company}
                  </p>
                  <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.postalCode} {order.billingAddress.city}
                  </p>
                  <p className="text-sm">SIRET: {order.billingAddress.siret}</p>
                </div>
              </div>

              {/* Help */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Une question sur cette commande ?{' '}
                  <Link href="/fournisseurs/contact" className="font-medium underline">
                    Contactez-nous
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
