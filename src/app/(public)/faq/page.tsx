'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const FAQ_CATEGORIES = [
  {
    title: 'Produits',
    questions: [
      {
        q: 'Quelle est la composition de vos boissons ?',
        a: 'Nos boissons contiennent 20g de protéines de whey isolate par bouteille, avec des ingrédients 100% naturels. Chaque saveur est formulée avec des extraits de fruits et de plantes, sans sucres ajoutés, sans édulcorants artificiels et sans conservateurs.',
      },
      {
        q: 'Quelle est la texture des boissons Tamarque ?',
        a: 'C\'est notre innovation majeure ! Contrairement aux shakes protéinés traditionnels épais et laiteux, nos boissons ont une texture légère et rafraîchissante. Faciles à boire et faciles à boire, elles sont idéales avant, pendant ou après l\'effort.',
      },
      {
        q: 'Combien de calories par bouteille ?',
        a: 'Chaque bouteille contient environ 90 à 110 calories selon la saveur, avec 20g de protéines, moins de 2g de sucres naturels et 0g de matières grasses.',
      },
      {
        q: 'Vos produits conviennent-ils aux végétariens ?',
        a: 'Oui ! Nos protéines sont issues de whey (lactosérum), donc adaptées aux végétariens. En revanche, elles ne sont pas vegan car d\'origine laitière.',
      },
      {
        q: 'Quelle est la durée de conservation ?',
        a: 'Nos bouteilles se conservent 12 mois à température ambiante (éviter l\'exposition directe au soleil). Une fois ouvertes, elles doivent être consommées dans les 24h et conservées au réfrigérateur.',
      },
    ],
  },
  {
    title: 'Commandes & Livraison',
    questions: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'France métropolitaine : 2-5 jours ouvrés. Belgique, Luxembourg, Suisse : 3-7 jours ouvrés. Autres pays UE : 5-10 jours ouvrés.',
      },
      {
        q: 'Quels sont les frais de livraison ?',
        a: 'Livraison gratuite en France métropolitaine dès 50€ d\'achat. En dessous de ce montant, les frais sont de 4,90€. Pour les autres destinations, les frais sont calculés à la commande.',
      },
      {
        q: 'Puis-je suivre ma commande ?',
        a: 'Oui ! Dès l\'expédition de votre commande, vous recevrez un email avec un numéro de suivi vous permettant de suivre votre colis en temps réel.',
      },
      {
        q: 'Que faire si ma commande arrive endommagée ?',
        a: 'Contactez-nous dans les 48h suivant la réception avec des photos du colis et des produits endommagés. Nous vous enverrons un remplacement sans frais.',
      },
    ],
  },
  {
    title: 'Abonnements',
    questions: [
      {
        q: 'Comment fonctionne l\'abonnement ?',
        a: 'Choisissez votre pack (Starter, Athlete ou Team), vos saveurs préférées et la fréquence de livraison (1, 2 ou 4 semaines). Vous êtes livré automatiquement et bénéficiez de 15% de réduction permanente.',
      },
      {
        q: 'Puis-je modifier ou annuler mon abonnement ?',
        a: 'Absolument ! Vous pouvez modifier vos saveurs, changer la fréquence, mettre en pause ou annuler à tout moment depuis votre espace client. Aucun engagement minimum.',
      },
      {
        q: 'Quand suis-je débité ?',
        a: 'Le débit a lieu quelques jours avant chaque livraison. Vous recevez un email de rappel 5 jours avant pour vous laisser le temps de modifier votre commande si besoin.',
      },
    ],
  },
  {
    title: 'Programme Fidélité',
    questions: [
      {
        q: 'Comment fonctionne le programme de fidélité ?',
        a: 'Chaque euro dépensé vous rapporte 1 point. Accumulez des points pour débloquer des récompenses : réductions, produits gratuits, accès VIP. Plus vous êtes fidèle, plus votre multiplicateur de points augmente !',
      },
      {
        q: 'Quels sont les niveaux de fidélité ?',
        a: 'Il existe 4 niveaux : Bronze (départ), Silver (500 points), Gold (1500 points) et Platinum (5000 points). Chaque niveau offre des avantages croissants : multiplicateur de points, livraison gratuite, accès anticipé aux nouveautés.',
      },
      {
        q: 'Mes points expirent-ils ?',
        a: 'Les points sont valables 12 mois à partir de leur date d\'acquisition. Toute nouvelle commande réactive le compteur !',
      },
    ],
  },
  {
    title: 'Paiement & Sécurité',
    questions: [
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Nous acceptons les cartes Visa, Mastercard et American Express. Tous les paiements sont sécurisés par Stripe.',
      },
      {
        q: 'Mon paiement est-il sécurisé ?',
        a: 'Oui, nous utilisons Stripe, leader mondial du paiement en ligne. Vos données bancaires ne transitent jamais par nos serveurs et sont protégées par un chiffrement SSL.',
      },
      {
        q: 'Puis-je payer en plusieurs fois ?',
        a: 'Pour l\'instant, nous ne proposons pas le paiement en plusieurs fois. Cette option sera disponible prochainement.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left hover:text-[var(--color-orange)] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium pr-4">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="text-2xl text-[var(--color-orange)] shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Questions Fréquentes</h1>
            <p className="text-gray-600 text-lg">
              Vous ne trouvez pas votre réponse ?{' '}
              <Link href="/contact" className="text-[var(--color-orange)] hover:underline">
                Contactez-nous
              </Link>
            </p>
          </div>

          <div className="space-y-8">
            {FAQ_CATEGORIES.map((category) => (
              <section key={category.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-orange)]">
                  {category.title}
                </h2>
                <div>
                  {category.questions.map((item, index) => (
                    <FAQItem key={index} question={item.q} answer={item.a} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Besoin d&apos;aide supplémentaire ?</h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est disponible du lundi au vendredi, de 9h à 18h.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary inline-block">
                Nous contacter
              </Link>
              <a href="mailto:contact@tamarque.com" className="btn-secondary inline-block">
                contact@tamarque.com
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
