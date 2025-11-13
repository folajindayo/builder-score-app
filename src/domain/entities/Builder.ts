/**
 * Builder Entity
 * 
 * Represents a builder in the system with their identity, profile, and score information.
 */

import { Entity } from './Entity';

export interface BuilderProps {
  address: string;
  name?: string;
  avatar?: string;
  bio?: string;
  github?: string;
  twitter?: string;
  website?: string;
  email?: string;
}

export class Builder extends Entity<string> {
  private _props: BuilderProps;

  constructor(
    address: string,
    props: Partial<BuilderProps> = {},
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(address, createdAt, updatedAt);
    this._props = {
      address,
      name: props.name,
      avatar: props.avatar,
      bio: props.bio,
      github: props.github,
      twitter: props.twitter,
      website: props.website,
      email: props.email,
    };
  }

  /**
   * Get builder address (wallet address)
   */
  get address(): string {
    return this._props.address;
  }

  /**
   * Get builder name
   */
  get name(): string | undefined {
    return this._props.name;
  }

  /**
   * Get builder avatar URL
   */
  get avatar(): string | undefined {
    return this._props.avatar;
  }

  /**
   * Get builder bio
   */
  get bio(): string | undefined {
    return this._props.bio;
  }

  /**
   * Get builder GitHub username
   */
  get github(): string | undefined {
    return this._props.github;
  }

  /**
   * Get builder Twitter handle
   */
  get twitter(): string | undefined {
    return this._props.twitter;
  }

  /**
   * Get builder website
   */
  get website(): string | undefined {
    return this._props.website;
  }

  /**
   * Get builder email
   */
  get email(): string | undefined {
    return this._props.email;
  }

  /**
   * Update builder profile
   */
  updateProfile(updates: Partial<Omit<BuilderProps, 'address'>>): void {
    this._props = {
      ...this._props,
      ...updates,
    };
    this.touch();
  }

  /**
   * Check if profile is complete
   */
  isProfileComplete(): boolean {
    return !!(this._props.name && this._props.bio);
  }

  /**
   * Check if builder has social links
   */
  hasSocialLinks(): boolean {
    return !!(this._props.github || this._props.twitter || this._props.website);
  }

  /**
   * Clone the builder
   */
  clone(): Builder {
    return new Builder(
      this.address,
      { ...this._props },
      this.createdAt,
      this.updatedAt
    );
  }

  /**
   * Convert to plain object
   */
  toObject(): BuilderProps & { createdAt: Date; updatedAt: Date } {
    return {
      ...this._props,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

