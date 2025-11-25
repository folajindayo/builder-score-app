import {
  memoize,
  once,
  debounce,
  throttle,
  compose,
  pipe,
  identity,
  constant,
  negate,
} from "@/lib/utils/function";

describe("Function Utilities", () => {
  describe("memoize", () => {
    it("memoizes function results", () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoize(fn);
      
      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("once", () => {
    it("calls function only once", () => {
      const fn = jest.fn(() => "result");
      const onceFn = once(fn);
      
      expect(onceFn()).toBe("result");
      expect(onceFn()).toBe("result");
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("debounce", () => {
    jest.useFakeTimers();
    
    it("debounces function calls", () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);
      
      debounced();
      debounced();
      debounced();
      
      expect(fn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
    
    jest.useRealTimers();
  });

  describe("throttle", () => {
    jest.useFakeTimers();
    
    it("throttles function calls", () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);
      
      throttled();
      throttled();
      throttled();
      
      expect(fn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
    
    jest.useRealTimers();
  });

  describe("compose", () => {
    it("composes functions right to left", () => {
      const add1 = (x: number) => x + 1;
      const mult2 = (x: number) => x * 2;
      const composed = compose(add1, mult2);
      
      expect(composed(5)).toBe(11); // (5 * 2) + 1
    });
  });

  describe("pipe", () => {
    it("pipes functions left to right", () => {
      const add1 = (x: number) => x + 1;
      const mult2 = (x: number) => x * 2;
      const piped = pipe(add1, mult2);
      
      expect(piped(5)).toBe(12); // (5 + 1) * 2
    });
  });

  describe("identity", () => {
    it("returns input value", () => {
      expect(identity(5)).toBe(5);
      expect(identity("test")).toBe("test");
    });
  });

  describe("constant", () => {
    it("returns constant function", () => {
      const fn = constant(42);
      expect(fn()).toBe(42);
      expect(fn()).toBe(42);
    });
  });

  describe("negate", () => {
    it("negates predicate result", () => {
      const isEven = (x: number) => x % 2 === 0;
      const isOdd = negate(isEven);
      
      expect(isOdd(3)).toBe(true);
      expect(isOdd(4)).toBe(false);
    });
  });
});

