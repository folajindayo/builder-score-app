import {
  isActivityType,
  isBuilderProfile,
  isLeaderboardEntry,
  isEthereumAddress,
  isApiResponse,
  isApiError,
  isSuccessResponse,
  isErrorResponse,
  assertEthereumAddress,
  assertActivityType,
  assertBuilderProfile,
} from "@/lib/types/guards";
import { ApiResponse, BuilderProfile } from "@/lib/types/api";

describe("Type Guards", () => {
  describe("isActivityType", () => {
    it("returns true for valid activity types", () => {
      expect(isActivityType("commit")).toBe(true);
      expect(isActivityType("pr")).toBe(true);
      expect(isActivityType("issue")).toBe(true);
      expect(isActivityType("review")).toBe(true);
    });

    it("returns false for invalid types", () => {
      expect(isActivityType("invalid")).toBe(false);
      expect(isActivityType(123)).toBe(false);
    });
  });

  describe("isBuilderProfile", () => {
    const validProfile: BuilderProfile = {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      score: 95,
      rank: 10,
      stats: {
        totalCommits: 100,
        totalRepos: 10,
        totalPRs: 50,
        totalIssues: 20,
        languages: [],
        streak: 5,
      },
      verified: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    it("returns true for valid builder profiles", () => {
      expect(isBuilderProfile(validProfile)).toBe(true);
    });

    it("returns false for invalid profiles", () => {
      expect(isBuilderProfile({})).toBe(false);
      expect(isBuilderProfile({ address: "0x123" })).toBe(false);
      expect(isBuilderProfile(null)).toBe(false);
    });
  });

  describe("isLeaderboardEntry", () => {
    it("returns true for valid entries", () => {
      const entry = {
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        score: 95,
        rank: 10,
        change: 2,
        verified: true,
      };
      expect(isLeaderboardEntry(entry)).toBe(true);
    });

    it("returns false for invalid entries", () => {
      expect(isLeaderboardEntry({})).toBe(false);
      expect(isLeaderboardEntry({ address: "0x123" })).toBe(false);
    });
  });

  describe("isEthereumAddress", () => {
    it("returns true for valid addresses", () => {
      expect(isEthereumAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")).toBe(
        true
      );
    });

    it("returns false for invalid addresses", () => {
      expect(isEthereumAddress("0x123")).toBe(false);
      expect(isEthereumAddress("invalid")).toBe(false);
    });
  });

  describe("isApiResponse", () => {
    it("returns true for valid API responses", () => {
      expect(isApiResponse({ success: true, data: "test" })).toBe(true);
    });

    it("returns false for invalid responses", () => {
      expect(isApiResponse({})).toBe(false);
    });
  });

  describe("isApiError", () => {
    it("returns true for valid API errors", () => {
      expect(isApiError({ code: "ERR_001", message: "Error" })).toBe(true);
    });

    it("returns false for invalid errors", () => {
      expect(isApiError({ code: "ERR_001" })).toBe(false);
    });
  });

  describe("isSuccessResponse", () => {
    it("returns true for success responses", () => {
      const response: ApiResponse<string> = {
        success: true,
        data: "test",
      };
      expect(isSuccessResponse(response)).toBe(true);
    });

    it("returns false for error responses", () => {
      const response: ApiResponse<string> = {
        success: false,
        error: { code: "ERR", message: "Error" },
      };
      expect(isSuccessResponse(response)).toBe(false);
    });
  });

  describe("isErrorResponse", () => {
    it("returns true for error responses", () => {
      const response: ApiResponse<string> = {
        success: false,
        error: { code: "ERR", message: "Error" },
      };
      expect(isErrorResponse(response)).toBe(true);
    });

    it("returns false for success responses", () => {
      const response: ApiResponse<string> = {
        success: true,
        data: "test",
      };
      expect(isErrorResponse(response)).toBe(false);
    });
  });

  describe("assertEthereumAddress", () => {
    it("does not throw for valid addresses", () => {
      expect(() =>
        assertEthereumAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
      ).not.toThrow();
    });

    it("throws for invalid addresses", () => {
      expect(() => assertEthereumAddress("invalid")).toThrow();
    });
  });

  describe("assertActivityType", () => {
    it("does not throw for valid types", () => {
      expect(() => assertActivityType("commit")).not.toThrow();
    });

    it("throws for invalid types", () => {
      expect(() => assertActivityType("invalid")).toThrow();
    });
  });

  describe("assertBuilderProfile", () => {
    const validProfile: BuilderProfile = {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      score: 95,
      rank: 10,
      stats: {
        totalCommits: 100,
        totalRepos: 10,
        totalPRs: 50,
        totalIssues: 20,
        languages: [],
        streak: 5,
      },
      verified: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    it("does not throw for valid profiles", () => {
      expect(() => assertBuilderProfile(validProfile)).not.toThrow();
    });

    it("throws for invalid profiles", () => {
      expect(() => assertBuilderProfile({})).toThrow();
    });
  });
});

