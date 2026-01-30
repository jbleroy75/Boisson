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
    id: '1',
    slug: 'top-5-post-workout-recipes',
    title: 'Top 5 Post-Workout Protein Recipes with Tamarque',
    excerpt: 'Discover delicious ways to enjoy your protein intake after an intense workout session.',
    heroImage: '/images/blog/post-workout.jpg',
    author: { name: 'Sophie Martin', avatar: '/images/authors/sophie.jpg' },
    publishedAt: '2024-01-20',
    readTime: '5 min read',
    tags: ['Recipes'],
    body: '',
  },
  {
    id: '2',
    slug: 'protein-needs-for-runners',
    title: 'How Much Protein Do Runners Really Need?',
    excerpt: 'Breaking down the science of protein requirements for endurance athletes.',
    heroImage: '/images/blog/runners.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    tags: ['Nutrition'],
    body: '',
  },
  {
    id: '3',
    slug: 'ice-tea-texture-revolution',
    title: 'The Ice Tea Texture Revolution: Why Clear Protein is the Future',
    excerpt: 'Learn why athletes are switching from thick shakes to refreshing ice tea texture drinks.',
    heroImage: '/images/blog/ice-tea.jpg',
    author: { name: 'Emma Dubois', avatar: '/images/authors/emma.jpg' },
    publishedAt: '2024-01-10',
    readTime: '6 min read',
    tags: ['Innovation'],
    body: '',
  },
  {
    id: '4',
    slug: 'natural-ingredients-matter',
    title: 'Why 100% Natural Ingredients Matter for Your Performance',
    excerpt: 'The science behind clean nutrition and how artificial ingredients affect athletes.',
    heroImage: '/images/blog/natural.jpg',
    author: { name: 'Dr. Lucas Bernard', avatar: '/images/authors/lucas.jpg' },
    publishedAt: '2024-01-05',
    readTime: '7 min read',
    tags: ['Health'],
    body: '',
  },
  {
    id: '5',
    slug: 'summer-hydration-guide',
    title: 'Summer Hydration Guide: Staying Fueled in the Heat',
    excerpt: 'Tips and tricks for maintaining optimal hydration and protein intake during hot weather training.',
    heroImage: '/images/blog/summer.jpg',
    author: { name: 'Sophie Martin', avatar: '/images/authors/sophie.jpg' },
    publishedAt: '2024-01-01',
    readTime: '6 min read',
    tags: ['Training'],
    body: '',
  },
];

const CATEGORIES = ['All', 'Recipes', 'Nutrition', 'Training', 'Innovation', 'Health'];

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
    case 'Recipes': return '🍹';
    case 'Nutrition': return '🥗';
    case 'Training': return '🏃';
    case 'Innovation': return '💡';
    case 'Health': return '💪';
    default: return '📰';
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const filteredPosts = selectedCategory === 'All'
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">The Tamarque Blog</h1>
              <p className="text-xl text-gray-600">
                Expert tips on nutrition, training, and living your best athletic life.
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
                                  {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
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
                <h3 className="text-xl font-bold mb-2">No posts found</h3>
                <p className="text-gray-600">
                  No articles in this category yet. Check back soon!
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
              <h2 className="text-3xl font-bold mb-4">Get Weekly Nutrition Tips</h2>
              <p className="text-gray-400 mb-8">
                Join 10,000+ athletes getting expert advice on nutrition, training, and recovery.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B35]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors"
                >
                  Subscribe
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
