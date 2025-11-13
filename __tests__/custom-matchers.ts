import { expect } from '@jest/globals';

/**
 * Custom matcher to check if a value is a valid Ethereum address
 */
function toBeValidEthereumAddress(received: string) {
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  const pass = ethereumAddressRegex.test(received);

  return {
    pass,
    message: () =>
      pass
        ? `expected ${received} not to be a valid Ethereum address`
        : `expected ${received} to be a valid Ethereum address`,
  };
}

/**
 * Custom matcher to check if a score is within valid range
 */
function toBeValidBuilderScore(received: number) {
  const pass = typeof received === 'number' && received >= 0 && received <= 1000;

  return {
    pass,
    message: () =>
      pass
        ? `expected ${received} not to be a valid builder score (0-1000)`
        : `expected ${received} to be a valid builder score (0-1000)`,
  };
}

/**
 * Custom matcher to check if a date string is valid ISO8601
 */
function toBeValidISODate(received: string) {
  const date = new Date(received);
  const pass = !isNaN(date.getTime()) && received === date.toISOString();

  return {
    pass,
    message: () =>
      pass
        ? `expected ${received} not to be a valid ISO8601 date`
        : `expected ${received} to be a valid ISO8601 date`,
  };
}

/**
 * Custom matcher to check if an object has all required builder profile properties
 */
function toBeValidBuilderProfile(received: any) {
  const requiredProps = ['address', 'score'];
  const hasAllProps = requiredProps.every((prop) => prop in received);
  const hasValidAddress = typeof received.address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(received.address);
  const hasValidScore = typeof received.score === 'object' && 'score' in received.score;

  const pass = hasAllProps && hasValidAddress && hasValidScore;

  return {
    pass,
    message: () =>
      pass
        ? `expected object not to be a valid builder profile`
        : `expected object to be a valid builder profile with address and score properties`,
  };
}

/**
 * Custom matcher to check if a skill object is valid
 */
function toBeValidSkill(received: any) {
  const requiredProps = ['id', 'name'];
  const hasAllProps = requiredProps.every((prop) => prop in received);
  const hasValidId = typeof received.id === 'string' && received.id.length > 0;
  const hasValidName = typeof received.name === 'string' && received.name.length > 0;

  const pass = hasAllProps && hasValidId && hasValidName;

  return {
    pass,
    message: () =>
      pass
        ? `expected object not to be a valid skill`
        : `expected object to be a valid skill with id and name properties`,
  };
}

/**
 * Custom matcher to check if a credential is valid
 */
function toBeValidCredential(received: any) {
  const requiredProps = ['id', 'name', 'issuer', 'verified'];
  const hasAllProps = requiredProps.every((prop) => prop in received);
  const hasValidId = typeof received.id === 'string' && received.id.length > 0;
  const hasValidName = typeof received.name === 'string' && received.name.length > 0;
  const hasValidIssuer = typeof received.issuer === 'string' && received.issuer.length > 0;
  const hasValidVerified = typeof received.verified === 'boolean';

  const pass = hasAllProps && hasValidId && hasValidName && hasValidIssuer && hasValidVerified;

  return {
    pass,
    message: () =>
      pass
        ? `expected object not to be a valid credential`
        : `expected object to be a valid credential with id, name, issuer, and verified properties`,
  };
}

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidEthereumAddress(): R;
      toBeValidBuilderScore(): R;
      toBeValidISODate(): R;
      toBeValidBuilderProfile(): R;
      toBeValidSkill(): R;
      toBeValidCredential(): R;
    }
  }
}

expect.extend({
  toBeValidEthereumAddress,
  toBeValidBuilderScore,
  toBeValidISODate,
  toBeValidBuilderProfile,
  toBeValidSkill,
  toBeValidCredential,
});

