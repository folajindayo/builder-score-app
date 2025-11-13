/**
 * Builder Repository Implementation
 */

import { Builder } from '@domain/entities/Builder';
import {
  BuilderSearchCriteria,
  IBuilderRepository,
  PaginatedResult,
  PaginationOptions,
} from '@domain/repositories/IBuilderRepository';
import { BaseRepository } from './BaseRepository';

export class BuilderRepositoryImpl extends BaseRepository<Builder, string> implements IBuilderRepository {
  private builders: Map<string, any> = new Map();

  async findById(id: string): Promise<Builder | null> {
    const data = this.builders.get(id);
    return data ? this.toDomain(data) : null;
  }

  async findByAddress(address: string): Promise<Builder | null> {
    return this.findById(address.toLowerCase());
  }

  async findByName(name: string): Promise<Builder[]> {
    const results: Builder[] = [];
    for (const data of this.builders.values()) {
      if (data.name?.toLowerCase().includes(name.toLowerCase())) {
        results.push(this.toDomain(data));
      }
    }
    return results;
  }

  async findAll(criteria?: Record<string, any>): Promise<Builder[]> {
    return Array.from(this.builders.values()).map((data) => this.toDomain(data));
  }

  async search(
    criteria: BuilderSearchCriteria,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Builder>> {
    let results = Array.from(this.builders.values());

    if (criteria.name) {
      results = results.filter((b) =>
        b.name?.toLowerCase().includes(criteria.name!.toLowerCase())
      );
    }

    if (criteria.address) {
      results = results.filter((b) => b.address === criteria.address);
    }

    const page = options?.page || 0;
    const limit = options?.limit || 10;
    const start = page * limit;
    const paginatedData = results.slice(start, start + limit);

    return {
      data: paginatedData.map((d) => this.toDomain(d)),
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit),
    };
  }

  async findTopBuilders(limit: number): Promise<Builder[]> {
    return Array.from(this.builders.values())
      .slice(0, limit)
      .map((data) => this.toDomain(data));
  }

  async findIncompleteProfiles(): Promise<Builder[]> {
    const results: Builder[] = [];
    for (const data of this.builders.values()) {
      const builder = this.toDomain(data);
      if (!builder.isProfileComplete()) {
        results.push(builder);
      }
    }
    return results;
  }

  async save(entity: Builder): Promise<Builder> {
    const data = this.toPersistence(entity);
    this.builders.set(entity.address, data);
    return entity;
  }

  async updateProfile(address: string, updates: Partial<Builder>): Promise<Builder | null> {
    const builder = await this.findByAddress(address);
    if (!builder) return null;

    builder.updateProfile(updates as any);
    return this.save(builder);
  }

  async bulkSave(builders: Builder[]): Promise<Builder[]> {
    return this.saveBatch(builders);
  }

  async delete(id: string): Promise<boolean> {
    return this.builders.delete(id);
  }

  protected toPersistence(entity: Builder): any {
    return entity.toObject();
  }

  protected toDomain(raw: any): Builder {
    return new Builder(
      raw.address,
      {
        name: raw.name,
        avatar: raw.avatar,
        bio: raw.bio,
        github: raw.github,
        twitter: raw.twitter,
        website: raw.website,
        email: raw.email,
      },
      raw.createdAt,
      raw.updatedAt
    );
  }
}

