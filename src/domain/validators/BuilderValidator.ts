/**
 * Builder Validator
 * 
 * Validates builder-related business rules.
 */

import { Builder } from '../entities/Builder';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class BuilderValidator {
  /**
   * Validate builder entity
   */
  validate(builder: Builder): ValidationResult {
    const errors: string[] = [];

    // Validate address format
    if (!this.isValidAddress(builder.address)) {
      errors.push('Invalid wallet address format');
    }

    // Validate name if present
    if (builder.name && builder.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (builder.name && builder.name.length > 50) {
      errors.push('Name must not exceed 50 characters');
    }

    // Validate bio if present
    if (builder.bio && builder.bio.length > 500) {
      errors.push('Bio must not exceed 500 characters');
    }

    // Validate URLs if present
    if (builder.website && !this.isValidUrl(builder.website)) {
      errors.push('Invalid website URL');
    }

    // Validate GitHub username
    if (builder.github && !this.isValidGitHubUsername(builder.github)) {
      errors.push('Invalid GitHub username');
    }

    // Validate Twitter handle
    if (builder.twitter && !this.isValidTwitterHandle(builder.twitter)) {
      errors.push('Invalid Twitter handle');
    }

    // Validate email
    if (builder.email && !this.isValidEmail(builder.email)) {
      errors.push('Invalid email address');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate Ethereum address
   */
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate GitHub username
   */
  private isValidGitHubUsername(username: string): boolean {
    return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username);
  }

  /**
   * Validate Twitter handle
   */
  private isValidTwitterHandle(handle: string): boolean {
    const cleaned = handle.startsWith('@') ? handle.slice(1) : handle;
    return /^[a-zA-Z0-9_]{1,15}$/.test(cleaned);
  }

  /**
   * Validate email
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

