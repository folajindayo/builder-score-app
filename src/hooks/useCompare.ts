import { useState, useCallback } from "react";
import { BuilderProfile } from "@/services/builderService";

interface UseCompareResult {
  selectedProfiles: BuilderProfile[];
  addProfile: (profile: BuilderProfile) => void;
  removeProfile: (address: string) => void;
  clearProfiles: () => void;
  isSelected: (address: string) => boolean;
  canAddMore: boolean;
}

const MAX_COMPARE = 4;

export function useCompare(): UseCompareResult {
  const [selectedProfiles, setSelectedProfiles] = useState<BuilderProfile[]>([]);

  const addProfile = useCallback((profile: BuilderProfile) => {
    setSelectedProfiles((prev) => {
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }

      if (prev.some((p) => p.address === profile.address)) {
        return prev;
      }

      return [...prev, profile];
    });
  }, []);

  const removeProfile = useCallback((address: string) => {
    setSelectedProfiles((prev) => prev.filter((p) => p.address !== address));
  }, []);

  const clearProfiles = useCallback(() => {
    setSelectedProfiles([]);
  }, []);

  const isSelected = useCallback(
    (address: string) => {
      return selectedProfiles.some((p) => p.address === address);
    },
    [selectedProfiles]
  );

  const canAddMore = selectedProfiles.length < MAX_COMPARE;

  return {
    selectedProfiles,
    addProfile,
    removeProfile,
    clearProfiles,
    isSelected,
    canAddMore,
  };
}

