import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales du site Tamarque.com',
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>
          <p className="text-gray-500 mb-8">Dernière mise à jour : Janvier 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Informations légales</h2>
              <p className="text-gray-700 mb-4">
                Le site www.tamarque.com est édité par :
              </p>
              <ul className="text-gray-700 space-y-2">
                <li><strong>Raison sociale :</strong> Tamarque SAS</li>
                <li><strong>Capital social :</strong> 10 000 euros</li>
                <li><strong>Siège social :</strong> [Adresse complète]</li>
                <li><strong>RCS :</strong> Paris XXX XXX XXX</li>
                <li><strong>N° TVA intracommunautaire :</strong> FR XX XXX XXX XXX</li>
                <li><strong>Email :</strong> contact@tamarque.com</li>
                <li><strong>Téléphone :</strong> +33 (0)1 XX XX XX XX</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Directeur de la publication</h2>
              <p className="text-gray-700">
                Le directeur de la publication est [Nom du dirigeant], en qualité de Président.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Hébergement</h2>
              <p className="text-gray-700 mb-4">
                Le site est hébergé par :
              </p>
              <ul className="text-gray-700 space-y-2">
                <li><strong>Vercel Inc.</strong></li>
                <li>340 S Lemon Ave #4133</li>
                <li>Walnut, CA 91789, États-Unis</li>
                <li>https://vercel.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
              <p className="text-gray-700 mb-4">
                L&apos;ensemble du contenu du site (textes, images, vidéos, logos, marques, etc.)
                est protégé par le droit de la propriété intellectuelle et appartient à Tamarque
                ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation.
              </p>
              <p className="text-gray-700">
                Toute reproduction, représentation, modification, publication, adaptation de tout
                ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé,
                est interdite sans autorisation écrite préalable de Tamarque.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Données personnelles</h2>
              <p className="text-gray-700">
                Les informations relatives au traitement des données personnelles sont détaillées
                dans notre <a href="/privacy" className="text-[var(--color-orange)] hover:underline">
                Politique de Confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
              <p className="text-gray-700">
                Le site utilise des cookies. Pour plus d&apos;informations sur leur utilisation,
                veuillez consulter notre <a href="/privacy" className="text-[var(--color-orange)] hover:underline">
                Politique de Confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation de responsabilité</h2>
              <p className="text-gray-700 mb-4">
                Tamarque s&apos;efforce de fournir sur le site des informations aussi précises que
                possible. Toutefois, elle ne pourra être tenue responsable des omissions, des
                inexactitudes et des carences dans la mise à jour.
              </p>
              <p className="text-gray-700">
                Tamarque décline toute responsabilité concernant les liens hypertextes qui
                pourraient renvoyer vers d&apos;autres sites internet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Droit applicable</h2>
              <p className="text-gray-700">
                Les présentes mentions légales sont régies par le droit français. En cas de
                litige, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
              <p className="text-gray-700">
                Pour toute question, vous pouvez nous contacter à l&apos;adresse :
                <a href="mailto:contact@tamarque.com" className="text-[var(--color-orange)] hover:underline ml-1">
                  contact@tamarque.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
