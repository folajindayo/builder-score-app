/**
 * Profile Validator
 */

export function validateGitHubUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (!/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(username)) {
    return { isValid: false, error: 'Invalid GitHub username format' };
  }
  
  return { isValid: true };
}

export function validateScore(score: number): {
  isValid: boolean;
  error?: string;
} {
  if (typeof score !== 'number') {
    return { isValid: false, error: 'Score must be a number' };
  }
  
  if (score < 0 || score > 100) {
    return { isValid: false, error: 'Score must be between 0 and 100' };
  }
  
  return { isValid: true };
}

