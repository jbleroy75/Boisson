import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Page non trouvée',
  description: 'La page que vous recherchez n\'existe pas.',
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center max-w-lg">
          <div className="text-[150px] font-bold text-gradient leading-none mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page non trouvée
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Oups ! La page que vous recherchez semble avoir disparu.
            Elle a peut-être été déplacée ou n&apos;existe plus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary inline-block">
              Retour à l&apos;accueil
            </Link>
            <Link href="/shop" className="btn-secondary inline-block">
              Voir nos produits
            </Link>
          </div>
          <div className="mt-12 text-gray-400">
            <p>Besoin d&apos;aide ?</p>
            <Link
              href="/contact"
              className="text-[var(--color-orange)] hover:underline"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
