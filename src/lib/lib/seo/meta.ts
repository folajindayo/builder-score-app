/**
 * SEO metadata utilities
 */

export interface MetaTags {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  robots?: string;
}

export function generateMetaTags(tags: MetaTags): Record<string, any> {
  const meta: Record<string, any> = {
    title: tags.title,
    description: tags.description,
  };

  if (tags.keywords && tags.keywords.length > 0) {
    meta.keywords = tags.keywords.join(", ");
  }

  // Open Graph
  const openGraph: Record<string, any> = {
    title: tags.ogTitle || tags.title,
    description: tags.ogDescription || tags.description,
    type: tags.ogType || "website",
  };

  if (tags.ogImage) {
    openGraph.images = [{ url: tags.ogImage }];
  }

  if (tags.ogUrl) {
    openGraph.url = tags.ogUrl;
  }

  meta.openGraph = openGraph;

  // Twitter
  const twitter: Record<string, any> = {
    card: tags.twitterCard || "summary_large_image",
    title: tags.twitterTitle || tags.ogTitle || tags.title,
    description: tags.twitterDescription || tags.ogDescription || tags.description,
  };

  if (tags.twitterImage || tags.ogImage) {
    twitter.images = [tags.twitterImage || tags.ogImage];
  }

  meta.twitter = twitter;

  // Additional meta
  if (tags.canonical) {
    meta.alternates = {
      canonical: tags.canonical,
    };
  }

  if (tags.robots) {
    meta.robots = tags.robots;
  }

  return meta;
}

export function generateJsonLd(data: Record<string, any>): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    ...data,
  });
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): string {
  return generateJsonLd({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

