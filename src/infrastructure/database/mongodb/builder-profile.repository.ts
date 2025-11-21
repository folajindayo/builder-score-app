/**
 * Builder Profile Repository Implementation (MongoDB)
 */

import { IBuilderProfileRepository } from '../../../domain/repositories/builder-profile.repository';
import { BuilderProfile } from '../../../domain/entities/builder-profile.entity';
import { MongoClient, Db } from 'mongodb';

export class MongoBuilderProfileRepository implements IBuilderProfileRepository {
  private db: Db;

  constructor(client: MongoClient) {
    this.db = client.db('builder_score');
  }

  async findByGithubUsername(username: string): Promise<BuilderProfile | null> {
    const collection = this.db.collection('profiles');
    const profile = await collection.findOne({ githubUsername: username });
    
    if (!profile) return null;
    
    return new BuilderProfile(
      profile._id.toString(),
      profile.githubUsername,
      profile.score,
      profile.credentials,
      profile.activity
    );
  }

  async findAll(): Promise<BuilderProfile[]> {
    const collection = this.db.collection('profiles');
    const profiles = await collection.find().sort({ score: -1 }).toArray();
    
    return profiles.map(p => new BuilderProfile(
      p._id.toString(),
      p.githubUsername,
      p.score,
      p.credentials,
      p.activity
    ));
  }

  async save(profile: BuilderProfile): Promise<void> {
    const collection = this.db.collection('profiles');
    
    await collection.updateOne(
      { githubUsername: profile.githubUsername },
      {
        $set: {
          score: profile.score,
          credentials: profile.credentials,
          activity: profile.activity,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  async findTopBuilders(limit: number): Promise<BuilderProfile[]> {
    const collection = this.db.collection('profiles');
    const profiles = await collection
      .find()
      .sort({ score: -1 })
      .limit(limit)
      .toArray();
    
    return profiles.map(p => new BuilderProfile(
      p._id.toString(),
      p.githubUsername,
      p.score,
      p.credentials,
      p.activity
    ));
  }
}

