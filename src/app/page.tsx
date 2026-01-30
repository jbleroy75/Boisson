'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { MOCK_PRODUCTS, MOCK_REVIEWS, FLAVOR_COLORS, PLACEHOLDER_IMAGES } from '@/lib/constants';
import { SocialProofPopup, LiveVisitorCount } from '@/components/shop/SocialProof';

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } };

  const fadeInLeft = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } };

  const fadeInRight = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } };

  const scaleIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } };

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 overflow-hidden">
        {/* Hero Section - Bold & Dramatic */}
        <section className="relative min-h-[100vh] flex items-center bg-[#0A0A0A] overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 via-[#FF1493]/10 to-transparent" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B35]/10 rounded-full blur-[150px] animate-pulse-subtle" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D9A5]/10 rounded-full blur-[120px] animate-pulse-subtle delay-500" />
          </div>

          {/* Geometric decorations */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-[#FF6B35]/20 rounded-full animate-rotate-slow" />
          <div className="absolute bottom-40 right-20 w-48 h-48 border-2 border-[#00D9A5]/15 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-[#FF6B35] rounded-full animate-float" />
          <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#00D9A5] rounded-full animate-float delay-300" />

          {/* Stripe pattern overlay */}
          <div className="absolute inset-0 stripe-pattern opacity-30" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left content */}
              <motion.div
                {...fadeInLeft}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Badge with live count */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8"
                >
                  <LiveVisitorCount />
                </motion.div>

                {/* Main headline */}
                <h1 className="text-white mb-6">
                  <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none">
                    PROTÉINES
                  </span>
                  <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none text-gradient bg-gradient-to-r from-[#FF6B35] via-[#FF1493] to-[#FF6B35] bg-clip-text text-transparent">
                    + ÉNERGIE
                  </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-white/60 mb-10 max-w-lg leading-relaxed font-light">
                  La première boisson qui combine{' '}
                  <span className="text-white font-medium">20g de protéines</span> et{' '}
                  <span className="text-[#00D9A5] font-medium">caféine naturelle</span>.{' '}
                  Prête à boire, sans shaker. Ouvre, bois, performe.
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-8 mb-10">
                  {[
                    { value: '20g', label: 'Protéines', color: '#FF6B35' },
                    { value: '80mg', label: 'Caféine', color: '#00D9A5' },
                    { value: '0%', label: 'Sucres ajoutés', color: '#FF1493' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-3xl md:text-4xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                      <div className="text-white/40 text-sm uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      href="/shop"
                      className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#FF6B35] text-white font-semibold text-lg overflow-hidden transition-all hover:shadow-glow-orange"
                    >
                      <span className="relative z-10 uppercase tracking-widest text-sm">
                        Découvrir
                      </span>
                      <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="absolute inset-0 flex items-center justify-center text-[#FF6B35] uppercase tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        Découvrir
                      </span>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Link
                      href="/subscribe"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all uppercase tracking-widest text-sm"
                    >
                      S&apos;abonner -25%
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right - Hero Image */}
              <motion.div
                {...fadeInRight}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="relative"
              >
                <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/30 to-[#FF1493]/30 blur-3xl scale-90" />

                  {/* Main image container */}
                  <div className="relative h-full rounded-[2rem] overflow-hidden border border-white/10">
                    <Image
                      src={PLACEHOLDER_IMAGES.athlete}
                      alt="Athlete avec Tamarque"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Floating product cards */}
                    <div className="absolute bottom-6 left-4 right-4 flex gap-3">
                      {MOCK_PRODUCTS.slice(0, 3).map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden mb-2">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <p className="text-white text-xs font-medium truncate">{product.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
            </div>
          </motion.div>
        </section>

        {/* Benefits Strip */}
        <section className="bg-[#FF6B35] py-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-8 mx-8">
                {['20G PROTÉINES', 'CAFÉINE NATURELLE', 'PRÊT À BOIRE', 'ZÉRO SUCRES AJOUTÉS', '100% NATUREL'].map((text, i) => (
                  <span key={i} className="text-white font-bold text-sm md:text-base uppercase tracking-wider flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full" />
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left - Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Fabriqué en France</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Livraison 24-48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Satisfait ou remboursé</span>
                </div>
              </div>

              {/* Center - Yuka Score */}
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F0FDF4] border border-[#00D9A5]/20 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#00D9A5] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">78</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#0A0A0A]">Yuka</span>
                    <span className="text-xs bg-[#00D9A5] text-white px-1.5 py-0.5 rounded font-medium">Bon</span>
                  </div>
                  <p className="text-xs text-gray-500">Score nutritionnel vérifié</p>
                </div>
              </div>

              {/* Right - Customer reviews */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['E', 'M', 'L', 'T', 'S'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF1493] flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.8/5</span>
                  </div>
                  <p className="text-xs text-gray-400">+500 avis clients</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Tamarque Section */}
        <section className="py-20 md:py-32 bg-[#FDF8F3] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 border border-[#FF6B35]/10 rounded-full" />
          <div className="absolute bottom-20 left-20 w-48 h-48 border border-[#00D9A5]/10 rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#FF6B35]/10 text-[#FF6B35] text-sm font-semibold uppercase tracking-wider mb-6">
                Pourquoi Tamarque
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                FINI LES SHAKES
                <span className="block text-gradient">EN POUDRE</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
                Une boisson prête à boire qui se consomme comme un Red Bull ou une Evian.
                Tu ouvres, tu bois, tu performes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Traditional Protein - Red card */}
              <motion.div
                {...fadeInLeft}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-10 border-2 border-gray-200 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl text-gray-400">PROTEINES</h3>
                    <p className="text-gray-400">En poudre</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {[
                    'Besoin d\'un shaker et d\'eau',
                    'Texture épaisse et écœurante',
                    'Provoque des ballonnements',
                    'Goût artificiel',
                    'Pas pratique en déplacement',
                    'Aucun boost d\'énergie'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tamarque - Orange card */}
              <motion.div
                {...fadeInRight}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl" />

                <div className="flex items-center gap-4 mb-8 relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl">TAMARQUE</h3>
                    <p className="text-white/70">Boisson prête à boire</p>
                  </div>
                </div>
                <ul className="space-y-4 relative">
                  {[
                    'Prêt à boire, comme un soda',
                    'Rafraîchissant et léger',
                    'Zéro ballonnement',
                    'Goût 100% naturel',
                    'Parfait en salle, au bureau, partout',
                    'Boost d\'énergie avec 80mg de caféine'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Flavors Section */}
        <section className="py-20 md:py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16"
            >
              <div>
                <span className="inline-block px-4 py-2 bg-[#00D9A5]/10 text-[#00D9A5] text-sm font-semibold uppercase tracking-wider mb-6">
                  5 saveurs exotiques
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl">
                  TROUVE TA
                  <span className="block text-gradient-tropical">SAVEUR</span>
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-md mt-6 lg:mt-0 font-light">
                Élaborées avec de vrais extraits de fruits.
                20g de protéines, 80mg de caféine, zéro compromis.
              </p>
            </motion.div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {MOCK_PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group block product-card rounded-2xl overflow-hidden"
                  >
                    <div
                      className="aspect-[3/4] relative overflow-hidden"
                      style={{ backgroundColor: FLAVOR_COLORS[product.flavor] + '15' }}
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover product-image"
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{ backgroundColor: FLAVOR_COLORS[product.flavor] }}
                      />

                      {/* Quick add button */}
                      <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <button className="w-full py-3 bg-[#0A0A0A] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#FF6B35] transition-colors">
                          Ajouter
                        </button>
                      </div>

                      {/* Tags */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {product.sportType.slice(0, 1).map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-semibold uppercase tracking-wider"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base mb-1 group-hover:text-[#FF6B35] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#FF6B35] font-bold">{product.price.toFixed(2)}€</span>
                        {product.compareAtPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {product.compareAtPrice.toFixed(2)}€
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A0A0A] text-white font-semibold hover:bg-[#FF6B35] transition-colors uppercase tracking-wider text-sm"
              >
                Voir toutes les saveurs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#FF6B35]/10 text-[#FF6B35] text-sm font-semibold uppercase tracking-wider mb-6">
                Simple comme bonjour
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl">
                COMMENT ÇA
                <span className="block text-gradient">MARCHE</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: '01',
                  title: 'Commande',
                  description: 'Choisis tes saveurs préférées ou laisse-toi surprendre par notre pack découverte.',
                  icon: '📦',
                },
                {
                  step: '02',
                  title: 'Reçois',
                  description: 'Livraison en 24-48h chez toi ou en point relais. Tes bouteilles arrivent fraîches.',
                  icon: '🚚',
                },
                {
                  step: '03',
                  title: 'Performe',
                  description: 'Ouvre ta bouteille avant ou après ta séance. Pas de shaker, pas de prise de tête.',
                  icon: '💪',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center relative"
                >
                  {/* Connector line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
                  )}

                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF6B35]/10 to-[#FF1493]/10 flex items-center justify-center text-5xl relative">
                    {item.icon}
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#FF6B35] text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 font-light max-w-xs mx-auto">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* USP Section */}
        <section className="py-20 md:py-32 bg-[#0A0A0A] text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF6B35]/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00D9A5]/5 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                POURQUOI LES ATHLÈTES
                <span className="block text-[#FF6B35]">NOUS ADORENT</span>
              </h2>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light">
                Conçue pour la performance, pensée pour le plaisir.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  icon: '💪',
                  title: '20G PROTÉINES',
                  description: 'Whey isolate premium pour une absorption maximale et une récupération optimale.',
                  color: '#FF6B35',
                },
                {
                  icon: '⚡',
                  title: '80MG CAFÉINE',
                  description: 'Caféine naturelle pour un boost d\'énergie clean, sans nervosité ni crash.',
                  color: '#00D9A5',
                },
                {
                  icon: '🥤',
                  title: 'PRÊT À BOIRE',
                  description: 'Tu ouvres, tu bois. Pas de shaker, pas de poudre, pas de prise de tête.',
                  color: '#FF1493',
                },
                {
                  icon: '🌿',
                  title: '100% NATUREL',
                  description: 'Sans édulcorants artificiels, sans colorants, sans conservateurs. Que du vrai.',
                  color: '#FFD700',
                },
              ].map((usp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 md:p-8 border border-white/10 rounded-2xl hover:border-white/20 transition-colors relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 relative"
                    style={{ backgroundColor: usp.color + '20' }}
                  >
                    {usp.icon}
                  </div>
                  <h3 className="text-xl mb-3 relative" style={{ color: usp.color }}>{usp.title}</h3>
                  <p className="text-white/60 font-light relative">{usp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 bg-[#FDF8F3] relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#FF1493]/10 text-[#FF1493] text-sm font-semibold uppercase tracking-wider mb-6">
                Avis clients
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl">
                CE QU&apos;ILS EN
                <span className="block text-gradient">PENSENT</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  rating: 5,
                  comment: "Enfin une boisson protéinée qui a vraiment bon goût ! Je la prends après mes séances de crossfit, c'est devenu un rituel. Le petit boost de caféine est parfait.",
                  author: "Maxime D.",
                  sport: "Crossfit",
                  verified: true,
                },
                {
                  rating: 5,
                  comment: "J'en ai marre des shakers qui fuient dans mon sac. Avec Tamarque, j'ouvre ma bouteille et c'est réglé. Le goût Yuzu Pêche est incroyable.",
                  author: "Sarah L.",
                  sport: "Fitness",
                  verified: true,
                },
                {
                  rating: 4,
                  comment: "Très pratique pour le bureau. Je la bois à 15h quand j'ai un coup de mou. Les 20g de protéines + la caféine, c'est le combo parfait pour tenir jusqu'au soir.",
                  author: "Thomas B.",
                  sport: "Running",
                  verified: true,
                },
              ].map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-700 mb-6 font-light leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF1493] flex items-center justify-center text-white font-semibold">
                        {review.author[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{review.author}</p>
                        {review.verified && (
                          <p className="text-sm text-[#00D9A5] flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Achat vérifié
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {review.sport}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* See all reviews link */}
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <p className="text-gray-500 text-sm">
                Note moyenne : <span className="font-semibold text-[#0A0A0A]">4.8/5</span> basée sur 500+ avis
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-[#FF6B35] via-[#FF1493] to-[#00D9A5] text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float delay-500" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              {...scaleIn}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-7xl mb-6">
                PRÊT À ESSAYER ?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
                Commande ton premier pack et découvre pourquoi tant de sportifs
                ont adopté Tamarque pour leur routine quotidienne.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#FF6B35] font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors uppercase tracking-wider"
                >
                  Découvrir les saveurs
                </Link>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-bold hover:bg-white/10 transition-colors uppercase tracking-wider"
                >
                  S&apos;abonner & économiser
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Livraison offerte dès 35€
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Satisfait ou remboursé
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Paiement sécurisé
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Social Proof Popup */}
      <SocialProofPopup />

      {/* Marquee animation styles */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>
  );
}
