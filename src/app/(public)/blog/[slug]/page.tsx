'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPostBySlug, getRelatedPosts } from '@/lib/sanity';
import type { BlogPost } from '@/types';

// Mock blog content (fallback when Sanity is not configured)
const MOCK_BLOG_POSTS: Record<string, {
  title: string;
  excerpt: string;
  author: { name: string };
  publishedAt: string;
  readTime: string;
  category: string;
  content: string;
}> = {
  'top-5-post-workout-recipes': {
    title: 'Top 5 Post-Workout Protein Recipes with Tamarque',
    excerpt: 'Discover delicious ways to enjoy your protein intake after an intense workout session.',
    author: { name: 'Sophie Martin' },
    publishedAt: 'January 20, 2024',
    readTime: '5 min read',
    category: 'Recipes',
    content: `
After an intense workout, your body craves protein to repair and build muscle. But who says post-workout nutrition has to be boring? With Tamarque's ice tea texture protein drinks, you can create refreshing, delicious recipes that make recovery something to look forward to.

## 1. Tropical Sunrise Smoothie Bowl

Blend one Coco Pineapple Tamarque with frozen mango and a splash of coconut milk. Pour into a bowl and top with granola, sliced banana, and shredded coconut. The light, refreshing texture makes this perfect for hot summer mornings.

## 2. Yuzu Peach Frozen Treats

Pour Yuzu Peach Tamarque into popsicle molds and freeze for 4 hours. You get a protein-packed frozen treat that's perfect for post-workout recovery on hot days. Each popsicle delivers a refreshing citrus kick with all the protein benefits.

## 3. Matcha Protein Parfait

Layer Matcha Vanilla Tamarque with Greek yogurt and fresh berries. Add a drizzle of honey and some crushed almonds. The matcha provides natural caffeine for sustained energy, while the layered textures make every bite interesting.

## 4. Dragon Fruit Recovery Bowl

Use Dragon Fruit-Mango-Passion as the base for an açaí-style bowl. Blend with frozen banana for thickness, then top with fresh fruit, chia seeds, and a handful of protein-packed nuts. The vibrant pink color makes this as Instagram-worthy as it is nutritious.

## 5. Hibiscus Berry Chia Pudding

Mix Hibiscus Raspberry Tamarque with chia seeds and let it sit overnight. The next morning, you have a protein-rich pudding with beautiful color and a subtle floral taste. Top with fresh raspberries for extra antioxidants.

## Why These Recipes Work

The key to all these recipes is Tamarque's unique ice tea texture. Unlike thick protein shakes, our drinks blend seamlessly into recipes without making them heavy or chalky. You get all 20g of protein in a form that's actually enjoyable to consume.

Ready to try these recipes? Shop our full range of flavors and start creating your own post-workout masterpieces.
    `,
  },
  'protein-needs-for-runners': {
    title: 'How Much Protein Do Runners Really Need?',
    excerpt: 'Breaking down the science of protein requirements for endurance athletes.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: 'January 15, 2024',
    readTime: '8 min read',
    category: 'Nutrition',
    content: `
If you're a runner, you've probably heard conflicting advice about protein. Some say endurance athletes need less protein than strength athletes. Others claim you need just as much, if not more. Let's break down the science.

## The Research

Recent studies show that endurance athletes actually have higher protein needs than previously thought. While the general recommendation for sedentary adults is 0.8g per kg of body weight, runners benefit from 1.2-1.6g per kg.

For a 70kg runner, that's 84-112g of protein daily. During heavy training periods or marathon prep, needs may increase to 1.8g per kg.

## Why Runners Need Protein

**Muscle Repair**: Running causes microtears in muscle fibers. Protein provides the amino acids needed for repair and adaptation.

**Immune Function**: High training loads can suppress immunity. Adequate protein supports immune cell production.

**Energy Production**: While not a primary fuel source, protein can contribute 5-10% of energy during long runs.

**Recovery Speed**: Proper protein intake reduces muscle soreness and speeds recovery between sessions.

## Timing Matters

The 30-minute post-workout window isn't a myth for runners. Consuming 20-30g of protein within this window maximizes muscle protein synthesis. This is where Tamarque shines – our ice tea texture means you can actually drink it right after a sweaty run without feeling sick.

## Quality Over Quantity

Not all protein is created equal. Look for complete proteins containing all essential amino acids. Whey protein isolate, like what we use in Tamarque, has the highest bioavailability and fastest absorption.

## Practical Tips for Runners

1. Spread protein intake across meals (don't try to get it all at dinner)
2. Have protein within 30 minutes post-run
3. Choose easily digestible sources before runs
4. Consider protein before bed for overnight recovery

The bottom line? Runners need more protein than they think, and the form it comes in matters for compliance. Nobody wants a heavy shake after a 20K run – that's why we created Tamarque's refreshing ice tea texture.
    `,
  },
};

// Convert BlogPost to display format
function formatBlogPost(post: BlogPost): {
  title: string;
  excerpt: string;
  author: { name: string };
  publishedAt: string;
  readTime: string;
  category: string;
  content: string;
} {
  return {
    title: post.title,
    excerpt: post.excerpt,
    author: { name: post.author.name },
    publishedAt: new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    readTime: '5 min read',
    category: post.tags[0] || 'Article',
    content: post.body,
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<{
    title: string;
    excerpt: string;
    author: { name: string };
    publishedAt: string;
    readTime: string;
    category: string;
    content: string;
  } | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      try {
        // Try to fetch from Sanity first
        const sanityPost = await getPostBySlug(slug);
        if (sanityPost) {
          setPost(formatBlogPost(sanityPost));
          // Fetch related posts
          const related = await getRelatedPosts(slug, sanityPost.tags, 3);
          setRelatedPosts(related);
        } else {
          // Fall back to mock data
          const mockPost = MOCK_BLOG_POSTS[slug];
          if (mockPost) {
            setPost(mockPost);
          } else {
            setPost(null);
          }
          setRelatedPosts([]);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        // Fall back to mock data on error
        const mockPost = MOCK_BLOG_POSTS[slug];
        if (mockPost) {
          setPost(mockPost);
        } else {
          setPost(null);
        }
        setRelatedPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link href="/blog" className="text-[#FF6B35] hover:underline">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Get related posts from mock if no Sanity related posts
  const displayRelatedPosts = relatedPosts.length > 0
    ? relatedPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.tags[0] || 'Article',
      }))
    : Object.entries(MOCK_BLOG_POSTS)
        .filter(([key]) => key !== slug)
        .slice(0, 3)
        .map(([key, p]) => ({
          slug: key,
          title: p.title,
          category: p.category,
        }));

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF6B35]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-[#FF6B35]">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.category}</span>
          </nav>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span className="inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-sm text-gray-500">
                  {post.publishedAt} • {post.readTime}
                </div>
              </div>
            </div>
          </motion.header>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="aspect-video bg-gradient-to-br from-[#FF6B35]/20 to-[#FF1493]/20 rounded-3xl mb-12 flex items-center justify-center"
          >
            <div className="text-6xl">
              {post.category === 'Recipes' && '🍹'}
              {post.category === 'Nutrition' && '🥗'}
              {post.category === 'Training' && '🏃'}
              {post.category === 'Innovation' && '💡'}
              {post.category === 'Health' && '💪'}
              {!['Recipes', 'Nutrition', 'Training', 'Innovation', 'Health'].includes(post.category) && '📝'}
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {post.content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={i} className="font-semibold mt-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              }
              if (paragraph.match(/^\d\./)) {
                return (
                  <p key={i} className="ml-4 my-2">
                    {paragraph}
                  </p>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={i} className="my-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] text-white rounded-3xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Try Tamarque?</h3>
            <p className="text-white/80 mb-6">
              Experience the ice tea texture revolution. 20g protein, 100% natural, zero bloating.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-[#FF6B35] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Share this article</span>
              <div className="flex gap-4">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="bg-gray-50 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">More Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {displayRelatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-3xl">
                      {relatedPost.category === 'Recipes' && '🍹'}
                      {relatedPost.category === 'Nutrition' && '🥗'}
                      {relatedPost.category === 'Training' && '🏃'}
                      {relatedPost.category === 'Innovation' && '💡'}
                      {relatedPost.category === 'Health' && '💪'}
                      {!['Recipes', 'Nutrition', 'Training', 'Innovation', 'Health'].includes(relatedPost.category) && '📝'}
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-[#FF6B35] font-medium">{relatedPost.category}</span>
                    <h3 className="font-bold mt-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
