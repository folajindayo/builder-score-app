import { renderHook, waitFor } from "@testing-library/react";
import { useProfileData } from "@/hooks/useProfileData";
import { builderService } from "@/services/builderService";

jest.mock("@/services/builderService");

describe("useProfileData", () => {
  const mockProfile = {
    address: "0x1234",
    score: 85,
    rank: 10,
    commits: 500,
    repos: 20,
    languages: ["TypeScript", "Solidity"],
    joinedDate: "2024-01-01",
    lastActive: "2024-01-15",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads profile data on mount", async () => {
    (builderService.getProfile as jest.Mock).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfileData("0x1234"));

    expect(result.current.loading).toBe(false);

    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it("handles null address", () => {
    const { result } = renderHook(() => useProfileData(null));

    expect(result.current.profile).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("handles fetch error", async () => {
    (builderService.getProfile as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useProfileData("0x1234"));

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
      expect(result.current.profile).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it("updates local profile", () => {
    (builderService.getProfile as jest.Mock).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfileData("0x1234"));

    waitFor(() => {
      result.current.updateLocal({ score: 90 });

      expect(result.current.profile?.score).toBe(90);
    });
  });

  it("refetches profile data", async () => {
    (builderService.getProfile as jest.Mock).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfileData("0x1234"));

    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile);
    });

    const updatedProfile = { ...mockProfile, score: 90 };
    (builderService.getProfile as jest.Mock).mockResolvedValue(updatedProfile);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.profile?.score).toBe(90);
    });
  });
});

