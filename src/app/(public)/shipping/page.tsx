import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Livraison',
  description: 'Informations sur la livraison des produits Tamarque - Délais, tarifs et suivi',
};

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Livraison</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Délais de livraison</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🇫🇷</span>
                    <h3 className="font-semibold">France Métropolitaine</h3>
                  </div>
                  <p className="text-gray-600 mb-2">2 à 5 jours ouvrés</p>
                  <p className="text-sm text-gray-500">
                    Livraison par Colissimo ou Chronopost selon disponibilité
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🇧🇪🇱🇺🇨🇭</span>
                    <h3 className="font-semibold">Belgique, Luxembourg, Suisse</h3>
                  </div>
                  <p className="text-gray-600 mb-2">3 à 7 jours ouvrés</p>
                  <p className="text-sm text-gray-500">Livraison par transporteur partenaire</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🇪🇺</span>
                    <h3 className="font-semibold">Union Européenne</h3>
                  </div>
                  <p className="text-gray-600 mb-2">5 à 10 jours ouvrés</p>
                  <p className="text-sm text-gray-500">
                    Allemagne, Espagne, Italie, Pays-Bas, etc.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🌍</span>
                    <h3 className="font-semibold">International</h3>
                  </div>
                  <p className="text-gray-600 mb-2">7 à 14 jours ouvrés</p>
                  <p className="text-sm text-gray-500">
                    Contactez-nous pour les destinations hors UE
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-orange-50 rounded-2xl p-8 border-l-4 border-[var(--color-orange)]">
              <h2 className="text-2xl font-semibold mb-4">Livraison gratuite</h2>
              <p className="text-gray-700 text-lg">
                La livraison est <strong>offerte</strong> pour toute commande supérieure à{' '}
                <strong>50€</strong> en France métropolitaine.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Tarifs de livraison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1A1A1A] text-white">
                      <th className="px-6 py-4 text-left rounded-tl-xl">Destination</th>
                      <th className="px-6 py-4 text-left">Standard</th>
                      <th className="px-6 py-4 text-left rounded-tr-xl">Express</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-6 py-4 font-medium">France Métropolitaine</td>
                      <td className="px-6 py-4">4,90€ (gratuit dès 50€)</td>
                      <td className="px-6 py-4">9,90€</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="px-6 py-4 font-medium">Belgique, Luxembourg</td>
                      <td className="px-6 py-4">7,90€</td>
                      <td className="px-6 py-4">14,90€</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4 font-medium">Suisse</td>
                      <td className="px-6 py-4">12,90€</td>
                      <td className="px-6 py-4">19,90€</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="px-6 py-4 font-medium">Allemagne, Italie, Espagne</td>
                      <td className="px-6 py-4">8,90€</td>
                      <td className="px-6 py-4">16,90€</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Autres pays UE</td>
                      <td className="px-6 py-4">12,90€</td>
                      <td className="px-6 py-4">22,90€</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Suivi de commande</h2>
              <p className="text-gray-700 mb-4">
                Dès l&apos;expédition de votre commande, vous recevez un email contenant :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Un numéro de suivi unique</li>
                <li>Un lien direct vers le suivi en temps réel</li>
                <li>Les coordonnées du transporteur</li>
                <li>La date de livraison estimée</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Vous pouvez également suivre votre commande depuis votre{' '}
                <a href="/account" className="text-[var(--color-orange)] hover:underline">
                  espace client
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Questions fréquentes</h2>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Puis-je modifier mon adresse de livraison ?</h3>
                  <p className="text-gray-600">
                    Oui, tant que votre commande n&apos;a pas été expédiée. Contactez-nous rapidement
                    à contact@tamarque.com.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Que faire si mon colis arrive endommagé ?</h3>
                  <p className="text-gray-600">
                    Contactez-nous dans les 48h avec des photos du colis et des produits. Nous vous
                    enverrons un remplacement sans frais supplémentaires.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Livrez-vous en point relais ?</h3>
                  <p className="text-gray-600">
                    Oui, vous pouvez choisir la livraison en point relais lors de la commande.
                    Cette option est disponible en France métropolitaine uniquement.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Que se passe-t-il en cas d&apos;absence ?</h3>
                  <p className="text-gray-600">
                    Le transporteur laissera un avis de passage et votre colis sera disponible
                    en bureau de poste ou point relais pendant 14 jours.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Besoin d&apos;aide ?</h2>
              <p className="text-gray-600 mb-6">
                Notre service client est disponible du lundi au vendredi, de 9h à 18h.
              </p>
              <a href="/contact" className="btn-primary inline-block">
                Nous contacter
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
