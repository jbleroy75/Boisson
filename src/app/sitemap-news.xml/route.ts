const baseUrl = 'https://tamarque.com';

// Mock blog posts - in production, fetch from Sanity
const BLOG_POSTS = [
  {
    slug: 'top-5-recettes-post-entrainement',
    title: 'Top 5 des recettes protéinées post-entraînement avec Tamarque',
    publishedAt: '2024-01-20',
    tags: ['Recettes', 'Nutrition'],
  },
  {
    slug: 'besoins-proteines-coureurs',
    title: 'Combien de protéines pour les coureurs ? Le guide complet',
    publishedAt: '2024-01-15',
    tags: ['Nutrition', 'Entraînement'],
  },
  {
    slug: 'proteine-legere-revolution',
    title: 'La révolution de la protéine légère : pourquoi la protéine claire change tout',
    publishedAt: '2024-01-10',
    tags: ['Innovation'],
  },
  {
    slug: 'ingredients-naturels-performance',
    title: 'Pourquoi les ingrédients 100% naturels boostent ta performance',
    publishedAt: '2024-01-05',
    tags: ['Santé', 'Nutrition'],
  },
  {
    slug: 'guide-hydratation-ete',
    title: 'Guide de l\'hydratation en été : rester au top par temps chaud',
    publishedAt: '2024-01-01',
    tags: ['Entraînement', 'Santé'],
  },
];

export async function GET() {
  // Filter posts from last 2 days for Google News (they require recent content)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // For demo purposes, include all posts
  const recentPosts = BLOG_POSTS;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentPosts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Tamarque Blog</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${post.publishedAt}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
      <news:keywords>${post.tags.join(', ')}</news:keywords>
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
