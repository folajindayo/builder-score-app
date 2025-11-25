import { analyticsService } from "@/services/analyticsService";

describe("AnalyticsService", () => {
  beforeEach(() => {
    // Clear events before each test
    analyticsService["events"] = [];
  });

  describe("track", () => {
    it("tracks events", () => {
      analyticsService.track("page_view", { page: "/home" }, "user1");

      const events = analyticsService.getEvents();

      expect(events.length).toBe(1);
      expect(events[0].type).toBe("page_view");
      expect(events[0].userId).toBe("user1");
      expect(events[0].properties.page).toBe("/home");
    });

    it("generates unique event IDs", () => {
      analyticsService.track("event1", {});
      analyticsService.track("event2", {});

      const events = analyticsService.getEvents();

      expect(events[0].id).not.toBe(events[1].id);
    });
  });

  describe("getEvents", () => {
    beforeEach(() => {
      analyticsService.track("click", { button: "submit" }, "user1");
      analyticsService.track("page_view", { page: "/dashboard" }, "user1");
      analyticsService.track("click", { button: "cancel" }, "user2");
    });

    it("returns all events without filters", () => {
      const events = analyticsService.getEvents();

      expect(events.length).toBe(3);
    });

    it("filters by event type", () => {
      const events = analyticsService.getEvents({ type: "click" });

      expect(events.length).toBe(2);
      expect(events.every((e) => e.type === "click")).toBe(true);
    });

    it("filters by user ID", () => {
      const events = analyticsService.getEvents({ userId: "user1" });

      expect(events.length).toBe(2);
      expect(events.every((e) => e.userId === "user1")).toBe(true);
    });
  });

  describe("getEventCounts", () => {
    beforeEach(() => {
      analyticsService.track("click", {});
      analyticsService.track("click", {});
      analyticsService.track("page_view", {});
    });

    it("counts all event types", () => {
      const counts = analyticsService.getEventCounts();

      expect(counts.click).toBe(2);
      expect(counts.page_view).toBe(1);
    });

    it("counts specific event type", () => {
      const counts = analyticsService.getEventCounts("click");

      expect(counts.click).toBe(2);
      expect(counts.page_view).toBeUndefined();
    });
  });

  describe("getUserActivity", () => {
    beforeEach(() => {
      analyticsService.track("event1", {}, "user1");
      analyticsService.track("event2", {}, "user1");
      analyticsService.track("event3", {}, "user2");
    });

    it("returns user activity", () => {
      const activity = analyticsService.getUserActivity("user1");

      expect(activity.length).toBe(2);
      expect(activity.every((e) => e.userId === "user1")).toBe(true);
    });

    it("limits returned events", () => {
      analyticsService.track("event4", {}, "user1");
      analyticsService.track("event5", {}, "user1");

      const activity = analyticsService.getUserActivity("user1", 2);

      expect(activity.length).toBe(2);
    });
  });
});

