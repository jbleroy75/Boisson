import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackConfigurator from '@/components/shop/PackConfigurator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compose ton Pack',
  description: 'Crée ton pack personnalisé de boissons protéinées Tamarque. Choisis tes saveurs préférées et économise jusqu\'à 20%.',
};

export default function PackPage() {
  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Compose ton <span className="text-gradient">Pack</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mélange tes saveurs préférées et profite de réductions exclusives.
              Plus ton pack est grand, plus tu économises !
            </p>
          </div>

          <PackConfigurator />

          {/* Benefits Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-bold mb-2">Livraison offerte</h3>
              <p className="text-sm text-gray-600">Dès 6 bouteilles commandées</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-bold mb-2">Modifiable</h3>
              <p className="text-sm text-gray-600">Change tes saveurs à chaque commande</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold mb-2">Économies garanties</h3>
              <p className="text-sm text-gray-600">Jusqu&apos;à 20% de réduction</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
