/**
 * Email Value Object
 */

import { ValueObject } from './ValueObject';

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error('Invalid email address');
    }
    super({ value: email.toLowerCase().trim() });
  }

  get value(): string {
    return this.props.value;
  }

  static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.props.value;
  }

  clone(): Email {
    return new Email(this.props.value);
  }
}

