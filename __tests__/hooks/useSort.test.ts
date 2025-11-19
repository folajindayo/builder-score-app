import { renderHook, act } from "@testing-library/react";
import { useSort } from "@/hooks/useSort";

interface TestItem {
  id: number;
  name: string;
  score: number;
}

describe("useSort", () => {
  const testData: TestItem[] = [
    { id: 1, name: "Charlie", score: 85 },
    { id: 2, name: "Alice", score: 95 },
    { id: 3, name: "Bob", score: 90 },
  ];

  it("returns unsorted data when no sort is applied", () => {
    const { result } = renderHook(() => useSort(testData));

    expect(result.current.sortedData).toEqual(testData);
    expect(result.current.sortBy).toBeNull();
  });

  it("sorts by string field ascending", () => {
    const { result } = renderHook(() => useSort(testData));

    act(() => {
      result.current.setSortBy("name");
    });

    expect(result.current.sortedData[0].name).toBe("Alice");
    expect(result.current.sortedData[1].name).toBe("Bob");
    expect(result.current.sortedData[2].name).toBe("Charlie");
  });

  it("sorts by number field descending", () => {
    const { result } = renderHook(() => useSort(testData));

    act(() => {
      result.current.setSortBy("score");
      result.current.setSortOrder("desc");
    });

    expect(result.current.sortedData[0].score).toBe(95);
    expect(result.current.sortedData[1].score).toBe(90);
    expect(result.current.sortedData[2].score).toBe(85);
  });

  it("toggles sort order", () => {
    const { result } = renderHook(() => useSort(testData));

    act(() => {
      result.current.toggleSort("score");
    });

    expect(result.current.sortBy).toBe("score");
    expect(result.current.sortOrder).toBe("asc");

    act(() => {
      result.current.toggleSort("score");
    });

    expect(result.current.sortOrder).toBe("desc");
  });

  it("resets to asc when sorting by different field", () => {
    const { result } = renderHook(() => useSort(testData));

    act(() => {
      result.current.toggleSort("score");
      result.current.toggleSort("score"); // Now desc
    });

    expect(result.current.sortOrder).toBe("desc");

    act(() => {
      result.current.toggleSort("name");
    });

    expect(result.current.sortBy).toBe("name");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("resets sort", () => {
    const { result } = renderHook(() =>
      useSort(testData, {
        initialSortBy: "id",
        initialSortOrder: "asc",
      })
    );

    act(() => {
      result.current.setSortBy("name");
      result.current.setSortOrder("desc");
    });

    act(() => {
      result.current.resetSort();
    });

    expect(result.current.sortBy).toBe("id");
    expect(result.current.sortOrder).toBe("asc");
  });
});

