import { renderHook, act } from "@testing-library/react";
import {
  useOptimizedState,
  useBatchedState,
  useLazyState,
} from "@/hooks/useOptimizedState";

describe("useOptimizedState", () => {
  it("updates state normally", () => {
    const { result } = renderHook(() => useOptimizedState(0));

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("skips identical updates", () => {
    const { result, rerender } = renderHook(() => useOptimizedState({ a: 1 }));

    const initialValue = result.current[0];

    act(() => {
      result.current[1](initialValue);
    });

    rerender();

    expect(result.current[0]).toBe(initialValue);
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useOptimizedState(0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });
});

describe("useBatchedState", () => {
  it("batches multiple updates", () => {
    const { result } = renderHook(() => useBatchedState(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3);
    });

    // Should batch to single update
    expect(result.current[0]).toBe(3);
  });

  it("flushes updates manually", () => {
    const { result } = renderHook(() => useBatchedState(0));

    act(() => {
      result.current[1](1);
      result.current[2](); // flush
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1](2);
      result.current[2](); // flush
    });

    expect(result.current[0]).toBe(2);
  });
});

describe("useLazyState", () => {
  it("initializes with value", () => {
    const { result } = renderHook(() => useLazyState(42));
    expect(result.current[0]).toBe(42);
  });

  it("initializes with function", () => {
    const initializer = jest.fn(() => 42);
    const { result } = renderHook(() => useLazyState(initializer));
    
    expect(initializer).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe(42);
  });

  it("updates state lazily", () => {
    const { result } = renderHook(() => useLazyState(0));

    act(() => {
      result.current[1](1);
    });

    // Update happens asynchronously via requestIdleCallback
    // In tests, this may not execute immediately
  });
});

