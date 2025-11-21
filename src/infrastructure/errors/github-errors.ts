/**
 * GitHub-related Error Classes
 */

export class GitHubError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'GitHubError';
    Object.setPrototypeOf(this, GitHubError.prototype);
  }
}

export class UserNotFoundError extends GitHubError {
  constructor(message: string = 'GitHub user not found', public username: string) {
    super(message, 'USER_NOT_FOUND', 404);
    this.name = 'UserNotFoundError';
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class RateLimitError extends GitHubError {
  constructor(message: string = 'GitHub API rate limit exceeded', public resetAt?: Date) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class InvalidCredentialError extends GitHubError {
  constructor(message: string = 'Invalid credential') {
    super(message, 'INVALID_CREDENTIAL', 400);
    this.name = 'InvalidCredentialError';
    Object.setPrototypeOf(this, InvalidCredentialError.prototype);
  }
}

