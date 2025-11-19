/**
 * SEO Utilities
 * For managing meta tags and SEO optimization
 */

import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string[];
  author?: string;
  type?: string;
}

/**
 * Generate Next.js metadata for SEO
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    image = "/og-image.png",
    url,
    keywords = [],
    author = "Builder Score Team",
    type = "website",
  } = config;

  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    openGraph: {
      title,
      description,
      images: [image],
      url,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Generate structured data for rich snippets
 */
export function generateStructuredData(data: any): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    ...data,
  });
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbData(
  items: { name: string; url: string }[]
): string {
  return generateStructuredData({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

