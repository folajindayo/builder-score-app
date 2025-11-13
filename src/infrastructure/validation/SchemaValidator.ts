/**
 * Schema Validation Infrastructure
 */

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface Schema {
  [key: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export class SchemaValidator {
  validate(data: any, schema: Schema): ValidationResult {
    const errors: Record<string, string[]> = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors: string[] = [];

      for (const rule of rules) {
        if (!rule.validate(value)) {
          fieldErrors.push(rule.message);
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export const CommonRules = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    validate: (value) => value !== null && value !== undefined && value !== '',
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.length >= min,
    message: message || `Minimum length is ${min}`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.length <= max,
    message: message || `Maximum length is ${max}`,
  }),

  email: (message: string = 'Invalid email address'): ValidationRule => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  url: (message: string = 'Invalid URL'): ValidationRule => ({
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),
};

