import {
  hexToRgb,
  rgbToHex,
  hexToRgba,
  lighten,
  darken,
  getContrast,
  isLight,
  isDark,
  interpolate,
} from "@/lib/utils/color";

describe("Color Utilities", () => {
  describe("hexToRgb", () => {
    it("converts hex to RGB", () => {
      expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
    });

    it("handles hex without hash", () => {
      expect(hexToRgb("ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    });

    it("returns null for invalid hex", () => {
      expect(hexToRgb("invalid")).toBeNull();
    });
  });

  describe("rgbToHex", () => {
    it("converts RGB to hex", () => {
      expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
      expect(rgbToHex(0, 255, 0)).toBe("#00ff00");
      expect(rgbToHex(0, 0, 255)).toBe("#0000ff");
    });
  });

  describe("hexToRgba", () => {
    it("converts hex to RGBA", () => {
      expect(hexToRgba("#ff0000", 0.5)).toBe("rgba(255, 0, 0, 0.5)");
      expect(hexToRgba("#00ff00")).toBe("rgba(0, 255, 0, 1)");
    });
  });

  describe("lighten", () => {
    it("lightens color", () => {
      const lightened = lighten("#808080", 20);
      expect(lightened).not.toBe("#808080");
      // Lightened color should have higher RGB values
      const original = hexToRgb("#808080")!;
      const result = hexToRgb(lightened)!;
      expect(result.r).toBeGreaterThan(original.r);
    });
  });

  describe("darken", () => {
    it("darkens color", () => {
      const darkened = darken("#808080", 20);
      expect(darkened).not.toBe("#808080");
      // Darkened color should have lower RGB values
      const original = hexToRgb("#808080")!;
      const result = hexToRgb(darkened)!;
      expect(result.r).toBeLessThan(original.r);
    });
  });

  describe("getContrast", () => {
    it("calculates contrast ratio", () => {
      const contrast = getContrast("#000000", "#ffffff");
      expect(contrast).toBeGreaterThan(1);
    });
  });

  describe("isLight", () => {
    it("identifies light colors", () => {
      expect(isLight("#ffffff")).toBe(true);
      expect(isLight("#000000")).toBe(false);
    });
  });

  describe("isDark", () => {
    it("identifies dark colors", () => {
      expect(isDark("#000000")).toBe(true);
      expect(isDark("#ffffff")).toBe(false);
    });
  });

  describe("interpolate", () => {
    it("interpolates between colors", () => {
      const result = interpolate("#000000", "#ffffff", 0.5);
      expect(result).toBe("#808080");
    });
  });
});

