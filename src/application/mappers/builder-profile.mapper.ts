/**
 * Builder Profile Mapper
 */

import { BuilderProfile } from '../../domain/entities/builder-profile.entity';
import { BuilderProfileDTO } from '../dtos/builder-profile.dto';

export class BuilderProfileMapper {
  static toDTO(entity: BuilderProfile): BuilderProfileDTO {
    return {
      id: entity.id,
      githubUsername: entity.githubUsername,
      score: entity.score,
      credentials: entity.credentials,
      activity: entity.activity,
    };
  }

  static toDTOList(entities: BuilderProfile[]): BuilderProfileDTO[] {
    return entities.map((entity, index) => ({
      ...this.toDTO(entity),
      rank: index + 1,
    }));
  }

  static toEntity(dto: BuilderProfileDTO): BuilderProfile {
    return new BuilderProfile(
      dto.id,
      dto.githubUsername,
      dto.score,
      dto.credentials,
      dto.activity
    );
  }
}
