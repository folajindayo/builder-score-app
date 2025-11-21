/**
 * Builder Profile Factory
 */

import { BuilderProfile } from '../entities/builder-profile.entity';

export class BuilderProfileFactory {
  static create(data: any): BuilderProfile {
    return new BuilderProfile(
      data.id,
      data.githubUsername,
      data.score,
      data.credentials,
      data.activity
    );
  }

  static createFromAPI(apiData: any): BuilderProfile {
    return BuilderProfileFactory.create({
      id: apiData.id,
      githubUsername: apiData.github_username,
      score: apiData.score || 0,
      credentials: apiData.credentials || [],
      activity: apiData.activity || {},
    });
  }
}

