import { Metadata } from 'next';
import Script from 'next/script';
import { getStaticPageMetadata } from '@/lib/seo';
import { generateFAQSchema } from '@/lib/seo/schemas';

export const metadata: Metadata = getStaticPageMetadata('faq');

// FAQ data for schema
const FAQ_DATA = [
  {
    question: 'Quelle est la composition de vos boissons ?',
    answer: 'Nos boissons contiennent 20g de protéines de whey isolate par bouteille, avec des ingrédients 100% naturels. Chaque saveur est formulée avec des extraits de fruits et de plantes, sans sucres ajoutés, sans édulcorants artificiels et sans conservateurs.',
  },
  {
    question: 'Quelle est la texture des boissons Tamarque ?',
    answer: "C'est notre innovation majeure ! Contrairement aux shakes protéinés traditionnels épais et laiteux, nos boissons ont une texture légère type ice tea. Rafraîchissantes et faciles à boire, elles sont idéales avant, pendant ou après l'effort.",
  },
  {
    question: 'Combien de calories par bouteille ?',
    answer: 'Chaque bouteille contient environ 90 à 110 calories selon la saveur, avec 20g de protéines, moins de 2g de sucres naturels et 0g de matières grasses.',
  },
  {
    question: 'Quels sont les délais de livraison ?',
    answer: 'France métropolitaine : 2-5 jours ouvrés. Belgique, Luxembourg, Suisse : 3-7 jours ouvrés. Autres pays UE : 5-10 jours ouvrés.',
  },
  {
    question: 'Quels sont les frais de livraison ?',
    answer: "Livraison gratuite en France métropolitaine dès 50€ d'achat. En dessous de ce montant, les frais sont de 4,90€.",
  },
  {
    question: "Comment fonctionne l'abonnement ?",
    answer: 'Choisissez votre pack, vos saveurs préférées et la fréquence de livraison. Vous êtes livré automatiquement et bénéficiez de 15% de réduction permanente. Modifiez ou annulez à tout moment.',
  },
  {
    question: 'Comment fonctionne le programme de fidélité ?',
    answer: 'Chaque euro dépensé vous rapporte 1 point. Accumulez des points pour débloquer des récompenses : réductions, produits gratuits, accès VIP.',
  },
  {
    question: 'Mon paiement est-il sécurisé ?',
    answer: 'Oui, nous utilisons Stripe, leader mondial du paiement en ligne. Vos données bancaires ne transitent jamais par nos serveurs et sont protégées par un chiffrement SSL.',
  },
];

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqSchema = generateFAQSchema(FAQ_DATA);

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      {children}
    </>
  );
}
