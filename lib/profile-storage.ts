/**
 * Profile storage utilities for local data
 */

export interface UserProfile {
  address: string;
  name?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  lastUpdated: string;
}

const PROFILE_STORAGE_KEY = 'builder-profiles';

/**
 * Get profile from local storage
 */
export function getLocalProfile(address: string): UserProfile | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(`${PROFILE_STORAGE_KEY}:${address}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get profile from storage:', error);
    return null;
  }
}

/**
 * Save profile to local storage
 */
export function saveLocalProfile(profile: UserProfile): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const dataToStore = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(
      `${PROFILE_STORAGE_KEY}:${profile.address}`,
      JSON.stringify(dataToStore)
    );
    return true;
  } catch (error) {
    console.error('Failed to save profile to storage:', error);
    return false;
  }
}

/**
 * Delete profile from local storage
 */
export function deleteLocalProfile(address: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(`${PROFILE_STORAGE_KEY}:${address}`);
    return true;
  } catch (error) {
    console.error('Failed to delete profile from storage:', error);
    return false;
  }
}

/**
 * Get all profiles from local storage
 */
export function getAllLocalProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return [];

  try {
    const profiles: UserProfile[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PROFILE_STORAGE_KEY)) {
        const value = localStorage.getItem(key);
        if (value) {
          profiles.push(JSON.parse(value));
        }
      }
    }
    return profiles;
  } catch (error) {
    console.error('Failed to get all profiles from storage:', error);
    return [];
  }
}

