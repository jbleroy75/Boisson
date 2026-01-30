/**
 * SEO Components - Centralized exports
 */

export {
  OrganizationSchema,
  ProductSchema,
  BreadcrumbSchema,
  FAQSchema,
  ArticleSchema,
  LocalBusinessSchema,
} from './StructuredData';

export { JsonLd, JsonLdMultiple } from './JsonLd';

export {
  Breadcrumbs,
  getProductBreadcrumbs,
  getBlogBreadcrumbs,
  getAccountBreadcrumbs,
} from './Breadcrumbs';

export type { BreadcrumbItem } from './Breadcrumbs';
