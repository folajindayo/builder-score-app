/**
 * Builder Factory
 * 
 * Factory for creating Builder entities.
 */

import { Builder } from '../entities/Builder';

export class BuilderFactory {
  static create(address: string, name?: string): Builder {
    return new Builder(address, { name });
  }

  static createWithProfile(
    address: string,
    profile: Parameters<Builder['updateProfile']>[0]
  ): Builder {
    return new Builder(address, profile);
  }

  static fromPlainObject(data: any): Builder {
    return new Builder(
      data.address,
      {
        name: data.name,
        avatar: data.avatar,
        bio: data.bio,
        github: data.github,
        twitter: data.twitter,
        website: data.website,
        email: data.email,
      },
      data.createdAt ? new Date(data.createdAt) : undefined,
      data.updatedAt ? new Date(data.updatedAt) : undefined
    );
  }
}

