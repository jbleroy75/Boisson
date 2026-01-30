'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function DistributorDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
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
    redirect('/login?callbackUrl=/fournisseurs/dashboard');
  }

  // Mock distributor data
  const distributorData = {
    company: 'FitDistrib Lyon',
    siret: '12345678901234',
    region: 'Auvergne-Rhône-Alpes',
    approved: true,
    totalOrders: 12,
    totalSpent: 15840.0,
    pendingOrders: 1,
  };

  const recentOrders = [
    { id: 'B2B-001', date: 'Jan 20, 2024', items: 500, total: 1395.0, status: 'Shipped' },
    { id: 'B2B-002', date: 'Jan 5, 2024', items: 300, total: 837.0, status: 'Delivered' },
    { id: 'B2B-003', date: 'Dec 15, 2023', items: 750, total: 1792.5, status: 'Delivered' },
  ];

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
              <h1 className="text-3xl font-bold mb-1">Distributor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {distributorData.company}</p>
            </div>
            <Link
              href="/fournisseurs/order"
              className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors"
            >
              New Order
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <ul className="space-y-2">
                  {[
                    { href: '/fournisseurs/dashboard', label: 'Overview', icon: '📊', active: true },
                    { href: '/fournisseurs/order', label: 'Place Order', icon: '🛒' },
                    { href: '/fournisseurs/orders', label: 'Order History', icon: '📦' },
                    { href: '/fournisseurs/invoices', label: 'Invoices', icon: '📄' },
                    { href: '/fournisseurs/resources', label: 'Resources', icon: '📁' },
                    { href: '/fournisseurs/profile', label: 'Company Profile', icon: '🏢' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          item.active
                            ? 'bg-[#FF6B35]/10 text-[#FF6B35] font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <hr className="my-4" />
                <button
                  onClick={() => signOut({ callbackUrl: '/fournisseurs' })}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.nav>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="text-gray-500 text-sm mb-1">Total Orders</div>
                  <div className="text-3xl font-bold">{distributorData.totalOrders}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="text-gray-500 text-sm mb-1">Total Spent</div>
                  <div className="text-3xl font-bold text-[#FF6B35]">
                    €{distributorData.totalSpent.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="text-gray-500 text-sm mb-1">Pending Orders</div>
                  <div className="text-3xl font-bold text-[#FFD700]">
                    {distributorData.pendingOrders}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#00D9A5] to-[#00B589] rounded-2xl p-6 text-white">
                  <div className="text-white/80 text-sm mb-1">Your Discount Tier</div>
                  <div className="text-3xl font-bold">40% OFF</div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid sm:grid-cols-3 gap-4"
              >
                <Link
                  href="/fournisseurs/order"
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="text-3xl mb-3">🛒</div>
                  <div className="font-semibold group-hover:text-[#FF6B35] transition-colors">
                    Place New Order
                  </div>
                  <div className="text-sm text-gray-500">Order products at your discount tier</div>
                </Link>
                <Link
                  href="/fournisseurs/resources"
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="text-3xl mb-3">📥</div>
                  <div className="font-semibold group-hover:text-[#FF6B35] transition-colors">
                    Download Catalog
                  </div>
                  <div className="text-sm text-gray-500">Product specs & marketing assets</div>
                </Link>
                <Link
                  href="/fournisseurs/invoices"
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="text-3xl mb-3">📄</div>
                  <div className="font-semibold group-hover:text-[#FF6B35] transition-colors">
                    View Invoices
                  </div>
                  <div className="text-sm text-gray-500">Download invoices & statements</div>
                </Link>
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <Link
                    href="/fournisseurs/orders"
                    className="text-[#FF6B35] text-sm font-semibold hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Items
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{order.id}</td>
                          <td className="px-6 py-4 text-gray-600">{order.date}</td>
                          <td className="px-6 py-4 text-gray-600">{order.items} units</td>
                          <td className="px-6 py-4 font-semibold">€{order.total.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'Delivered'
                                  ? 'bg-[#00D9A5]/10 text-[#00D9A5]'
                                  : order.status === 'Shipped'
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-[#FF6B35] hover:underline text-sm font-medium">
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Company Information</h2>
                  <Link
                    href="/fournisseurs/profile"
                    className="text-[#FF6B35] text-sm font-semibold hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Company Name</label>
                    <div className="font-medium">{distributorData.company}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">SIRET</label>
                    <div className="font-medium">{distributorData.siret}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Region</label>
                    <div className="font-medium">{distributorData.region}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Status</label>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#00D9A5] rounded-full"></span>
                      <span className="font-medium text-[#00D9A5]">Approved</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer isB2B />
    </>
  );
}
