/**
 * Builder Profile Mapper
 */

import { BuilderProfileEntity } from '../../domain/entities/builder-profile.entity';
import { BuilderProfileDTO } from '../dtos/builder-profile.dto';

export class BuilderProfileMapper {
  static toDTO(entity: BuilderProfileEntity): BuilderProfileDTO {
    return {
      id: entity.id,
      walletAddress: entity.walletAddress,
      username: entity.username,
      displayName: entity.displayName,
      bio: entity.bio,
      avatarUrl: entity.avatarUrl,
      score: entity.score,
      credentials: entity.credentials.map((c) => ({
        ...c,
        issuedAt: c.issuedAt.toISOString(),
      })),
      socialLinks: entity.socialLinks,
      hasVerifiedCredentials: entity.hasVerifiedCredentials(),
      isTopBuilder: entity.isTopBuilder(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toDTOList(entities: BuilderProfileEntity[]): BuilderProfileDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}

