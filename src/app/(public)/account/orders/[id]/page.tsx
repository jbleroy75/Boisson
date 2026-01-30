'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface OrderItem {
  id: string;
  name: string;
  flavor: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  paymentMethod: string;
}

// Mock order data
const MOCK_ORDER: Order = {
  id: 'TM-2024-001234',
  date: '2024-01-20T14:30:00Z',
  status: 'shipped',
  items: [
    { id: '1', name: 'Yuzu Pêche', flavor: 'yuzu-peach', quantity: 6, price: 3.99 },
    { id: '2', name: 'Matcha Vanille', flavor: 'matcha-vanilla', quantity: 6, price: 4.49 },
  ],
  subtotal: 50.88,
  shipping: 0,
  discount: 7.63,
  total: 43.25,
  shippingAddress: {
    name: 'Marie Dupont',
    address: '123 Rue de la Santé',
    city: 'Paris',
    postalCode: '75014',
    country: 'France',
  },
  trackingNumber: '1Z999AA10123456784',
  trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123456784',
  paymentMethod: 'Visa •••• 4242',
};

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800', icon: '✓' },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: '🚚' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: '✕' },
};

export default function OrderDetailPage() {
  const { data: session, status: authStatus } = useSession();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch order from API
    const fetchOrder = async () => {
      try {
        // In production, this would call the API
        // const res = await fetch(`/api/orders/${orderId}`);
        // const data = await res.json();
        // setOrder(data);

        // Mock data for demo
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOrder({ ...MOCK_ORDER, id: orderId });
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchOrder();
    }
  }, [session, orderId]);

  if (authStatus === 'loading' || isLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!session) {
    redirect('/login?callbackUrl=/account');
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-2xl font-bold mb-2">Commande introuvable</h1>
            <p className="text-gray-600 mb-6">
              Cette commande n'existe pas ou tu n'y as pas accès.
            </p>
            <Link
              href="/account"
              className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors"
            >
              Retour à mon compte
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/account" className="hover:text-[#FF6B35]">
              Mon compte
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Commande {order.id}</span>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Commande {order.id}</h1>
              <p className="text-gray-600">
                Passée le{' '}
                {new Date(order.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.color}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
          </motion.div>

          {/* Tracking */}
          {order.trackingNumber && order.status === 'shipped' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-[#FF6B35] to-[#FF1493] text-white rounded-2xl p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-lg mb-1">🚚 Ta commande est en route !</h2>
                  <p className="text-white/80">
                    N° de suivi : <span className="font-mono">{order.trackingNumber}</span>
                  </p>
                </div>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[#FF6B35] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Suivre mon colis
                  </a>
                )}
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Articles commandés</h2>
                </div>
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-6 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35]/20 to-[#FF1493]/20 rounded-xl flex items-center justify-center">
                        <div className="w-6 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-lg" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</p>
                        <p className="text-sm text-gray-500">{item.price.toFixed(2)}€ /unité</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="p-6 bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span>{order.subtotal.toFixed(2)}€</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-[#00D9A5]">
                        <span>Réduction</span>
                        <span>-{order.discount.toFixed(2)}€</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison</span>
                      <span>{order.shipping === 0 ? 'Gratuite' : `${order.shipping.toFixed(2)}€`}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>{order.total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold mb-4">Adresse de livraison</h2>
                <address className="not-italic text-gray-600">
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </address>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold mb-4">Paiement</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <span className="text-gray-600">{order.paymentMethod}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                <h2 className="font-bold mb-4">Actions</h2>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Télécharger la facture
                </button>
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Besoin d'aide ?
                </Link>
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <Link
                    href="/retours"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                      />
                    </svg>
                    Demander un retour
                  </Link>
                )}
              </div>
            </motion.div>
          </div>

          {/* Back Link */}
          <div className="mt-8">
            <Link href="/account" className="text-[#FF6B35] font-semibold hover:underline">
              ← Retour à mon compte
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
