/**
 * TypeScript utility types
 */

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Make all properties readonly recursively
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Make specific properties optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Extract the type of array elements
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Extract the return type of a function
 */
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

/**
 * Extract the parameter types of a function
 */
export type Parameters<T> = T extends (...args: infer P) => any ? P : never;

/**
 * Non-nullable type
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Keys of type T that have values of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Values of type T
 */
export type ValueOf<T> = T[keyof T];

/**
 * Function that takes no arguments and returns T
 */
export type Supplier<T> = () => T;

/**
 * Function that takes T and returns void
 */
export type Consumer<T> = (value: T) => void;

/**
 * Function that takes T and returns R
 */
export type Function<T, R> = (value: T) => R;

/**
 * Predicate function
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Async function
 */
export type AsyncFunction<T extends any[] = any[], R = any> = (...args: T) => Promise<R>;
