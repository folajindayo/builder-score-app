import { builderService, BuilderProfile, BuilderActivity } from "./builderService";
import { profileCache } from "@/lib/cache";

export class CachedBuilderService {
  async getProfile(address: string): Promise<BuilderProfile | null> {
    const cacheKey = `profile:${address}`;

    return profileCache.getOrSet(cacheKey, async () => {
      return await builderService.getProfile(address);
    });
  }

  async getActivity(address: string, limit: number = 10): Promise<BuilderActivity[]> {
    const cacheKey = `activity:${address}:${limit}`;

    return profileCache.getOrSet(cacheKey, async () => {
      return await builderService.getActivity(address, limit);
    }, 60000); // 1 minute cache for activity
  }

  async updateProfile(
    address: string,
    updates: Partial<BuilderProfile>
  ): Promise<BuilderProfile> {
    const result = await builderService.updateProfile(address, updates);

    // Invalidate cache after update
    profileCache.delete(`profile:${address}`);

    return result;
  }

  async calculateScore(address: string): Promise<number> {
    const cacheKey = `score:${address}`;

    return profileCache.getOrSet(cacheKey, async () => {
      return await builderService.calculateScore(address);
    }, 300000); // 5 minutes cache for score
  }

  clearCache(address?: string): void {
    if (address) {
      profileCache.delete(`profile:${address}`);
      profileCache.delete(`score:${address}`);
    } else {
      profileCache.clear();
    }
  }
}

export const cachedBuilderService = new CachedBuilderService();

