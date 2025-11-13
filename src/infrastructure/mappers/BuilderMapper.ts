/**
 * Builder Entity Mapper
 * Maps between domain entities and external data formats
 */

import { Builder } from '@domain/entities/Builder';

export class BuilderMapper {
  static toDomain(data: any): Builder {
    return new Builder(
      data.wallet_address || data.address,
      {
        name: data.name,
        avatar: data.avatar_url || data.avatar,
        bio: data.bio || data.description,
        github: data.github_username || data.github,
        twitter: data.twitter_handle || data.twitter,
        website: data.website_url || data.website,
        email: data.email,
      },
      data.created_at ? new Date(data.created_at) : undefined,
      data.updated_at ? new Date(data.updated_at) : undefined
    );
  }

  static toDTO(builder: Builder): any {
    return {
      address: builder.address,
      name: builder.name,
      avatar: builder.avatar,
      bio: builder.bio,
      github: builder.github,
      twitter: builder.twitter,
      website: builder.website,
      email: builder.email,
      created_at: builder.createdAt.toISOString(),
      updated_at: builder.updatedAt.toISOString(),
    };
  }

  static toApiFormat(builder: Builder): any {
    return {
      wallet_address: builder.address,
      name: builder.name,
      avatar_url: builder.avatar,
      description: builder.bio,
      github_username: builder.github,
      twitter_handle: builder.twitter,
      website_url: builder.website,
      email: builder.email,
    };
  }
}

