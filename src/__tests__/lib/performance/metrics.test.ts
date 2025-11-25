import {
  performanceMonitor,
  measureSync,
  measureAsync,
} from "@/lib/performance/metrics";

describe("Performance Metrics", () => {
  beforeEach(() => {
    performanceMonitor.clearMarks();
    performanceMonitor.clearMetrics();
  });

  describe("performanceMonitor", () => {
    it("marks and measures correctly", () => {
      performanceMonitor.mark("start");
      performanceMonitor.mark("end");
      
      const duration = performanceMonitor.measure("test", "start", "end");
      
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it("stores metrics", () => {
      performanceMonitor.reportMetric("test", 100, "ms");
      
      const metrics = performanceMonitor.getMetrics();
      
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe("test");
      expect(metrics[0].value).toBe(100);
      expect(metrics[0].unit).toBe("ms");
    });

    it("clears marks", () => {
      performanceMonitor.mark("test");
      performanceMonitor.clearMarks();
      
      const duration = performanceMonitor.measure("test", "test");
      
      expect(duration).toBe(0);
    });

    it("clears metrics", () => {
      performanceMonitor.reportMetric("test", 100);
      performanceMonitor.clearMetrics();
      
      const metrics = performanceMonitor.getMetrics();
      
      expect(metrics).toHaveLength(0);
    });
  });

  describe("measureSync", () => {
    it("measures synchronous function execution", () => {
      const fn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };

      const result = measureSync("test-sync", fn);
      
      expect(result).toBe(499500);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].name).toBe("test-sync");
    });

    it("measures even when function throws", () => {
      const fn = () => {
        throw new Error("Test error");
      };

      expect(() => measureSync("test-error", fn)).toThrow("Test error");
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  describe("measureAsync", () => {
    it("measures asynchronous function execution", async () => {
      const fn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 42;
      };

      const result = await measureAsync("test-async", fn);
      
      expect(result).toBe(42);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].name).toBe("test-async");
    });

    it("measures even when promise rejects", async () => {
      const fn = async () => {
        throw new Error("Test error");
      };

      await expect(measureAsync("test-error", fn)).rejects.toThrow("Test error");
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.length).toBeGreaterThan(0);
    });
  });
});

