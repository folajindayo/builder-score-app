/**
 * Builder Errors
 */

export class BuilderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'BuilderError';
  }
}

export class ProfileNotFoundError extends BuilderError {
  constructor(identifier: string) {
    super(`Builder profile not found: ${identifier}`, 'PROFILE_NOT_FOUND', 404);
    this.name = 'ProfileNotFoundError';
  }
}

export class CredentialVerificationError extends BuilderError {
  constructor(reason: string) {
    super(`Credential verification failed: ${reason}`, 'VERIFICATION_FAILED', 400);
    this.name = 'CredentialVerificationError';
  }
}

export class ScoreCalculationError extends BuilderError {
  constructor(reason: string) {
    super(`Score calculation failed: ${reason}`, 'CALCULATION_FAILED', 500);
    this.name = 'ScoreCalculationError';
  }
}

