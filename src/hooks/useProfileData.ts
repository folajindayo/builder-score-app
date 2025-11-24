import { useState, useEffect } from "react";
import { BuilderProfile, builderService } from "@/services/builderService";

interface UseProfileDataResult {
  profile: BuilderProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateLocal: (updates: Partial<BuilderProfile>) => void;
}

export function useProfileData(address: string | null): UseProfileDataResult {
  const [profile, setProfile] = useState<BuilderProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!address) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await builderService.getProfile(address);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateLocal = (updates: Partial<BuilderProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  useEffect(() => {
    fetchProfile();
  }, [address]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateLocal,
  };
}

