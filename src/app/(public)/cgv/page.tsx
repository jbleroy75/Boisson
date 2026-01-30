import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description: 'Conditions Générales de Vente de Tamarque - Boissons protéinées',
};

export default function CGVPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
          <p className="text-gray-500 mb-8">Dernière mise à jour : Janvier 2026</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 1 - Objet</h2>
              <p className="text-gray-700 mb-4">
                Les présentes conditions générales de vente (CGV) régissent les ventes de produits
                effectuées par la société Tamarque, SAS au capital de 10 000 euros, immatriculée
                au RCS de Paris sous le numéro XXX XXX XXX, dont le siège social est situé au
                [adresse], ci-après dénommée &quot;le Vendeur&quot;.
              </p>
              <p className="text-gray-700">
                Elles s&apos;appliquent à toutes les ventes conclues sur le site internet
                www.tamarque.com, ci-après dénommé &quot;le Site&quot;.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 2 - Produits</h2>
              <p className="text-gray-700 mb-4">
                Les produits proposés à la vente sont des boissons protéinées. Leurs caractéristiques
                essentielles sont présentées sur les fiches produits du Site.
              </p>
              <p className="text-gray-700">
                Les photographies des produits sont les plus fidèles possibles mais ne peuvent assurer
                une similitude parfaite avec le produit offert.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 3 - Prix</h2>
              <p className="text-gray-700 mb-4">
                Les prix sont indiqués en euros toutes taxes comprises (TTC), hors frais de livraison.
                Le montant des frais de livraison est indiqué avant la validation de la commande.
              </p>
              <p className="text-gray-700">
                Le Vendeur se réserve le droit de modifier ses prix à tout moment. Les produits sont
                facturés au prix en vigueur au moment de la validation de la commande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 4 - Commande</h2>
              <p className="text-gray-700 mb-4">
                Le Client peut passer commande sur le Site. La vente est conclue dès la confirmation
                de la commande par le Vendeur, matérialisée par l&apos;envoi d&apos;un email de confirmation.
              </p>
              <p className="text-gray-700">
                Le Vendeur se réserve le droit d&apos;annuler toute commande d&apos;un Client avec lequel il
                existerait un litige.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 5 - Paiement</h2>
              <p className="text-gray-700 mb-4">
                Le paiement s&apos;effectue par carte bancaire (Visa, Mastercard, American Express) via
                notre prestataire de paiement sécurisé Stripe.
              </p>
              <p className="text-gray-700">
                Le débit de la carte est effectué au moment de la validation de la commande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 6 - Livraison</h2>
              <p className="text-gray-700 mb-4">
                Les produits sont livrés à l&apos;adresse indiquée par le Client lors de la commande.
                Les délais de livraison sont indicatifs.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>France métropolitaine : 2 à 5 jours ouvrés</li>
                <li>Belgique, Luxembourg, Suisse : 3 à 7 jours ouvrés</li>
                <li>Autres pays de l&apos;UE : 5 à 10 jours ouvrés</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 7 - Droit de rétractation</h2>
              <p className="text-gray-700 mb-4">
                Conformément aux dispositions légales en vigueur, le Client dispose d&apos;un délai de
                14 jours à compter de la réception des produits pour exercer son droit de rétractation.
              </p>
              <p className="text-gray-700 mb-4">
                Ce droit ne s&apos;applique pas aux produits alimentaires ouverts ou dont la date limite
                de consommation est proche.
              </p>
              <p className="text-gray-700">
                Pour exercer ce droit, le Client doit envoyer un email à contact@tamarque.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 8 - Garantie</h2>
              <p className="text-gray-700">
                Les produits bénéficient de la garantie légale de conformité et de la garantie des
                vices cachés, dans les conditions prévues par la loi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 9 - Réclamations</h2>
              <p className="text-gray-700 mb-4">
                Pour toute réclamation, le Client peut contacter le Service Client :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Par email : contact@tamarque.com</li>
                <li>Par courrier : Tamarque, [adresse]</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 10 - Données personnelles</h2>
              <p className="text-gray-700">
                Les données personnelles collectées sont traitées conformément à notre
                Politique de Confidentialité, accessible sur le Site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 11 - Droit applicable</h2>
              <p className="text-gray-700">
                Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux
                de Paris sont compétents.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
