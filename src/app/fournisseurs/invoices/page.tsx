'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Invoice {
  id: string;
  order_id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date: string;
  paid_date: string | null;
  pdf_url: string;
  created_at: string;
}

// Mock invoices for demo
const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-001',
    order_id: 'ORD-2024-001',
    amount: 1391.50,
    status: 'paid',
    due_date: '2024-02-14',
    paid_date: '2024-02-10',
    pdf_url: '/invoices/INV-2024-001.pdf',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'INV-2024-002',
    order_id: 'ORD-2024-002',
    amount: 1395.00,
    status: 'paid',
    due_date: '2024-02-19',
    paid_date: '2024-02-18',
    pdf_url: '/invoices/INV-2024-002.pdf',
    created_at: '2024-01-20T14:15:00Z',
  },
  {
    id: 'INV-2024-003',
    order_id: 'ORD-2024-003',
    amount: 1235.00,
    status: 'pending',
    due_date: '2024-02-24',
    paid_date: null,
    pdf_url: '/invoices/INV-2024-003.pdf',
    created_at: '2024-01-25T09:00:00Z',
  },
];

const STATUS_STYLES = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
};

export default function B2BInvoicesPage() {
  const { data: session, status } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Invoice['status']>('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setInvoices(MOCK_INVOICES);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchInvoices();
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
    redirect('/login?callbackUrl=/fournisseurs/invoices');
  }

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter((i) => i.status === filter);

  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPending = invoices
    .filter((i) => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <>
      <Header isB2B />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Invoices</h1>
            <p className="text-gray-600">View and download your invoices</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">Total Invoices</div>
              <div className="text-2xl font-bold">{invoices.length}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">Total Paid</div>
              <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">Pending Payment</div>
              <div className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">Payment Terms</div>
              <div className="text-2xl font-bold">NET30</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6"
          >
            {(['all', 'pending', 'paid', 'overdue'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === s
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {s === 'all' ? 'All Invoices' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Invoices Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Invoice
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium">{invoice.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href="/fournisseurs/orders"
                            className="text-[#FF6B35] hover:underline"
                          >
                            {invoice.order_id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              STATUS_STYLES[invoice.status]
                            }`}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(invoice.due_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <a
                              href={invoice.pdf_url}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              PDF
                            </a>
                            {invoice.status === 'pending' && (
                              <button className="px-3 py-1.5 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#E55A2B] transition-colors">
                                Pay Now
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-br from-[#FF6B35]/10 to-[#FF1493]/10 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Bank Transfer</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Bank:</span> BNP Paribas</p>
                  <p><span className="font-medium">IBAN:</span> FR76 3000 4000 0000 0000 0000 000</p>
                  <p><span className="font-medium">BIC:</span> BNPAFRPP</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Terms</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>NET30 payment terms apply to all invoices.</p>
                  <p>Late payments may incur a 1.5% monthly fee.</p>
                  <p>Questions? Contact <a href="mailto:billing@tamarque.com" className="text-[#FF6B35] hover:underline">billing@tamarque.com</a></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer isB2B />
    </>
  );
}
