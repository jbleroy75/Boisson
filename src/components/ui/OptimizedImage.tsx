'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt: string; // Make alt required
  fallbackSrc?: string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:4' | 'auto';
  showSkeleton?: boolean;
  /** Enable intersection observer for true lazy loading */
  lazyLoad?: boolean;
  /** Distance from viewport to start loading (default: 200px) */
  rootMargin?: string;
}

/**
 * Optimized Image component with:
 * - Required alt text for accessibility and SEO
 * - True lazy loading with Intersection Observer
 * - Blur placeholder
 * - Error fallback
 * - Aspect ratio support (prevents CLS)
 * - Loading skeleton
 * - LCP optimization for priority images
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  aspectRatio = 'auto',
  showSkeleton = true,
  lazyLoad = true,
  rootMargin = '200px',
  className = '',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority || !lazyLoad);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !lazyLoad || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, lazyLoad, shouldLoad, rootMargin]);

  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:4': 'aspect-[3/4]',
    auto: '',
  };

  const imageSrc = error ? fallbackSrc : src;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}
    >
      {/* Skeleton placeholder - preserves space to prevent CLS */}
      {showSkeleton && isLoading && (
        <div
          className="absolute inset-0 skeleton bg-gray-200 dark:bg-gray-700"
          aria-hidden="true"
        />
      )}

      {/* Only render image when in viewport or priority */}
      {shouldLoad && (
        <Image
          src={imageSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * Product Image with SEO-optimized alt text
 */
export function ProductImage({
  productName,
  flavor,
  variant = 'main',
  ...props
}: {
  productName: string;
  flavor?: string;
  variant?: 'main' | 'thumbnail' | 'gallery';
} & Omit<OptimizedImageProps, 'alt'>) {
  const altText = `${productName}${flavor ? ` saveur ${flavor}` : ''} - Boisson protéinée Tamarque`;

  return (
    <OptimizedImage
      alt={altText}
      aspectRatio={variant === 'thumbnail' ? '1:1' : '3:4'}
      {...props}
    />
  );
}

/**
 * Hero Image with SEO-optimized alt text
 */
export function HeroImage({
  title,
  ...props
}: {
  title: string;
} & Omit<OptimizedImageProps, 'alt' | 'priority'>) {
  return (
    <OptimizedImage
      alt={`${title} - Tamarque`}
      priority // Hero images should load immediately
      showSkeleton={false}
      {...props}
    />
  );
}

/**
 * Blog Image with SEO-optimized alt text
 */
export function BlogImage({
  articleTitle,
  ...props
}: {
  articleTitle: string;
} & Omit<OptimizedImageProps, 'alt'>) {
  return (
    <OptimizedImage
      alt={`Illustration pour l'article: ${articleTitle}`}
      aspectRatio="16:9"
      {...props}
    />
  );
}

export default OptimizedImage;
