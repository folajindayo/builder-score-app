/**
 * Ethereum Address Value Object
 */

import { ValueObject } from './ValueObject';

export interface AddressProps {
  value: string;
}

export class Address extends ValueObject<AddressProps> {
  constructor(address: string) {
    if (!Address.isValid(address)) {
      throw new Error('Invalid Ethereum address');
    }
    super({ value: address.toLowerCase() });
  }

  get value(): string {
    return this.props.value;
  }

  get checksummed(): string {
    // Simple checksum (in real app, use proper EIP-55 checksum)
    return this.props.value;
  }

  static isValid(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  toString(): string {
    return this.props.value;
  }

  clone(): Address {
    return new Address(this.props.value);
  }

  equals(other: Address): boolean {
    return this.props.value === other.props.value;
  }
}

