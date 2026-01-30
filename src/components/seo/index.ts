/**
 * SEO Components - Centralized exports
 */

// Structured Data Components
export {
  OrganizationSchema,
  ProductSchema,
  BreadcrumbSchema,
  FAQSchema,
  ArticleSchema,
  LocalBusinessSchema,
} from './StructuredData';

// JSON-LD Utilities
export { JsonLd, JsonLdMultiple } from './JsonLd';

// Breadcrumbs
export {
  Breadcrumbs,
  getProductBreadcrumbs,
  getBlogBreadcrumbs,
  getAccountBreadcrumbs,
} from './Breadcrumbs';
export type { BreadcrumbItem } from './Breadcrumbs';

// Preload Resources
export { PreloadResources, PreloadProductPage, PreloadHomePage } from './Preload';

// Internal Linking
export {
  RelatedProducts,
  RelatedArticles,
  FooterSEOLinks,
  ContextualLink,
  QuickNavigation,
} from './InternalLinks';
