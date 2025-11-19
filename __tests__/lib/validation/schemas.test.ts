import {
  builderAddressSchema,
  leaderboardFiltersSchema,
  compareSchema,
  searchSchema,
  paginationSchema,
  sortSchema,
} from "@/lib/validation/schemas";

describe("Validation Schemas", () => {
  describe("builderAddressSchema", () => {
    it("validates valid Ethereum addresses", () => {
      const validAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
      expect(() => builderAddressSchema.parse(validAddress)).not.toThrow();
    });

    it("rejects invalid addresses", () => {
      expect(() => builderAddressSchema.parse("invalid")).toThrow();
      expect(() => builderAddressSchema.parse("0x123")).toThrow();
    });
  });

  describe("leaderboardFiltersSchema", () => {
    it("validates empty filters", () => {
      expect(() => leaderboardFiltersSchema.parse({})).not.toThrow();
    });

    it("validates partial filters", () => {
      const filters = {
        language: "typescript",
        minScore: 50,
        verified: true,
      };
      expect(() => leaderboardFiltersSchema.parse(filters)).not.toThrow();
    });

    it("rejects invalid score ranges", () => {
      expect(() =>
        leaderboardFiltersSchema.parse({ minScore: -1 })
      ).toThrow();
      expect(() =>
        leaderboardFiltersSchema.parse({ maxScore: 101 })
      ).toThrow();
    });
  });

  describe("compareSchema", () => {
    const validCompare = {
      addresses: [
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      ],
    };

    it("validates valid comparison", () => {
      expect(() => compareSchema.parse(validCompare)).not.toThrow();
    });

    it("requires at least 2 addresses", () => {
      const invalid = {
        addresses: ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"],
      };
      expect(() => compareSchema.parse(invalid)).toThrow();
    });

    it("limits to 4 addresses", () => {
      const invalid = {
        addresses: [
          "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
          "0x1234567890123456789012345678901234567890",
          "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
          "0x1111111111111111111111111111111111111111",
        ],
      };
      expect(() => compareSchema.parse(invalid)).toThrow();
    });
  });

  describe("searchSchema", () => {
    it("validates valid search", () => {
      const search = { query: "test" };
      expect(() => searchSchema.parse(search)).not.toThrow();
    });

    it("requires non-empty query", () => {
      expect(() => searchSchema.parse({ query: "" })).toThrow();
    });

    it("applies default limit", () => {
      const result = searchSchema.parse({ query: "test" });
      expect(result.limit).toBe(10);
    });
  });

  describe("paginationSchema", () => {
    it("uses defaults", () => {
      const result = paginationSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it("validates custom values", () => {
      const result = paginationSchema.parse({ page: 5, limit: 25 });
      expect(result.page).toBe(5);
      expect(result.limit).toBe(25);
    });

    it("rejects invalid pagination", () => {
      expect(() => paginationSchema.parse({ page: 0 })).toThrow();
      expect(() => paginationSchema.parse({ limit: 101 })).toThrow();
    });
  });

  describe("sortSchema", () => {
    it("uses defaults", () => {
      const result = sortSchema.parse({});
      expect(result.sortBy).toBe("score");
      expect(result.sortOrder).toBe("desc");
    });

    it("validates custom values", () => {
      const result = sortSchema.parse({ sortBy: "commits", sortOrder: "asc" });
      expect(result.sortBy).toBe("commits");
      expect(result.sortOrder).toBe("asc");
    });

    it("rejects invalid sort fields", () => {
      expect(() => sortSchema.parse({ sortBy: "invalid" })).toThrow();
    });
  });
});

