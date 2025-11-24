"use client";

import { Select } from "../Select";
import { Input } from "../Input";
import { Button } from "../Button";

export interface LeaderboardFilters {
  category?: string;
  minScore?: number;
  maxScore?: number;
  search?: string;
  sponsor?: string;
}

interface LeaderboardFiltersPanelProps {
  filters: LeaderboardFilters;
  onFiltersChange: (filters: LeaderboardFilters) => void;
  onReset: () => void;
}

export function LeaderboardFiltersPanel({
  filters,
  onFiltersChange,
  onReset,
}: LeaderboardFiltersPanelProps) {
  const handleFilterChange = (key: keyof LeaderboardFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button onClick={onReset} variant="ghost" size="sm">
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>
          <Input
            type="text"
            placeholder="Search by name or address..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <Select
            value={filters.category || "all"}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="top">Top Builders</option>
            <option value="rising">Rising Stars</option>
            <option value="emerging">Emerging</option>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Min Score
          </label>
          <Input
            type="number"
            placeholder="Minimum score"
            value={filters.minScore || ""}
            onChange={(e) =>
              handleFilterChange("minScore", Number(e.target.value))
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Max Score
          </label>
          <Input
            type="number"
            placeholder="Maximum score"
            value={filters.maxScore || ""}
            onChange={(e) =>
              handleFilterChange("maxScore", Number(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
}

