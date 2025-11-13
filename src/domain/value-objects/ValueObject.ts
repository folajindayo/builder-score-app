/**
 * Base Value Object Class
 * 
 * Value objects are immutable objects that are distinguished only by the state of their properties.
 * Two value objects with the exact same properties are considered equal.
 */

export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }

  /**
   * Get the value
   */
  get value(): T {
    return this.props;
  }

  /**
   * Check if this value object equals another
   */
  equals(other: ValueObject<T>): boolean {
    if (!(other instanceof ValueObject)) {
      return false;
    }
    return this.deepEquals(this.props, other.props);
  }

  /**
   * Deep equality check
   */
  private deepEquals(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this.deepEquals(a[key], b[key])) return false;
    }

    return true;
  }

  /**
   * Convert to string representation
   */
  abstract toString(): string;

  /**
   * Clone the value object
   */
  abstract clone(): ValueObject<T>;
}

