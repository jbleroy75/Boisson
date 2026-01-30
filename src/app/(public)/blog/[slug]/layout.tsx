import { Metadata } from 'next';
import Script from 'next/script';
import { generateArticleMetadata } from '@/lib/seo';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

// Mock blog posts for metadata generation
const MOCK_BLOG_POSTS: Record<string, {
  title: string;
  description: string;
  image?: string;
  author: string;
  publishedAt: string;
}> = {
  'pilates-reformer-guide-complet-debutant': {
    title: 'Pilates Reformer : le guide complet pour débuter',
    description: 'Tout ce que tu dois savoir avant ta première séance de Pilates Reformer. Machine, exercices, bienfaits.',
    author: 'Claire Fontaine',
    publishedAt: '2024-02-15',
  },
  'pilates-reformer-vs-mat-differences': {
    title: 'Pilates Reformer vs Pilates Mat : quelles différences ?',
    description: 'Reformer ou tapis ? Chaque méthode a ses avantages. On compare pour t\'aider à choisir.',
    author: 'Claire Fontaine',
    publishedAt: '2024-02-12',
  },
  'pilates-reformer-bienfaits-corps': {
    title: '10 bienfaits du Pilates Reformer sur ton corps',
    description: 'Posture, souplesse, renforcement profond, récupération... Pourquoi le Reformer est incontournable.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2024-02-10',
  },
  'pilates-reformer-exercices-debutants': {
    title: '8 exercices de Pilates Reformer pour débutants',
    description: 'Les mouvements essentiels pour bien démarrer sur le Reformer. Instructions complètes.',
    author: 'Claire Fontaine',
    publishedAt: '2024-02-08',
  },
  'pilates-reformer-mal-de-dos': {
    title: 'Pilates Reformer et mal de dos : la solution douce',
    description: 'Comment le Reformer peut soulager et prévenir les douleurs dorsales.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2024-02-05',
  },
  'pilates-reformer-musculation-complementaire': {
    title: 'Pilates Reformer et musculation : le duo gagnant',
    description: 'Pourquoi les bodybuilders et crossfitters intègrent le Reformer dans leur routine.',
    author: 'Emma Dubois',
    publishedAt: '2024-02-03',
  },
  'pilates-reformer-grossesse': {
    title: 'Pilates Reformer pendant la grossesse : guide trimestre par trimestre',
    description: 'Le Reformer est idéal pour rester active enceinte. Adaptations et exercices recommandés.',
    author: 'Claire Fontaine',
    publishedAt: '2024-02-01',
  },
  'pilates-reformer-runners-coureurs': {
    title: 'Pilates Reformer pour les coureurs : améliore ta foulée',
    description: 'Comment le Reformer peut transformer ta course et prévenir les blessures.',
    author: 'Sophie Martin',
    publishedAt: '2024-01-28',
  },
  'pilates-reformer-posture-bureau': {
    title: 'Pilates Reformer : 6 exercices anti-posture de bureau',
    description: 'Tu passes tes journées assis ? Ces exercices vont contrer les effets néfastes.',
    author: 'Claire Fontaine',
    publishedAt: '2024-01-25',
  },
  'pilates-reformer-nutrition-proteines': {
    title: 'Pilates Reformer : quelle nutrition pour optimiser tes séances ?',
    description: 'Avant, pendant, après... Comment bien manger autour de tes séances de Reformer.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2024-01-22',
  },
  'top-5-recettes-post-entrainement': {
    title: 'Top 5 des recettes protéinées post-entraînement avec Tamarque',
    description: 'Découvre des façons délicieuses et originales de consommer tes protéines après une séance intense.',
    author: 'Sophie Martin',
    publishedAt: '2024-01-20',
  },
  'besoins-proteines-coureurs': {
    title: 'Combien de protéines pour les coureurs ? Le guide complet',
    description: 'Décryptage scientifique des besoins en protéines des athlètes d\'endurance.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2024-01-15',
  },
  'proteine-legere-revolution': {
    title: 'La révolution de la protéine légère : pourquoi la protéine claire change tout',
    description: 'Pourquoi les athlètes abandonnent les shakes épais pour les boissons protéinées légères.',
    author: 'Emma Dubois',
    publishedAt: '2024-01-10',
  },
  'ingredients-naturels-performance': {
    title: 'Pourquoi les ingrédients 100% naturels boostent ta performance',
    description: 'La science derrière la nutrition clean et l\'impact des ingrédients artificiels sur tes performances.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2024-01-05',
  },
  'guide-hydratation-ete': {
    title: 'Guide de l\'hydratation en été : rester au top par temps chaud',
    description: 'Toutes les astuces pour maintenir une hydratation et un apport protéique optimal quand le thermomètre s\'affole.',
    author: 'Sophie Martin',
    publishedAt: '2024-01-01',
  },
  'mythes-proteines-demystifies': {
    title: '7 mythes sur les protéines que tu dois arrêter de croire',
    description: 'Les protéines abîment les reins ? Trop de protéines fait grossir ? On démonte les idées reçues.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2023-12-28',
  },
  'routine-matinale-athlete': {
    title: 'La routine matinale parfaite pour les sportifs',
    description: 'Comment démarrer ta journée pour maximiser tes performances.',
    author: 'Sophie Martin',
    publishedAt: '2023-12-20',
  },
  'crossfit-nutrition-guide': {
    title: 'Nutrition pour le CrossFit : le guide ultime',
    description: 'WOD, AMRAP, EMOM... Ta nutrition doit suivre l\'intensité de tes entraînements.',
    author: 'Emma Dubois',
    publishedAt: '2023-12-15',
  },
  'recuperation-musculaire-optimale': {
    title: 'Récupération musculaire : les 5 piliers scientifiquement prouvés',
    description: 'Sommeil, nutrition, stretching, froid, repos actif... Tout ce que la science nous apprend.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2023-12-10',
  },
  'whey-isolate-vs-concentrate': {
    title: 'Whey Isolate vs Concentrate : quelle protéine choisir ?',
    description: 'Décryptage des différences entre isolat et concentrat de whey.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2023-12-05',
  },
  'sport-voyage-conseils': {
    title: 'Comment maintenir ton entraînement en voyage',
    description: 'Déplacements pro, vacances... Comment rester actif et bien nourri même loin de chez toi.',
    author: 'Sophie Martin',
    publishedAt: '2023-11-28',
  },
  'booster-systeme-immunitaire-sport': {
    title: 'Comment le sport renforce ton système immunitaire',
    description: 'L\'activité physique module ton immunité. Mais attention au surentraînement !',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2023-11-20',
  },
  'preparation-mentale-competition': {
    title: 'Préparation mentale : performer le jour J',
    description: 'Visualisation, routines, gestion du stress... Les techniques des champions.',
    author: 'Emma Dubois',
    publishedAt: '2023-11-15',
  },
  'alimentation-anti-inflammatoire': {
    title: 'L\'alimentation anti-inflammatoire pour les sportifs',
    description: 'Réduire l\'inflammation chronique pour mieux récupérer et performer.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2023-11-10',
  },
  'femmes-musculation-guide': {
    title: 'Musculation au féminin : le guide sans complexe',
    description: 'Non, tu ne vas pas devenir une montagne de muscles. On démonte les mythes.',
    author: 'Sophie Martin',
    publishedAt: '2023-11-05',
  },
};

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = MOCK_BLOG_POSTS[resolvedParams.slug];

  if (!post) {
    return {
      title: 'Article non trouvé',
    };
  }

  return generateArticleMetadata({
    title: post.title,
    description: post.description,
    slug: resolvedParams.slug,
    image: post.image,
    author: post.author,
    publishedAt: post.publishedAt,
  });
}

export function generateStaticParams() {
  return Object.keys(MOCK_BLOG_POSTS).map((slug) => ({
    slug,
  }));
}

export default async function BlogPostLayout({ children, params }: BlogPostLayoutProps) {
  const resolvedParams = await params;
  const post = MOCK_BLOG_POSTS[resolvedParams.slug];

  if (!post) {
    return <>{children}</>;
  }

  // Generate schemas
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    image: post.image || '/images/blog/default.jpg',
    author: post.author,
    datePublished: post.publishedAt,
    url: `/blog/${resolvedParams.slug}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${resolvedParams.slug}` },
  ]);

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <Script
        id="blog-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {children}
    </>
  );
}
