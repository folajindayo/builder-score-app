/**
 * Score Value Object
 * 
 * Represents a builder's score with validation and business rules.
 */

import { ValueObject } from './ValueObject';

export interface ScoreProps {
  value: number;
  maxValue: number;
  calculatedAt: Date;
}

export class Score extends ValueObject<ScoreProps> {
  private static readonly MIN_SCORE = 0;
  private static readonly DEFAULT_MAX_SCORE = 100;

  constructor(value: number, maxValue: number = Score.DEFAULT_MAX_SCORE) {
    const validatedValue = Score.validate(value, maxValue);
    super({
      value: validatedValue,
      maxValue,
      calculatedAt: new Date(),
    });
  }

  /**
   * Validate score value
   */
  private static validate(value: number, maxValue: number): number {
    if (!Number.isFinite(value)) {
      throw new Error('Score value must be a finite number');
    }

    if (value < Score.MIN_SCORE) {
      throw new Error(`Score cannot be less than ${Score.MIN_SCORE}`);
    }

    if (value > maxValue) {
      throw new Error(`Score cannot exceed maximum value of ${maxValue}`);
    }

    return value;
  }

  /**
   * Get score value
   */
  get numericValue(): number {
    return this.props.value;
  }

  /**
   * Get maximum possible score
   */
  get maxValue(): number {
    return this.props.maxValue;
  }

  /**
   * Get calculation timestamp
   */
  get calculatedAt(): Date {
    return this.props.calculatedAt;
  }

  /**
   * Get score as percentage
   */
  get percentage(): number {
    return (this.props.value / this.props.maxValue) * 100;
  }

  /**
   * Get score tier/grade
   */
  get tier(): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
    const percentage = this.percentage;
    
    if (percentage >= 95) return 'S';
    if (percentage >= 85) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 55) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  /**
   * Check if score is excellent
   */
  isExcellent(): boolean {
    return this.percentage >= 85;
  }

  /**
   * Check if score is good
   */
  isGood(): boolean {
    return this.percentage >= 70;
  }

  /**
   * Check if score is passing
   */
  isPassing(): boolean {
    return this.percentage >= 55;
  }

  /**
   * Compare with another score
   */
  isGreaterThan(other: Score): boolean {
    return this.props.value > other.props.value;
  }

  /**
   * Compare with another score
   */
  isLessThan(other: Score): boolean {
    return this.props.value < other.props.value;
  }

  /**
   * Add to score (returns new Score)
   */
  add(amount: number): Score {
    const newValue = Math.min(this.props.value + amount, this.props.maxValue);
    return new Score(newValue, this.props.maxValue);
  }

  /**
   * Subtract from score (returns new Score)
   */
  subtract(amount: number): Score {
    const newValue = Math.max(this.props.value - amount, Score.MIN_SCORE);
    return new Score(newValue, this.props.maxValue);
  }

  /**
   * Convert to string
   */
  toString(): string {
    return `${this.props.value}/${this.props.maxValue} (${this.percentage.toFixed(1)}%)`;
  }

  /**
   * Clone the score
   */
  clone(): Score {
    return new Score(this.props.value, this.props.maxValue);
  }

  /**
   * Create zero score
   */
  static zero(maxValue: number = Score.DEFAULT_MAX_SCORE): Score {
    return new Score(0, maxValue);
  }

  /**
   * Create max score
   */
  static max(maxValue: number = Score.DEFAULT_MAX_SCORE): Score {
    return new Score(maxValue, maxValue);
  }
}

