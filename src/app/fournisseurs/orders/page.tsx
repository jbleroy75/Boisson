'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { B2BOrder } from '@/types';

// Mock orders for demo
const MOCK_ORDERS: B2BOrder[] = [
  {
    id: 'ORD-2024-001',
    distributor_id: '1',
    items: [
      { product_id: '1', product_name: 'Yuzu Peach', quantity: 200, unit_price: 2.79 },
      { product_id: '2', product_name: 'Hibiscus Raspberry', quantity: 150, unit_price: 2.79 },
      { product_id: '3', product_name: 'Matcha Vanilla', quantity: 100, unit_price: 3.14 },
    ],
    total: 1391.50,
    status: 'delivered',
    invoice_url: '/invoices/ORD-2024-001.pdf',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'ORD-2024-002',
    distributor_id: '1',
    items: [
      { product_id: '1', product_name: 'Yuzu Peach', quantity: 300, unit_price: 2.79 },
      { product_id: '4', product_name: 'Coco Pineapple', quantity: 200, unit_price: 2.79 },
    ],
    total: 1395.00,
    status: 'shipped',
    invoice_url: '/invoices/ORD-2024-002.pdf',
    created_at: '2024-01-20T14:15:00Z',
  },
  {
    id: 'ORD-2024-003',
    distributor_id: '1',
    items: [
      { product_id: '5', product_name: 'Dragon Fruit Mango Passion', quantity: 500, unit_price: 2.47 },
    ],
    total: 1235.00,
    status: 'pending',
    invoice_url: null,
    created_at: '2024-01-25T09:00:00Z',
  },
];

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function B2BOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | B2BOrder['status']>('all');

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        // In production, this would call the API
        // const response = await fetch('/api/b2b/orders');
        // const data = await response.json();
        // setOrders(data.orders);

        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOrders(MOCK_ORDERS);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Header isB2B />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        </main>
        <Footer isB2B />
      </>
    );
  }

  if (!session) {
    redirect('/login?callbackUrl=/fournisseurs/orders');
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const totalSpent = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <Header isB2B />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Order History</h1>
              <p className="text-gray-600">View and manage your B2B orders</p>
            </div>
            <Link
              href="/fournisseurs/order"
              className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors"
            >
              Place New Order
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">Total Orders</div>
              <div className="text-2xl font-bold">{orders.length}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-[#FF6B35]">${totalSpent.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">Pending Orders</div>
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === 'pending').length}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">In Transit</div>
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter((o) => o.status === 'shipped').length}
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6 overflow-x-auto"
          >
            {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === status
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </motion.div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-bold mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? "You haven't placed any orders yet."
                    : `No ${filter} orders found.`}
                </p>
                <Link
                  href="/fournisseurs/order"
                  className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors"
                >
                  Place Your First Order
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg">{order.id}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            STATUS_STYLES[order.status]
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#FF6B35]">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} units
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b last:border-0"
                        >
                          <div>
                            <span className="font-medium">{item.product_name}</span>
                            <span className="text-gray-500 ml-2">x {item.quantity}</span>
                          </div>
                          <span className="font-medium">
                            ${(item.quantity * item.unit_price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-3">
                    {order.invoice_url && (
                      <a
                        href={order.invoice_url}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Invoice
                      </a>
                    )}
                    {order.status === 'shipped' && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Track Shipment
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#E55A2B] transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reorder
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </main>
      <Footer isB2B />
    </>
  );
}
