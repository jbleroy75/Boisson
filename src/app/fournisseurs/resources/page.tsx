'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function B2BResourcesPage() {
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

  const isLoggedIn = !!session;

  const resources = [
    {
      category: 'Product Catalog',
      items: [
        { name: 'Full Product Catalog 2024', type: 'PDF', size: '4.2 MB', restricted: false },
        { name: 'Nutrition Facts Sheet', type: 'PDF', size: '1.1 MB', restricted: false },
        { name: 'Ingredient Specifications', type: 'PDF', size: '2.3 MB', restricted: true },
      ],
    },
    {
      category: 'Marketing Assets',
      items: [
        { name: 'Product Photos (High-Res)', type: 'ZIP', size: '156 MB', restricted: true },
        { name: 'Logo Pack (All Formats)', type: 'ZIP', size: '8.4 MB', restricted: true },
        { name: 'Social Media Templates', type: 'ZIP', size: '24 MB', restricted: true },
        { name: 'POS Display Materials', type: 'PDF', size: '12 MB', restricted: true },
      ],
    },
    {
      category: 'Sales Materials',
      items: [
        { name: 'Sales Presentation Deck', type: 'PPTX', size: '18 MB', restricted: true },
        { name: 'Product One-Pagers', type: 'PDF', size: '3.5 MB', restricted: false },
        { name: 'Customer Testimonials Pack', type: 'ZIP', size: '45 MB', restricted: true },
      ],
    },
    {
      category: 'Training',
      items: [
        { name: 'Product Training Video', type: 'MP4', size: '320 MB', restricted: true },
        { name: 'FAQ Document', type: 'PDF', size: '0.8 MB', restricted: false },
        { name: 'Brand Guidelines', type: 'PDF', size: '5.2 MB', restricted: true },
      ],
    },
  ];

  return (
    <>
      <Header isB2B />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Distributor Resources</h1>
            <p className="text-gray-600">
              Download product catalogs, marketing assets, and sales materials.
            </p>
          </motion.div>

          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Some resources require login
                  </h3>
                  <p className="text-yellow-700 text-sm mb-3">
                    Sign in with your distributor account to access all resources including
                    high-resolution assets and marketing materials.
                  </p>
                  <Link
                    href="/login?callbackUrl=/fournisseurs/resources"
                    className="inline-block bg-yellow-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-900 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (categoryIndex + 1) }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b bg-gray-50">
                  <h2 className="text-lg font-bold">{category.category}</h2>
                </div>
                <div className="divide-y">
                  {category.items.map((item, itemIndex) => {
                    const canDownload = !item.restricted || isLoggedIn;
                    return (
                      <div
                        key={itemIndex}
                        className={`p-4 flex items-center justify-between ${
                          !canDownload ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              item.type === 'PDF'
                                ? 'bg-red-100 text-red-600'
                                : item.type === 'ZIP'
                                ? 'bg-purple-100 text-purple-600'
                                : item.type === 'PPTX'
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            <span className="text-xs font-bold">{item.type}</span>
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.size}</div>
                          </div>
                        </div>
                        {canDownload ? (
                          <button
                            onClick={() => alert(`Downloading: ${item.name}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35]/10 text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/20 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Download
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            Login Required
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Request Custom Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-br from-[#1A1A1A] to-[#333] text-white rounded-2xl p-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Need Custom Assets?</h2>
                <p className="text-gray-300">
                  Our marketing team can create co-branded materials tailored to your business.
                </p>
              </div>
              <Link
                href="/fournisseurs/contact"
                className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors whitespace-nowrap"
              >
                Request Custom Assets
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer isB2B />
    </>
  );
}
