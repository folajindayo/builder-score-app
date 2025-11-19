import { BuilderProfile } from "@/services/builderService";

export interface BuilderRepository {
  findByAddress(address: string): Promise<BuilderProfile | null>;
  findAll(limit?: number, offset?: number): Promise<BuilderProfile[]>;
  create(profile: Omit<BuilderProfile, "rank">): Promise<BuilderProfile>;
  update(address: string, updates: Partial<BuilderProfile>): Promise<BuilderProfile | null>;
  delete(address: string): Promise<boolean>;
  count(): Promise<number>;
}

export class InMemoryBuilderRepository implements BuilderRepository {
  private builders: Map<string, BuilderProfile> = new Map();

  async findByAddress(address: string): Promise<BuilderProfile | null> {
    return this.builders.get(address) || null;
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<BuilderProfile[]> {
    const allBuilders = Array.from(this.builders.values());
    return allBuilders.slice(offset, offset + limit);
  }

  async create(profile: Omit<BuilderProfile, "rank">): Promise<BuilderProfile> {
    const rank = this.builders.size + 1;
    const newProfile: BuilderProfile = {
      ...profile,
      rank,
    };

    this.builders.set(profile.address, newProfile);
    return newProfile;
  }

  async update(
    address: string,
    updates: Partial<BuilderProfile>
  ): Promise<BuilderProfile | null> {
    const existing = this.builders.get(address);

    if (!existing) {
      return null;
    }

    const updated = { ...existing, ...updates };
    this.builders.set(address, updated);
    return updated;
  }

  async delete(address: string): Promise<boolean> {
    return this.builders.delete(address);
  }

  async count(): Promise<number> {
    return this.builders.size;
  }
}

export const builderRepository = new InMemoryBuilderRepository();

