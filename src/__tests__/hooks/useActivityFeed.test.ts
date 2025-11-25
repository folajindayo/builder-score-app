import { renderHook, waitFor } from "@testing-library/react";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { builderService } from "@/services/builderService";

jest.mock("@/services/builderService");

describe("useActivityFeed", () => {
  const mockActivities = [
    {
      id: "1",
      type: "commit",
      repo: "test-repo",
      description: "Added feature",
      timestamp: "2024-01-01",
    },
    {
      id: "2",
      type: "pr",
      repo: "test-repo",
      description: "Merged PR",
      timestamp: "2024-01-02",
    },
  ];

  const mockResponse = {
    data: mockActivities,
    pagination: {
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads activities on mount", async () => {
    (builderService.getActivity as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useActivityFeed("0x1234"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.activities).toEqual(mockActivities);
      expect(result.current.loading).toBe(false);
      expect(result.current.hasMore).toBe(false);
    });
  });

  it("handles empty address", () => {
    const { result } = renderHook(() => useActivityFeed(""));

    expect(result.current.activities).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("loads more activities", async () => {
    const page1Response = {
      data: [mockActivities[0]],
      pagination: { page: 1, limit: 1, total: 2, totalPages: 2 },
    };

    const page2Response = {
      data: [mockActivities[1]],
      pagination: { page: 2, limit: 1, total: 2, totalPages: 2 },
    };

    (builderService.getActivity as jest.Mock)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useActivityFeed("0x1234", 1));

    await waitFor(() => {
      expect(result.current.activities.length).toBe(1);
      expect(result.current.hasMore).toBe(true);
    });

    await result.current.loadMore();

    await waitFor(() => {
      expect(result.current.activities.length).toBe(2);
      expect(result.current.hasMore).toBe(false);
    });
  });

  it("refetches activities", async () => {
    (builderService.getActivity as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useActivityFeed("0x1234"));

    await waitFor(() => {
      expect(result.current.activities).toEqual(mockActivities);
    });

    const newActivities = [
      ...mockActivities,
      {
        id: "3",
        type: "issue",
        repo: "test-repo",
        description: "Fixed bug",
        timestamp: "2024-01-03",
      },
    ];

    const newResponse = {
      ...mockResponse,
      data: newActivities,
    };

    (builderService.getActivity as jest.Mock).mockResolvedValue(newResponse);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.activities).toEqual(newActivities);
    });
  });
});

