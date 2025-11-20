/**
 * Builder Validator
 */

export class BuilderValidator {
  static validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  static validateScore(score: number): boolean {
    return score >= 0 && score <= 100;
  }

  static validateSkills(skills: string[]): string[] {
    const errors: string[] = [];
    
    if (skills.length === 0) {
      errors.push('At least one skill is required');
    }
    
    if (skills.length > 20) {
      errors.push('Maximum 20 skills allowed');
    }
    
    return errors;
  }
}

