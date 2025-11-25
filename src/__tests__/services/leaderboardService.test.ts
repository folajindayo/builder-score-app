import { leaderboardService } from "@/services/leaderboardService";

describe("LeaderboardService", () => {
  describe("getLeaderboard", () => {
    it("returns paginated leaderboard data", async () => {
      const result = await leaderboardService.getLeaderboard(1, 10);

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it("filters by language", async () => {
      const result = await leaderboardService.getLeaderboard(
        1,
        10,
        "score",
        "desc",
        { language: "TypeScript" }
      );

      expect(result.data).toBeDefined();
      result.data.forEach((entry) => {
        expect(entry.languages).toContain("TypeScript");
      });
    });

    it("filters by minimum score", async () => {
      const minScore = 50;
      const result = await leaderboardService.getLeaderboard(
        1,
        10,
        "score",
        "desc",
        { minScore }
      );

      result.data.forEach((entry) => {
        expect(entry.score).toBeGreaterThanOrEqual(minScore);
      });
    });

    it("sorts by score descending", async () => {
      const result = await leaderboardService.getLeaderboard(
        1,
        10,
        "score",
        "desc"
      );

      for (let i = 0; i < result.data.length - 1; i++) {
        expect(result.data[i].score).toBeGreaterThanOrEqual(
          result.data[i + 1].score
        );
      }
    });

    it("sorts by commits", async () => {
      const result = await leaderboardService.getLeaderboard(
        1,
        10,
        "commits",
        "desc"
      );

      for (let i = 0; i < result.data.length - 1; i++) {
        expect(result.data[i].commits).toBeGreaterThanOrEqual(
          result.data[i + 1].commits
        );
      }
    });
  });

  describe("getTopBuilders", () => {
    it("returns top builders", async () => {
      const topBuilders = await leaderboardService.getTopBuilders(5);

      expect(Array.isArray(topBuilders)).toBe(true);
      expect(topBuilders.length).toBeLessThanOrEqual(5);
    });

    it("returns builders sorted by score", async () => {
      const topBuilders = await leaderboardService.getTopBuilders(5);

      for (let i = 0; i < topBuilders.length - 1; i++) {
        expect(topBuilders[i].score).toBeGreaterThanOrEqual(
          topBuilders[i + 1].score
        );
      }
    });
  });
});

