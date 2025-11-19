import {
  generateMetaTags,
  generateJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/meta";

describe("SEO Meta Utilities", () => {
  describe("generateMetaTags", () => {
    it("generates basic meta tags", () => {
      const meta = generateMetaTags({
        title: "Test Title",
        description: "Test Description",
      });

      expect(meta.title).toBe("Test Title");
      expect(meta.description).toBe("Test Description");
    });

    it("generates Open Graph tags", () => {
      const meta = generateMetaTags({
        title: "Test",
        description: "Desc",
        ogTitle: "OG Title",
        ogDescription: "OG Desc",
        ogImage: "https://example.com/image.jpg",
        ogUrl: "https://example.com",
      });

      expect(meta.openGraph.title).toBe("OG Title");
      expect(meta.openGraph.description).toBe("OG Desc");
      expect(meta.openGraph.images[0].url).toBe("https://example.com/image.jpg");
      expect(meta.openGraph.url).toBe("https://example.com");
    });

    it("falls back to basic title when OG title not provided", () => {
      const meta = generateMetaTags({
        title: "Test Title",
        description: "Test Description",
      });

      expect(meta.openGraph.title).toBe("Test Title");
      expect(meta.openGraph.description).toBe("Test Description");
    });

    it("generates Twitter card tags", () => {
      const meta = generateMetaTags({
        title: "Test",
        description: "Desc",
        twitterCard: "summary_large_image",
        twitterTitle: "Twitter Title",
        twitterImage: "https://example.com/twitter.jpg",
      });

      expect(meta.twitter.card).toBe("summary_large_image");
      expect(meta.twitter.title).toBe("Twitter Title");
      expect(meta.twitter.images[0]).toBe("https://example.com/twitter.jpg");
    });

    it("generates canonical link", () => {
      const meta = generateMetaTags({
        title: "Test",
        description: "Desc",
        canonical: "https://example.com/page",
      });

      expect(meta.alternates.canonical).toBe("https://example.com/page");
    });

    it("includes robots directive", () => {
      const meta = generateMetaTags({
        title: "Test",
        description: "Desc",
        robots: "noindex, nofollow",
      });

      expect(meta.robots).toBe("noindex, nofollow");
    });
  });

  describe("generateJsonLd", () => {
    it("generates JSON-LD string", () => {
      const jsonLd = generateJsonLd({
        "@type": "Person",
        name: "John Doe",
      });

      const parsed = JSON.parse(jsonLd);
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@type"]).toBe("Person");
      expect(parsed.name).toBe("John Doe");
    });
  });

  describe("generateBreadcrumbJsonLd", () => {
    it("generates breadcrumb JSON-LD", () => {
      const breadcrumbs = [
        { name: "Home", url: "https://example.com" },
        { name: "Products", url: "https://example.com/products" },
        { name: "Product", url: "https://example.com/products/item" },
      ];

      const jsonLd = generateBreadcrumbJsonLd(breadcrumbs);
      const parsed = JSON.parse(jsonLd);

      expect(parsed["@type"]).toBe("BreadcrumbList");
      expect(parsed.itemListElement).toHaveLength(3);
      expect(parsed.itemListElement[0].position).toBe(1);
      expect(parsed.itemListElement[0].name).toBe("Home");
    });
  });
});

