'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function FournisseursPage() {
  return (
    <>
      <Header isB2B />
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center bg-[#1A1A1A] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF6B35] rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#00D9A5] rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-4 py-1 bg-[#FF6B35] text-white rounded-full text-sm font-medium mb-6">
                  B2B Partnership
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Become a Tamarque
                  <br />
                  <span className="text-[#FF6B35]">Distributor</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                  Join our network of premium distributors. Exclusive margins, marketing support,
                  and territorial rights for the protein drink revolution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/fournisseurs/contact"
                    className="bg-[#FF6B35] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#E55A2B] transition-colors text-center"
                  >
                    Request Partnership
                  </Link>
                  <Link
                    href="/fournisseurs/dashboard"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors text-center"
                  >
                    Distributor Login
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '40%+', label: 'Profit Margins' },
                    { value: '200+', label: 'Active Partners' },
                    { value: '€2M+', label: 'Partner Revenue' },
                    { value: '24h', label: 'Order Fulfillment' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                    >
                      <div className="text-3xl font-bold text-[#FF6B35] mb-2">{stat.value}</div>
                      <div className="text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Why Partner With Us</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We provide everything you need to succeed as a Tamarque distributor.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '💰',
                  title: 'Competitive Margins',
                  description:
                    'Up to 50% discount on wholesale orders. Volume-based pricing tiers that grow with your business.',
                },
                {
                  icon: '🗺️',
                  title: 'Territorial Exclusivity',
                  description:
                    'Secure your region. We protect your territory from competing distributors.',
                },
                {
                  icon: '📦',
                  title: 'Fast Fulfillment',
                  description:
                    '24-hour order processing. Direct shipping to your warehouse or customers.',
                },
                {
                  icon: '📈',
                  title: 'Marketing Support',
                  description:
                    'POS materials, digital assets, and co-branded campaigns to drive sales.',
                },
                {
                  icon: '🎓',
                  title: 'Training & Support',
                  description:
                    'Dedicated account manager, product training, and 24/7 support line.',
                },
                {
                  icon: '💳',
                  title: 'Flexible Payment',
                  description:
                    'NET30 payment terms for qualified distributors. Stripe invoicing for easy tracking.',
                },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-8"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Volume Pricing */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Volume Pricing</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The more you order, the more you save. Simple, transparent pricing.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#1A1A1A] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Order Volume</th>
                      <th className="px-6 py-4 text-left">Discount</th>
                      <th className="px-6 py-4 text-left">Price/Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { volume: '1 - 99 units', discount: 'Standard', price: '€3.99' },
                      { volume: '100 - 499 units', discount: '30% OFF', price: '€2.79' },
                      { volume: '500 - 999 units', discount: '40% OFF', price: '€2.39' },
                      { volume: '1,000+ units', discount: '50% OFF', price: '€1.99' },
                    ].map((tier, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 font-medium">{tier.volume}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              tier.discount === 'Standard'
                                ? 'bg-gray-200 text-gray-700'
                                : 'bg-[#00D9A5]/10 text-[#00D9A5]'
                            }`}
                          >
                            {tier.discount}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#FF6B35]">{tier.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Distributor Success Stories</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  quote:
                    'Tamarque transformed our sports nutrition offering. The ice tea texture is a game-changer - our gym clients love it.',
                  author: 'Pierre Dubois',
                  company: 'FitDistrib Lyon',
                  revenue: '+45% revenue',
                },
                {
                  quote:
                    'The margins are excellent and the support team is always available. Best B2B partnership we have.',
                  author: 'Marie Laurent',
                  company: 'NutriPro Paris',
                  revenue: '+60% growth',
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-8"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{testimonial.author}</div>
                      <div className="text-gray-500 text-sm">{testimonial.company}</div>
                    </div>
                    <span className="px-3 py-1 bg-[#00D9A5]/10 text-[#00D9A5] rounded-full text-sm font-semibold">
                      {testimonial.revenue}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Partner?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join 200+ distributors who trust Tamarque. Request a quote today and start
                growing your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/fournisseurs/contact"
                  className="bg-white text-[#FF6B35] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Request Quote
                </Link>
                <Link
                  href="/fournisseurs/resources"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
                >
                  Download Catalog
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer isB2B />
    </>
  );
}
