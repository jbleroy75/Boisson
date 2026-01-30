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
  'top-5-post-workout-recipes': {
    title: 'Top 5 Post-Workout Protein Recipes with Tamarque',
    description: 'Discover delicious ways to enjoy your protein intake after an intense workout session.',
    author: 'Sophie Martin',
    publishedAt: '2024-01-20',
  },
  'protein-needs-for-runners': {
    title: 'How Much Protein Do Runners Really Need?',
    description: 'Breaking down the science of protein requirements for endurance athletes.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2024-01-15',
  },
  'ice-tea-texture-revolution': {
    title: 'The Ice Tea Texture Revolution: Why Clear Protein is the Future',
    description: 'Learn why athletes are switching from thick shakes to refreshing ice tea texture drinks.',
    author: 'Emma Dubois',
    publishedAt: '2024-01-10',
  },
  'natural-ingredients-matter': {
    title: 'Why 100% Natural Ingredients Matter for Your Performance',
    description: 'The science behind clean nutrition and how artificial ingredients affect athletes.',
    author: 'Dr. Lucas Bernard',
    publishedAt: '2024-01-05',
  },
  'summer-hydration-guide': {
    title: 'Summer Hydration Guide: Staying Fueled in the Heat',
    description: 'Tips and tricks for maintaining optimal hydration and protein intake during hot weather training.',
    author: 'Sophie Martin',
    publishedAt: '2024-01-01',
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
