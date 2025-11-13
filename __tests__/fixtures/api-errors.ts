/**
 * Test fixtures for API error responses
 */

export const fixtureError400 = {
  error: 'Bad Request',
  message: 'Invalid request parameters',
  statusCode: 400,
  details: {
    field: 'address',
    issue: 'Invalid Ethereum address format',
  },
};

export const fixtureError401 = {
  error: 'Unauthorized',
  message: 'Authentication required',
  statusCode: 401,
};

export const fixtureError403 = {
  error: 'Forbidden',
  message: 'Insufficient permissions to access this resource',
  statusCode: 403,
};

export const fixtureError404 = {
  error: 'Not Found',
  message: 'Builder profile not found',
  statusCode: 404,
};

export const fixtureError429 = {
  error: 'Too Many Requests',
  message: 'Rate limit exceeded. Please try again later.',
  statusCode: 429,
  retryAfter: 60,
};

export const fixtureError500 = {
  error: 'Internal Server Error',
  message: 'An unexpected error occurred',
  statusCode: 500,
};

export const fixtureError503 = {
  error: 'Service Unavailable',
  message: 'Service temporarily unavailable. Please try again later.',
  statusCode: 503,
};

export const fixtureNetworkError = {
  error: 'Network Error',
  message: 'Failed to fetch data. Please check your internet connection.',
  type: 'NetworkError',
};

export const fixtureTimeoutError = {
  error: 'Timeout Error',
  message: 'Request timed out. Please try again.',
  type: 'TimeoutError',
};

export const fixtureValidationError = {
  error: 'Validation Error',
  message: 'Input validation failed',
  statusCode: 422,
  errors: [
    {
      field: 'minScore',
      message: 'minScore must be a number between 0 and 1000',
    },
    {
      field: 'maxScore',
      message: 'maxScore must be greater than minScore',
    },
  ],
};

