'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MOCK_PRODUCTS, MOCK_REVIEWS, FLAVOR_COLORS } from '@/lib/constants';

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants that respect reduced motion preference
  const fadeInLeft = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } };

  const fadeInUp = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

  const scaleIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } };

  const getDelay = (index: number) => (shouldReduceMotion ? 0 : index * 0.1);
  const getTransition = (delay: number = 0) => ({
    duration: shouldReduceMotion ? 0 : 0.6,
    delay: shouldReduceMotion ? 0 : delay,
  });

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section
          className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 to-white overflow-hidden"
          aria-labelledby="hero-heading"
        >
          {/* Decorative background - hidden from screen readers */}
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B35] rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00D9A5] rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                {...fadeInLeft}
                transition={getTransition()}
              >
                <span className="inline-block px-4 py-1.5 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium mb-6">
                  Nouveau : La texture ice tea révolutionnaire
                </span>
                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                >
                  La protéine qui
                  <br />
                  <span className="text-gradient">rafraîchit</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                  La première boisson protéinée texture ice tea. 20g de protéines, 100% naturelle,
                  zéro ballonnement. Enfin une protéine que tu as envie de boire.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/shop"
                    className="btn-primary text-center text-base md:text-lg px-6 md:px-8 py-3 md:py-4 touch-target"
                  >
                    Découvrir
                  </Link>
                  <Link
                    href="/fournisseurs"
                    className="btn-secondary text-center text-base md:text-lg px-6 md:px-8 py-3 md:py-4 touch-target"
                  >
                    Devenir distributeur
                  </Link>
                </div>

                {/* Stats */}
                <dl className="flex flex-wrap gap-6 md:gap-8 mt-10 md:mt-12">
                  <div>
                    <dt className="sr-only">Quantité de protéines</dt>
                    <dd className="text-2xl md:text-3xl font-bold text-[#FF6B35]">20g</dd>
                    <dd className="text-sm text-gray-500">Protéines</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Taux de ballonnement</dt>
                    <dd className="text-2xl md:text-3xl font-bold text-[#00D9A5]">0%</dd>
                    <dd className="text-sm text-gray-500">Ballonnement</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Pourcentage d&apos;ingrédients naturels</dt>
                    <dd className="text-2xl md:text-3xl font-bold text-[#FF1493]">100%</dd>
                    <dd className="text-sm text-gray-500">Naturel</dd>
                  </div>
                </dl>
              </motion.div>

              <motion.div
                {...scaleIn}
                transition={getTransition(0.2)}
                className="relative"
              >
                <div className="relative h-[350px] sm:h-[400px] md:h-[500px] w-full bg-gradient-to-br from-[#FF6B35]/20 to-[#FF1493]/20 rounded-3xl flex items-center justify-center">
                  {/* Placeholder for hero image/video */}
                  <div className="text-center">
                    <div
                      className="w-24 sm:w-32 h-48 sm:h-64 bg-gradient-to-b from-[#FFD700] to-[#FF6B35] rounded-2xl mx-auto shadow-2xl transform -rotate-6"
                      role="img"
                      aria-label="Bouteille Tamarque"
                    />
                    <p className="mt-6 text-gray-500 text-sm">Vidéo à venir</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Ice Tea Texture Comparison Section */}
        <section className="py-16 md:py-20 bg-white" aria-labelledby="comparison-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={getTransition()}
              className="text-center mb-12 md:mb-16"
            >
              <h2 id="comparison-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Texture Ice Tea
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                On a réinventé la protéine. Légère, claire, rafraîchissante. Fini les shakes épais et lourds.
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={getTransition(0.2)}
              className="bg-gray-50 rounded-3xl p-6 md:p-8 lg:p-12"
            >
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Traditional Protein */}
                <article className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-500">Protéines classiques</h3>
                  </div>
                  <ul className="space-y-4" aria-label="Inconvénients des protéines traditionnelles">
                    {['Texture épaisse et crémeuse', 'Lourdeur à l\'estomac', 'Provoque des ballonnements', 'Goût artificiel', 'Difficile à digérer'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-500">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>

                {/* Tamarque */}
                <article className="bg-gradient-to-br from-[#FF6B35]/10 to-[#00D9A5]/10 rounded-2xl p-6 border-2 border-[#FF6B35]">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Tamarque</h3>
                  </div>
                  <ul className="space-y-4" aria-label="Avantages de Tamarque">
                    {['Texture légère ice tea', 'Rafraîchissante et légère', 'Zéro ballonnement', 'Goût 100% naturel', 'Digestion facile'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#00D9A5] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Flavors Grid Section */}
        <section className="py-16 md:py-20 bg-gray-50" aria-labelledby="flavors-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={getTransition()}
              className="text-center mb-12 md:mb-16"
            >
              <h2 id="flavors-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                5 Saveurs Exotiques
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Élaborées avec de vrais extraits de fruits. Chaque saveur raconte une histoire.
              </p>
            </motion.div>

            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6" aria-label="Nos saveurs">
              {MOCK_PRODUCTS.map((product, index) => (
                <motion.li
                  key={product.id}
                  {...fadeInUp}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={getTransition(getDelay(index))}
                >
                  <Link
                    href={`/shop/${product.slug}`}
                    className="block product-card bg-white rounded-2xl overflow-hidden focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2"
                  >
                    <div
                      className="h-40 md:h-48 relative"
                      style={{ backgroundColor: FLAVOR_COLORS[product.flavor] + '40' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-12 md:w-16 h-24 md:h-32 rounded-xl shadow-lg transform -rotate-6"
                          style={{ backgroundColor: FLAVOR_COLORS[product.flavor] }}
                          role="img"
                          aria-label={`Bouteille ${product.name}`}
                        />
                      </div>
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-bold text-base md:text-lg mb-1">{product.name}</h3>
                      <p className="text-[#FF6B35] font-semibold">{product.price.toFixed(2)}€</p>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={getTransition(0.5)}
              className="text-center mt-10 md:mt-12"
            >
              <Link
                href="/shop"
                className="btn-primary inline-block text-base md:text-lg px-6 md:px-8 py-3 md:py-4 touch-target"
              >
                Voir toutes les saveurs
              </Link>
            </motion.div>
          </div>
        </section>

        {/* USP Section */}
        <section className="py-16 md:py-20 bg-white" aria-labelledby="usp-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={getTransition()}
              className="text-center mb-12 md:mb-16"
            >
              <h2 id="usp-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Pourquoi les athlètes nous adorent
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Conçue pour la performance, pensée pour le plaisir.
              </p>
            </motion.div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" aria-label="Nos avantages">
              {[
                {
                  icon: '💪',
                  iconLabel: 'Force',
                  title: '20g Protéines',
                  description: 'Whey isolate premium pour une absorption maximale et une récupération optimale.',
                  color: '#FF6B35',
                },
                {
                  icon: '🌿',
                  iconLabel: 'Naturel',
                  title: '100% Naturel',
                  description: 'Sans édulcorants artificiels, sans colorants, sans conservateurs. Que du vrai.',
                  color: '#00D9A5',
                },
                {
                  icon: '⚡',
                  iconLabel: 'Énergie',
                  title: 'Énergie Clean',
                  description: 'Caféine naturelle du matcha et thé vert. Sans nervosité, sans coup de barre.',
                  color: '#FF1493',
                },
                {
                  icon: '🪶',
                  iconLabel: 'Légèreté',
                  title: 'Zéro Ballonnement',
                  description: 'Texture ice tea légère qui passe facilement, même pendant l\'effort.',
                  color: '#FFD700',
                },
              ].map((usp, index) => (
                <motion.li
                  key={index}
                  {...fadeInUp}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={getTransition(getDelay(index))}
                  className="text-center p-4 md:p-6"
                >
                  <div
                    className="w-16 md:w-20 h-16 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl mx-auto mb-4 md:mb-6"
                    style={{ backgroundColor: usp.color + '20' }}
                    role="img"
                    aria-label={usp.iconLabel}
                  >
                    {usp.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{usp.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{usp.description}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-20 bg-[#1A1A1A] text-white" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={getTransition()}
              className="text-center mb-12 md:mb-16"
            >
              <h2 id="testimonials-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Les athlètes nous font confiance
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Rejoins des milliers d&apos;athlètes qui ont découvert une nouvelle façon de consommer des protéines.
              </p>
            </motion.div>

            <ul className="grid md:grid-cols-3 gap-6 md:gap-8" aria-label="Témoignages clients">
              {MOCK_REVIEWS.slice(0, 3).map((review, index) => (
                <motion.li
                  key={review.id}
                  {...fadeInUp}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={getTransition(getDelay(index))}
                >
                  <article className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 h-full">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4" role="img" aria-label={`Note : ${review.rating} sur 5 étoiles`}>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? 'text-[#FFD700]' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <blockquote>
                      <p className="text-gray-300 mb-6 italic">&ldquo;{review.comment}&rdquo;</p>
                    </blockquote>

                    <footer className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-full flex items-center justify-center text-white font-bold"
                        aria-hidden="true"
                      >
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <cite className="font-semibold not-italic">{review.author}</cite>
                        {review.verified && (
                          <p className="text-xs text-[#00D9A5] flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Achat vérifié
                          </p>
                        )}
                      </div>
                    </footer>
                  </article>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] text-white" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              {...fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={getTransition()}
            >
              <h2 id="cta-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Prêt à changer ta routine ?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Rejoins des milliers d&apos;athlètes qui ont découvert qu&apos;une protéine peut être efficace ET agréable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="bg-white text-[#FF6B35] px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-gray-100 transition-colors touch-target"
                >
                  Commander
                </Link>
                <Link
                  href="/subscribe"
                  className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-white/10 transition-colors touch-target"
                >
                  S&apos;abonner et économiser 25%
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
