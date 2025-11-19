import { builderService } from "@/services/builderService";

describe("BuilderService", () => {
  describe("getProfile", () => {
    it("returns builder profile", async () => {
      const profile = await builderService.getProfile("0x1234");

      expect(profile).toBeDefined();
      expect(profile?.address).toBe("0x1234");
      expect(profile?.score).toBeGreaterThanOrEqual(0);
      expect(profile?.score).toBeLessThanOrEqual(100);
    });
  });

  describe("getActivity", () => {
    it("returns builder activity", async () => {
      const activities = await builderService.getActivity("0x1234", 5);

      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBe(5);
      expect(activities[0].id).toBeDefined();
      expect(activities[0].type).toBeDefined();
    });

    it("respects limit parameter", async () => {
      const activities = await builderService.getActivity("0x1234", 3);

      expect(activities.length).toBe(3);
    });
  });

  describe("updateProfile", () => {
    it("updates builder profile", async () => {
      const updates = { username: "test_user" };
      const updatedProfile = await builderService.updateProfile("0x1234", updates);

      expect(updatedProfile.username).toBe("test_user");
      expect(updatedProfile.address).toBe("0x1234");
    });

    it("throws error if profile not found", async () => {
      builderService.getProfile = jest.fn().mockResolvedValue(null);

      await expect(
        builderService.updateProfile("0xinvalid", {})
      ).rejects.toThrow("Profile not found");
    });
  });

  describe("calculateScore", () => {
    it("calculates score based on activity", async () => {
      const score = await builderService.calculateScore("0x1234");

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("returns 0 for non-existent profile", async () => {
      builderService.getProfile = jest.fn().mockResolvedValue(null);
      const score = await builderService.calculateScore("0xinvalid");

      expect(score).toBe(0);
    });
  });
});

