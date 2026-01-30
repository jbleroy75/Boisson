const baseUrl = 'https://tamarque.com';

// Mock blog posts - in production, fetch from Sanity
const BLOG_POSTS = [
  {
    slug: 'top-5-post-workout-recipes',
    title: 'Top 5 Post-Workout Protein Recipes with Tamarque',
    publishedAt: '2024-01-20',
    tags: ['Recipes', 'Nutrition'],
  },
  {
    slug: 'protein-needs-for-runners',
    title: 'How Much Protein Do Runners Really Need?',
    publishedAt: '2024-01-15',
    tags: ['Nutrition', 'Training'],
  },
  {
    slug: 'ice-tea-texture-revolution',
    title: 'The Ice Tea Texture Revolution: Why Clear Protein is the Future',
    publishedAt: '2024-01-10',
    tags: ['Innovation'],
  },
  {
    slug: 'natural-ingredients-matter',
    title: 'Why 100% Natural Ingredients Matter for Your Performance',
    publishedAt: '2024-01-05',
    tags: ['Health', 'Nutrition'],
  },
  {
    slug: 'summer-hydration-guide',
    title: 'Summer Hydration Guide: Staying Fueled in the Heat',
    publishedAt: '2024-01-01',
    tags: ['Training', 'Health'],
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
