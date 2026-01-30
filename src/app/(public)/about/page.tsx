'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const TEAM_MEMBERS = [
  {
    name: 'Marie Laurent',
    role: 'Fondatrice & CEO',
    bio: 'Ancienne triathlète pro qui en avait marre des shakes protéinés à la craie.',
    emoji: '🏃‍♀️',
  },
  {
    name: 'Thomas Dubois',
    role: 'Directeur R&D',
    bio: 'Ingénieur agroalimentaire avec 15 ans d\'expérience en nutrition sportive.',
    emoji: '🧪',
  },
  {
    name: 'Sophie Martin',
    role: 'Directrice Marketing',
    bio: 'Stratège de marque passionnée par l\'innovation au service des athlètes.',
    emoji: '📣',
  },
  {
    name: 'Lucas Bernard',
    role: 'Nutritionniste sportif',
    bio: 'Docteur en nutrition sportive, conseiller d\'athlètes olympiques.',
    emoji: '🥇',
  },
];

const VALUES = [
  {
    icon: '🌿',
    title: '100% Naturel',
    description: 'Zéro édulcorant artificiel, zéro colorant, zéro conservateur. Jamais. Que des vrais ingrédients.',
  },
  {
    icon: '💡',
    title: 'L\'innovation d\'abord',
    description: 'On a passé 3 ans à développer notre texture ice tea unique. Le "suffisamment bien" n\'existe pas chez nous.',
  },
  {
    icon: '🏆',
    title: 'Performance avant tout',
    description: 'Chaque formule est testée par des athlètes de haut niveau. Si ça ne performe pas, ça ne sort pas.',
  },
  {
    icon: '🌍',
    title: 'Durabilité',
    description: 'Emballages recyclables, livraison neutre en carbone, approvisionnement responsable.',
  },
];

const TIMELINE = [
  {
    year: '2021',
    title: 'Le problème',
    description: 'Marie, frustrée par les shakes protéinés lourds pendant sa prépa marathon, commence à expérimenter dans sa cuisine.',
  },
  {
    year: '2022',
    title: 'La R&D commence',
    description: 'Partenariat avec des ingénieurs agroalimentaires pour développer la première formule protéinée texture ice tea.',
  },
  {
    year: '2023',
    title: 'Premier test',
    description: '500 athlètes testent notre formule. 94% la préfèrent aux shakes traditionnels. On savait qu\'on tenait quelque chose.',
  },
  {
    year: '2024',
    title: 'Lancement',
    description: 'Tamarque se lance officiellement avec 5 saveurs exotiques. La révolution de la protéine ice tea commence.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        {/* Hero */}
        <section className="relative bg-[#1A1A1A] text-white py-24 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#FF1493]/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1 bg-[#FF6B35]/20 rounded-full text-[#FF6B35] text-sm font-medium mb-6">
                Notre histoire
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Née d'une <span className="text-[#FF6B35]">frustration</span>.<br />
                Créée pour les <span className="text-[#00D9A5]">athlètes</span>.
              </h1>
              <p className="text-xl text-gray-300">
                On pense qu'une boisson protéinée devrait être un plaisir, pas une corvée.
                C'est pour ça qu'on a créé Tamarque &mdash; la première boisson protéinée
                texture ice tea.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                &ldquo;Pourquoi la récupération devrait être une punition ?&rdquo;
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Après des années à avaler des shakes épais et crayeux, notre fondatrice Marie
                en avait assez. Elle était triathlète de compétition, elle avait besoin de protéines
                mais détestait les boire. Il devait y avoir une meilleure solution.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed mt-4">
                Trois ans, d'innombrables expérimentations et une percée plus tard, Tamarque est née.
                Une boisson protéinée qui a la texture d'un ice tea mais qui délivre 20g de whey isolate premium.
                Légère, rafraîchissante, et vraiment délicieuse.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce en quoi on croit</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chaque décision qu'on prend est guidée par ces valeurs fondamentales.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {VALUES.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre parcours</h2>
              <p className="text-gray-600">De l'expérimentation en cuisine à la révolution ice tea.</p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2" />

              {TIMELINE.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 md:pr-8 md:text-right hidden md:block">
                    {index % 2 === 0 && (
                      <>
                        <span className="text-[#FF6B35] font-bold text-lg">{event.year}</span>
                        <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                        <p className="text-gray-600 mt-2">{event.description}</p>
                      </>
                    )}
                  </div>

                  <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-lg z-10 flex-shrink-0 shadow-lg">
                    {event.year.slice(2)}
                  </div>

                  <div className="flex-1 md:pl-8 pl-6">
                    {index % 2 === 1 ? (
                      <>
                        <span className="text-[#FF6B35] font-bold text-lg">{event.year}</span>
                        <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                        <p className="text-gray-600 mt-2">{event.description}</p>
                      </>
                    ) : (
                      <div className="md:hidden">
                        <span className="text-[#FF6B35] font-bold text-lg">{event.year}</span>
                        <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                        <p className="text-gray-600 mt-2">{event.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">L'équipe</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Athlètes, scientifiques et innovateurs unis par une mission commune.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEAM_MEMBERS.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">{member.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-[#FF6B35] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50 000+', label: 'Athlètes conquis' },
                { value: '1M+', label: 'Bouteilles vendues' },
                { value: '4.9/5', label: 'Note moyenne' },
                { value: '98%', label: 'Nous recommandent' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#1A1A1A] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Experience the Difference?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of athletes who&apos;ve made the switch to refreshing protein.
                20g protein, ice tea texture, 100% natural.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="px-8 py-4 bg-[#FF6B35] text-white rounded-xl font-semibold text-lg hover:bg-[#E55A2B] transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href="/subscribe"
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  Subscribe & Save 25%
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
