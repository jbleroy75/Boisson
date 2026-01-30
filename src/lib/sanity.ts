import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { BlogPost } from '@/types';

// Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01';

// Check if Sanity is configured
export const isSanityConfigured = !!(projectId && dataset);

// Create the Sanity client
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
      perspective: 'published',
    })
  : null;

// Image URL builder
const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: { asset: { _ref: string } } | string) {
  if (!builder) {
    // Return a placeholder if Sanity is not configured
    return { url: () => '/images/placeholder.jpg' };
  }
  return builder.image(source);
}

// GROQ queries
const postFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "heroImage": heroImage.asset->url,
  "author": author->{name, "avatar": avatar.asset->url},
  publishedAt,
  "tags": tags[],
  "readTime": round(length(pt::text(body)) / 5 / 200) + " min read"
`;

const postWithBodyFields = `
  ${postFields},
  "body": body
`;

// Type for raw Sanity post
interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  heroImage: string;
  author: { name: string; avatar: string };
  publishedAt: string;
  tags: string[];
  readTime: string;
  body?: unknown;
}

// Transform Sanity post to our BlogPost type
function transformPost(post: SanityPost): BlogPost {
  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    body: typeof post.body === 'string' ? post.body : JSON.stringify(post.body || ''),
    heroImage: post.heroImage || '/images/placeholder.jpg',
    author: {
      name: post.author?.name || 'Tamarque Team',
      avatar: post.author?.avatar || '/images/authors/default.jpg',
    },
    publishedAt: post.publishedAt || new Date().toISOString(),
    tags: post.tags || [],
  };
}

// Fetch all blog posts
export async function getPosts(): Promise<BlogPost[]> {
  if (!sanityClient) {
    console.log('Sanity not configured, returning empty array');
    return [];
  }

  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      ${postFields}
    }`;

    const posts = await sanityClient.fetch<SanityPost[]>(query);
    return posts.map(transformPost);
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!sanityClient) {
    console.log('Sanity not configured, returning null');
    return null;
  }

  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      ${postWithBodyFields}
    }`;

    const post = await sanityClient.fetch<SanityPost | null>(query, { slug } as Record<string, string>);

    if (!post) return null;

    return transformPost(post);
  } catch (error) {
    console.error('Error fetching post from Sanity:', error);
    return null;
  }
}

// Fetch posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  if (!sanityClient) {
    return [];
  }

  try {
    const query = `*[_type == "post" && $tag in tags] | order(publishedAt desc) {
      ${postFields}
    }`;

    const posts = await sanityClient.fetch<SanityPost[]>(query, { tag } as Record<string, string>);
    return posts.map(transformPost);
  } catch (error) {
    console.error('Error fetching posts by tag from Sanity:', error);
    return [];
  }
}

// Fetch related posts (same tags, excluding current post)
export async function getRelatedPosts(slug: string, tags: string[], limit = 3): Promise<BlogPost[]> {
  if (!sanityClient || tags.length === 0) {
    return [];
  }

  try {
    const query = `*[_type == "post" && slug.current != $slug && count((tags)[@ in $tags]) > 0] | order(publishedAt desc)[0...$limit] {
      ${postFields}
    }`;

    const posts = await sanityClient.fetch<SanityPost[]>(query, { slug, tags, limit } as Record<string, unknown>);
    return posts.map(transformPost);
  } catch (error) {
    console.error('Error fetching related posts from Sanity:', error);
    return [];
  }
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  if (!sanityClient) {
    return [];
  }

  try {
    const query = `array::unique(*[_type == "post"].tags[])`;
    const tags = await sanityClient.fetch<string[]>(query);
    return tags.filter(Boolean);
  } catch (error) {
    console.error('Error fetching tags from Sanity:', error);
    return [];
  }
}

/*
 * SANITY SCHEMA (create this in your Sanity Studio)
 *
 * // schemas/post.ts
 * export default {
 *   name: 'post',
 *   title: 'Blog Post',
 *   type: 'document',
 *   fields: [
 *     {
 *       name: 'title',
 *       title: 'Title',
 *       type: 'string',
 *       validation: Rule => Rule.required()
 *     },
 *     {
 *       name: 'slug',
 *       title: 'Slug',
 *       type: 'slug',
 *       options: {
 *         source: 'title',
 *         maxLength: 96
 *       },
 *       validation: Rule => Rule.required()
 *     },
 *     {
 *       name: 'excerpt',
 *       title: 'Excerpt',
 *       type: 'text',
 *       rows: 3
 *     },
 *     {
 *       name: 'heroImage',
 *       title: 'Hero Image',
 *       type: 'image',
 *       options: {
 *         hotspot: true
 *       }
 *     },
 *     {
 *       name: 'body',
 *       title: 'Body',
 *       type: 'blockContent'
 *     },
 *     {
 *       name: 'author',
 *       title: 'Author',
 *       type: 'reference',
 *       to: [{ type: 'author' }]
 *     },
 *     {
 *       name: 'publishedAt',
 *       title: 'Published At',
 *       type: 'datetime'
 *     },
 *     {
 *       name: 'tags',
 *       title: 'Tags',
 *       type: 'array',
 *       of: [{ type: 'string' }],
 *       options: {
 *         layout: 'tags'
 *       }
 *     }
 *   ]
 * }
 *
 * // schemas/author.ts
 * export default {
 *   name: 'author',
 *   title: 'Author',
 *   type: 'document',
 *   fields: [
 *     {
 *       name: 'name',
 *       title: 'Name',
 *       type: 'string',
 *       validation: Rule => Rule.required()
 *     },
 *     {
 *       name: 'avatar',
 *       title: 'Avatar',
 *       type: 'image',
 *       options: {
 *         hotspot: true
 *       }
 *     },
 *     {
 *       name: 'bio',
 *       title: 'Bio',
 *       type: 'text'
 *     }
 *   ]
 * }
 */
