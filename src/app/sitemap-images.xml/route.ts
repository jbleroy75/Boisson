import { MOCK_PRODUCTS } from '@/lib/constants';

const baseUrl = 'https://tamarque.com';

export async function GET() {
  const productImages = MOCK_PRODUCTS.flatMap((product) => {
    const images = product.images?.length
      ? product.images
      : [`${baseUrl}/images/products/${product.slug}.jpg`];

    return images.map((image) => ({
      loc: `${baseUrl}/shop/${product.slug}`,
      image: {
        loc: image.startsWith('http') ? image : `${baseUrl}${image}`,
        title: product.name,
        caption: product.description,
      },
    }));
  });

  const staticImages = [
    {
      loc: baseUrl,
      image: {
        loc: `${baseUrl}/images/hero/homepage-hero.jpg`,
        title: 'Tamarque - Boissons Protéinées Légères',
        caption: 'La boisson protéinée nouvelle génération',
      },
    },
    {
      loc: `${baseUrl}/about`,
      image: {
        loc: `${baseUrl}/images/about/team.jpg`,
        title: 'L\'équipe Tamarque',
        caption: 'Les fondateurs de Tamarque',
      },
    },
  ];

  const allImages = [...staticImages, ...productImages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allImages
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <image:image>
      <image:loc>${entry.image.loc}</image:loc>
      <image:title>${escapeXml(entry.image.title)}</image:title>
      <image:caption>${escapeXml(entry.image.caption)}</image:caption>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
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
