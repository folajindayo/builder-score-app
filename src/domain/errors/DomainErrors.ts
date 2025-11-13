/**
 * Domain-Specific Errors
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class BuilderNotFoundError extends DomainError {
  constructor(address: string) {
    super(`Builder not found: ${address}`);
    this.name = 'BuilderNotFoundError';
  }
}

export class InvalidScoreError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidScoreError';
  }
}

export class AchievementAlreadyEarnedError extends DomainError {
  constructor(type: string) {
    super(`Achievement already earned: ${type}`);
    this.name = 'AchievementAlreadyEarnedError';
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly errors: string[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

