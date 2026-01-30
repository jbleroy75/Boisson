const baseUrl = 'https://tamarque.com';

export async function GET() {
  const sitemaps = [
    { loc: `${baseUrl}/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/sitemap-images.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/sitemap-news.xml`, lastmod: new Date().toISOString() },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
