import {
  getOptimizedImageUrl,
  generateSrcSet,
  preloadImage,
} from "@/lib/performance/image";

describe("Image Optimization Utilities", () => {
  describe("getOptimizedImageUrl", () => {
    it("adds width parameter", () => {
      const url = getOptimizedImageUrl("/image.jpg", { width: 800 });
      expect(url).toContain("w=800");
    });

    it("adds height parameter", () => {
      const url = getOptimizedImageUrl("/image.jpg", { height: 600 });
      expect(url).toContain("h=600");
    });

    it("adds quality parameter", () => {
      const url = getOptimizedImageUrl("/image.jpg", { quality: 80 });
      expect(url).toContain("q=80");
    });

    it("adds format parameter", () => {
      const url = getOptimizedImageUrl("/image.jpg", { format: "webp" });
      expect(url).toContain("fm=webp");
    });

    it("adds multiple parameters", () => {
      const url = getOptimizedImageUrl("/image.jpg", {
        width: 800,
        height: 600,
        quality: 80,
        format: "webp",
      });

      expect(url).toContain("w=800");
      expect(url).toContain("h=600");
      expect(url).toContain("q=80");
      expect(url).toContain("fm=webp");
    });
  });

  describe("generateSrcSet", () => {
    it("generates srcset for multiple widths", () => {
      const srcSet = generateSrcSet("/image.jpg", [400, 800, 1200]);

      expect(srcSet).toContain("400w");
      expect(srcSet).toContain("800w");
      expect(srcSet).toContain("1200w");
    });

    it("includes format in URLs", () => {
      const srcSet = generateSrcSet("/image.jpg", [400, 800], "webp");

      expect(srcSet).toContain("fm=webp");
    });

    it("separates entries with commas", () => {
      const srcSet = generateSrcSet("/image.jpg", [400, 800]);

      expect(srcSet.split(",").length).toBe(2);
    });
  });

  describe("preloadImage", () => {
    it("returns a promise", () => {
      const result = preloadImage("/image.jpg");
      expect(result).toBeInstanceOf(Promise);
    });

    it("resolves when image loads", async () => {
      // Mock Image
      global.Image = class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src = "";

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      await expect(preloadImage("/image.jpg")).resolves.toBeUndefined();
    });
  });
});

