'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPosts, isSanityConfigured } from '@/lib/sanity';
import type { BlogPost } from '@/types';

// Mock blog posts (fallback when Sanity is not configured)
const MOCK_BLOG_POSTS = [
  {
    id: 'p1',
    slug: 'pilates-reformer-guide-complet-debutant',
    title: 'Pilates Reformer : le guide complet pour débuter',
    excerpt: 'Tout ce que tu dois savoir avant ta première séance de Pilates Reformer. Machine, exercices de base, bienfaits... On te guide pas à pas.',
    heroImage: '/images/blog/pilates-reformer-intro.jpg',
    author: { name: 'Claire Fontaine', avatar: '/images/authors/claire.jpg' },
    publishedAt: '2024-02-15',
    readTime: '10 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p2',
    slug: 'pilates-reformer-vs-mat-differences',
    title: 'Pilates Reformer vs Pilates Mat : quelles différences ?',
    excerpt: 'Reformer ou tapis ? Chaque méthode a ses avantages. On compare les deux pour t\'aider à choisir celle qui te correspond.',
    heroImage: '/images/blog/pilates-comparison.jpg',
    author: { name: 'Claire Fontaine', avatar: '/images/authors/claire.jpg' },
    publishedAt: '2024-02-12',
    readTime: '7 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p3',
    slug: 'pilates-reformer-bienfaits-corps',
    title: '10 bienfaits du Pilates Reformer sur ton corps',
    excerpt: 'Posture, souplesse, renforcement profond, récupération... Découvre pourquoi le Reformer est devenu incontournable pour les sportifs.',
    heroImage: '/images/blog/pilates-benefits.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2024-02-10',
    readTime: '8 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p4',
    slug: 'pilates-reformer-exercices-debutants',
    title: '8 exercices de Pilates Reformer pour débutants',
    excerpt: 'Les mouvements essentiels pour bien démarrer sur le Reformer. Footwork, Hundred, Leg Circles... avec toutes les instructions.',
    heroImage: '/images/blog/pilates-exercises.jpg',
    author: { name: 'Claire Fontaine', avatar: '/images/authors/claire.jpg' },
    publishedAt: '2024-02-08',
    readTime: '12 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p5',
    slug: 'pilates-reformer-mal-de-dos',
    title: 'Pilates Reformer et mal de dos : la solution douce',
    excerpt: 'Comment le Reformer peut soulager et prévenir les douleurs dorsales. Exercices spécifiques et précautions à prendre.',
    heroImage: '/images/blog/pilates-back-pain.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2024-02-05',
    readTime: '9 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p6',
    slug: 'pilates-reformer-musculation-complementaire',
    title: 'Pilates Reformer et musculation : le duo gagnant',
    excerpt: 'Pourquoi les bodybuilders et crossfitters intègrent le Reformer dans leur routine. Mobilité, prévention des blessures et gains.',
    heroImage: '/images/blog/pilates-strength.jpg',
    author: { name: 'Emma Dubois', avatar: '/images/authors/emma.jpg' },
    publishedAt: '2024-02-03',
    readTime: '8 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p7',
    slug: 'pilates-reformer-grossesse',
    title: 'Pilates Reformer pendant la grossesse : guide trimestre par trimestre',
    excerpt: 'Le Reformer est idéal pour rester active enceinte. Adaptations, exercices recommandés et contre-indications par trimestre.',
    heroImage: '/images/blog/pilates-pregnancy.jpg',
    author: { name: 'Claire Fontaine', avatar: '/images/authors/claire.jpg' },
    publishedAt: '2024-02-01',
    readTime: '11 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p8',
    slug: 'pilates-reformer-runners-coureurs',
    title: 'Pilates Reformer pour les coureurs : améliore ta foulée',
    excerpt: 'Comment le Reformer peut transformer ta course. Renforcement du core, souplesse des hanches et prévention des blessures.',
    heroImage: '/images/blog/pilates-running.jpg',
    author: { name: 'Sophie Martin', avatar: '/images/authors/sophie.jpg' },
    publishedAt: '2024-01-28',
    readTime: '8 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p9',
    slug: 'pilates-reformer-posture-bureau',
    title: 'Pilates Reformer : 6 exercices anti-posture de bureau',
    excerpt: 'Tu passes tes journées assis ? Ces exercices de Reformer vont contrer les effets néfastes de la position assise prolongée.',
    heroImage: '/images/blog/pilates-posture.jpg',
    author: { name: 'Claire Fontaine', avatar: '/images/authors/claire.jpg' },
    publishedAt: '2024-01-25',
    readTime: '7 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: 'p10',
    slug: 'pilates-reformer-nutrition-proteines',
    title: 'Pilates Reformer : quelle nutrition pour optimiser tes séances ?',
    excerpt: 'Avant, pendant, après... Comment bien manger autour de tes séances de Reformer pour maximiser les résultats.',
    heroImage: '/images/blog/pilates-nutrition.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2024-01-22',
    readTime: '9 min',
    tags: ['Pilates'],
    body: '',
  },
  {
    id: '1',
    slug: 'top-5-recettes-post-entrainement',
    title: 'Top 5 des recettes protéinées post-entraînement avec Tamarque',
    excerpt: 'Découvre des façons délicieuses et originales de consommer tes protéines après une séance intense. Smoothie bowls, popsicles, parfaits... la récup n\'a jamais été aussi gourmande !',
    heroImage: '/images/blog/post-workout.jpg',
    author: { name: 'Sophie Martin', avatar: '/images/authors/sophie.jpg' },
    publishedAt: '2024-01-20',
    readTime: '5 min',
    tags: ['Recettes'],
    body: '',
  },
  {
    id: '2',
    slug: 'besoins-proteines-coureurs',
    title: 'Combien de protéines pour les coureurs ? Le guide complet',
    excerpt: 'Décryptage scientifique des besoins en protéines des athlètes d\'endurance. Spoiler : tu en as besoin de plus que tu ne le penses.',
    heroImage: '/images/blog/runners.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2024-01-15',
    readTime: '8 min',
    tags: ['Nutrition'],
    body: '',
  },
  {
    id: '3',
    slug: 'proteine-legere-revolution',
    title: 'La révolution de la protéine légère : pourquoi la protéine claire change tout',
    excerpt: 'Pourquoi les athlètes abandonnent les shakes épais et crémeux pour les boissons protéinées légères et rafraîchissantes. L\'innovation qui transforme le marché.',
    heroImage: '/images/blog/clear-protein.jpg',
    author: { name: 'Emma Dubois', avatar: '/images/authors/emma.jpg' },
    publishedAt: '2024-01-10',
    readTime: '6 min',
    tags: ['Innovation'],
    body: '',
  },
  {
    id: '4',
    slug: 'ingredients-naturels-performance',
    title: 'Pourquoi les ingrédients 100% naturels boostent ta performance',
    excerpt: 'La science derrière la nutrition clean et l\'impact réel des ingrédients artificiels sur tes performances sportives.',
    heroImage: '/images/blog/natural.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2024-01-05',
    readTime: '7 min',
    tags: ['Santé'],
    body: '',
  },
  {
    id: '5',
    slug: 'guide-hydratation-ete',
    title: 'Guide de l\'hydratation en été : rester au top par temps chaud',
    excerpt: 'Toutes les astuces pour maintenir une hydratation et un apport protéique optimal quand le thermomètre s\'affole.',
    heroImage: '/images/blog/summer.jpg',
    author: { name: 'Sophie Martin', avatar: '/images/authors/sophie.jpg' },
    publishedAt: '2024-01-01',
    readTime: '6 min',
    tags: ['Entraînement'],
    body: '',
  },
  {
    id: '6',
    slug: 'mythes-proteines-demystifies',
    title: '7 mythes sur les protéines que tu dois arrêter de croire',
    excerpt: 'Les protéines abîment les reins ? Trop de protéines fait grossir ? On démonte les idées reçues une par une.',
    heroImage: '/images/blog/myths.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2023-12-28',
    readTime: '7 min',
    tags: ['Nutrition'],
    body: '',
  },
  {
    id: '7',
    slug: 'routine-matinale-athlete',
    title: 'La routine matinale parfaite pour les sportifs',
    excerpt: 'Comment démarrer ta journée pour maximiser tes performances. Du réveil au petit-déjeuner, on te guide étape par étape.',
    heroImage: '/images/blog/morning.jpg',
    author: { name: 'Sophie Martin', avatar: '/images/authors/sophie.jpg' },
    publishedAt: '2023-12-20',
    readTime: '5 min',
    tags: ['Entraînement'],
    body: '',
  },
  {
    id: '8',
    slug: 'crossfit-nutrition-guide',
    title: 'Nutrition pour le CrossFit : le guide ultime',
    excerpt: 'WOD, AMRAP, EMOM... Ta nutrition doit suivre l\'intensité de tes entraînements. Voici comment alimenter ta machine.',
    heroImage: '/images/blog/crossfit.jpg',
    author: { name: 'Emma Dubois', avatar: '/images/authors/emma.jpg' },
    publishedAt: '2023-12-15',
    readTime: '9 min',
    tags: ['Nutrition'],
    body: '',
  },
  {
    id: '9',
    slug: 'recuperation-musculaire-optimale',
    title: 'Récupération musculaire : les 5 piliers scientifiquement prouvés',
    excerpt: 'Sommeil, nutrition, stretching, froid, repos actif... Tout ce que la science nous apprend sur la récupération optimale.',
    heroImage: '/images/blog/recovery.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2023-12-10',
    readTime: '8 min',
    tags: ['Santé'],
    body: '',
  },
  {
    id: '10',
    slug: 'whey-isolate-vs-concentrate',
    title: 'Whey Isolate vs Concentrate : quelle protéine choisir ?',
    excerpt: 'Décryptage des différences entre isolat et concentrat de whey. Absorption, pureté, digestibilité... On te dit tout.',
    heroImage: '/images/blog/whey.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2023-12-05',
    readTime: '6 min',
    tags: ['Nutrition'],
    body: '',
  },
  {
    id: '11',
    slug: 'sport-voyage-conseils',
    title: 'Comment maintenir ton entraînement en voyage',
    excerpt: 'Déplacements pro, vacances... Pas de panique ! Voici comment rester actif et bien nourri même loin de chez toi.',
    heroImage: '/images/blog/travel.jpg',
    author: { name: 'Sophie Martin', avatar: '/images/authors/sophie.jpg' },
    publishedAt: '2023-11-28',
    readTime: '5 min',
    tags: ['Entraînement'],
    body: '',
  },
  {
    id: '12',
    slug: 'booster-systeme-immunitaire-sport',
    title: 'Comment le sport renforce ton système immunitaire',
    excerpt: 'L\'activité physique module ton immunité. Mais attention au surentraînement ! On t\'explique le juste équilibre.',
    heroImage: '/images/blog/immune.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2023-11-20',
    readTime: '7 min',
    tags: ['Santé'],
    body: '',
  },
  {
    id: '13',
    slug: 'preparation-mentale-competition',
    title: 'Préparation mentale : performer le jour J',
    excerpt: 'Visualisation, routines, gestion du stress... Les techniques des champions pour être au top en compétition.',
    heroImage: '/images/blog/mental.jpg',
    author: { name: 'Emma Dubois', avatar: '/images/authors/emma.jpg' },
    publishedAt: '2023-11-15',
    readTime: '6 min',
    tags: ['Entraînement'],
    body: '',
  },
  {
    id: '14',
    slug: 'alimentation-anti-inflammatoire',
    title: 'L\'alimentation anti-inflammatoire pour les sportifs',
    excerpt: 'Réduire l\'inflammation chronique pour mieux récupérer et performer. Les aliments à privilégier et ceux à éviter.',
    heroImage: '/images/blog/antiinflam.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2023-11-10',
    readTime: '8 min',
    tags: ['Nutrition'],
    body: '',
  },
  {
    id: '15',
    slug: 'femmes-musculation-guide',
    title: 'Musculation au féminin : le guide sans complexe',
    excerpt: 'Non, tu ne vas pas devenir une montagne de muscles. On démonte les mythes et on te donne les clés pour progresser.',
    heroImage: '/images/blog/women-training.jpg',
    author: { name: 'Sophie Martin', avatar: '/images/authors/sophie.jpg' },
    publishedAt: '2023-11-05',
    readTime: '7 min',
    tags: ['Entraînement'],
    body: '',
  },
];

const CATEGORIES = ['Tous', 'Pilates', 'Recettes', 'Nutrition', 'Entraînement', 'Innovation', 'Santé'];

function getReadTime(post: BlogPost): string {
  // If the post has a calculated readTime, use it
  if ('readTime' in post && typeof (post as { readTime?: string }).readTime === 'string') {
    return (post as { readTime: string }).readTime;
  }
  // Otherwise estimate based on body length
  const wordCount = post.body?.split(/\s+/).length || 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'Pilates': return '🧘';
    case 'Recettes': return '🍹';
    case 'Nutrition': return '🥗';
    case 'Entraînement': return '🏃';
    case 'Innovation': return '💡';
    case 'Santé': return '💪';
    default: return '📰';
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        if (isSanityConfigured) {
          const sanityPosts = await getPosts();
          if (sanityPosts.length > 0) {
            setPosts(sanityPosts);
          } else {
            setPosts(MOCK_BLOG_POSTS);
          }
        } else {
          setPosts(MOCK_BLOG_POSTS);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        setPosts(MOCK_BLOG_POSTS);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  const filteredPosts = selectedCategory === 'Tous'
    ? posts
    : posts.filter((post) => post.tags.includes(selectedCategory));

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Le Blog Tamarque</h1>
              <p className="text-xl text-gray-600">
                Conseils d'experts en nutrition, entraînement et style de vie sportif.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white border-b sticky top-16 md:top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    category === selectedCategory
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link href={`/blog/${featuredPost.slug}`} className="block group">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                        <div className="grid md:grid-cols-2 gap-0">
                          <div className="aspect-video md:aspect-auto bg-gradient-to-br from-[#FF6B35]/20 to-[#FF1493]/20 flex items-center justify-center">
                            <div className="text-6xl">
                              {getCategoryEmoji(featuredPost.tags[0] || 'All')}
                            </div>
                          </div>
                          <div className="p-8 md:p-12 flex flex-col justify-center">
                            <span className="inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium mb-4 w-fit">
                              {featuredPost.tags[0] || 'Article'}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-[#FF6B35] transition-colors">
                              {featuredPost.title}
                            </h2>
                            <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-full flex items-center justify-center text-white font-bold">
                                {featuredPost.author.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{featuredPost.author.name}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(featuredPost.publishedAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}{' '}
                                  • {getReadTime(featuredPost)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </section>
            )}

            {/* Blog Grid */}
            {otherPosts.length > 0 && (
              <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index + 1) }}
                      >
                        <Link href={`/blog/${post.slug}`} className="block group">
                          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full">
                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <div className="text-4xl">
                                {getCategoryEmoji(post.tags[0] || 'All')}
                              </div>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mb-3">
                                {post.tags[0] || 'Article'}
                              </span>
                              <h3 className="font-bold text-lg mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {post.author.name.charAt(0)}
                                  </div>
                                  <span className="text-sm text-gray-500">{post.author.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">{getReadTime(post)}</span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-xl font-bold mb-2">Aucun article trouvé</h3>
                <p className="text-gray-600">
                  Pas encore d'articles dans cette catégorie. Reviens bientôt !
                </p>
              </div>
            )}
          </>
        )}

        {/* Newsletter CTA */}
        <section className="py-16 bg-[#1A1A1A] text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Reçois nos conseils nutrition chaque semaine</h2>
              <p className="text-gray-400 mb-8">
                Rejoins 10 000+ athlètes qui reçoivent des conseils d'experts en nutrition, entraînement et récupération.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Ton adresse email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B35]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors"
                >
                  S'inscrire
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
