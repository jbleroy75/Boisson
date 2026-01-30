import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles - Tamarque',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
          <p className="text-gray-500 mb-8">Dernière mise à jour : Janvier 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Tamarque SAS (&quot;nous&quot;, &quot;notre&quot;, &quot;nos&quot;) s&apos;engage à protéger la vie privée des
                utilisateurs de son site web www.tamarque.com. Cette politique de confidentialité
                explique comment nous collectons, utilisons, partageons et protégeons vos données
                personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Responsable du traitement</h2>
              <p className="text-gray-700 mb-4">Le responsable du traitement des données est :</p>
              <ul className="text-gray-700 space-y-1">
                <li>Tamarque SAS</li>
                <li>[Adresse complète]</li>
                <li>Email : privacy@tamarque.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Données collectées</h2>
              <p className="text-gray-700 mb-4">Nous collectons les types de données suivants :</p>

              <h3 className="text-xl font-medium mt-4 mb-2">3.1 Données fournies directement</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Informations d&apos;identification : nom, prénom, email, téléphone</li>
                <li>Informations de livraison : adresse postale</li>
                <li>Informations de paiement : traitées par notre prestataire Stripe</li>
                <li>Contenu des communications : messages via le formulaire de contact</li>
              </ul>

              <h3 className="text-xl font-medium mt-4 mb-2">3.2 Données collectées automatiquement</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Données de navigation : adresse IP, type de navigateur, pages visitées</li>
                <li>Données d&apos;appareil : type d&apos;appareil, système d&apos;exploitation</li>
                <li>Cookies et technologies similaires (voir section 7)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Finalités du traitement</h2>
              <p className="text-gray-700 mb-4">Nous utilisons vos données pour :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Traiter et livrer vos commandes</li>
                <li>Gérer votre compte client et le programme de fidélité</li>
                <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                <li>Améliorer notre site et nos services</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Base juridique du traitement</h2>
              <p className="text-gray-700 mb-4">Nous traitons vos données sur les bases suivantes :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Exécution du contrat :</strong> traitement des commandes, livraison</li>
                <li><strong>Consentement :</strong> newsletter, cookies marketing</li>
                <li><strong>Intérêt légitime :</strong> amélioration des services, prévention de la fraude</li>
                <li><strong>Obligation légale :</strong> conservation des factures, TVA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Durée de conservation</h2>
              <p className="text-gray-700 mb-4">Nous conservons vos données pendant :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Données clients actifs : durée de la relation commerciale + 3 ans</li>
                <li>Données comptables : 10 ans (obligation légale)</li>
                <li>Données de navigation : 13 mois maximum</li>
                <li>Comptes inactifs : supprimés après 3 ans d&apos;inactivité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <p className="text-gray-700 mb-4">Notre site utilise les types de cookies suivants :</p>

              <h3 className="text-xl font-medium mt-4 mb-2">Cookies nécessaires</h3>
              <p className="text-gray-700 mb-4">
                Essentiels au fonctionnement du site (panier, authentification). Ils ne peuvent
                pas être désactivés.
              </p>

              <h3 className="text-xl font-medium mt-4 mb-2">Cookies analytiques</h3>
              <p className="text-gray-700 mb-4">
                Google Analytics nous aide à comprendre comment les visiteurs utilisent le site.
                Ces données sont anonymisées.
              </p>

              <h3 className="text-xl font-medium mt-4 mb-2">Cookies marketing</h3>
              <p className="text-gray-700">
                Facebook Pixel permet de mesurer l&apos;efficacité de nos publicités et de vous
                proposer des annonces pertinentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Partage des données</h2>
              <p className="text-gray-700 mb-4">Nous partageons vos données avec :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Stripe :</strong> traitement des paiements</li>
                <li><strong>Transporteurs :</strong> livraison des commandes</li>
                <li><strong>Google, Facebook :</strong> analyse et publicité (avec consentement)</li>
                <li><strong>Autorités :</strong> si requis par la loi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Transferts internationaux</h2>
              <p className="text-gray-700">
                Certains de nos prestataires (Vercel, Stripe, Google) sont basés aux États-Unis.
                Ces transferts sont encadrés par les Clauses Contractuelles Types de la
                Commission européenne.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Vos droits</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> restreindre le traitement</li>
                <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong>Droit d&apos;opposition :</strong> vous opposer au marketing direct</li>
                <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Pour exercer ces droits, contactez-nous à : privacy@tamarque.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Sécurité</h2>
              <p className="text-gray-700">
                Nous mettons en oeuvre des mesures de sécurité techniques et organisationnelles
                appropriées : chiffrement SSL/TLS, authentification sécurisée, accès restreint
                aux données, sauvegardes régulières.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Réclamation</h2>
              <p className="text-gray-700">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire
                une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique
                et des Libertés) : www.cnil.fr
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Modifications</h2>
              <p className="text-gray-700">
                Cette politique peut être mise à jour. Les modifications substantielles vous
                seront notifiées par email ou via une bannière sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Contact</h2>
              <p className="text-gray-700">
                Pour toute question relative à cette politique, contactez-nous :
                <br />
                Email : privacy@tamarque.com
                <br />
                Adresse : Tamarque SAS, [Adresse complète]
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
