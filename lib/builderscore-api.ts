import type {
  LeaderboardResponse,
  LeaderboardFilters,
} from "@/types/talent";

// Use Next.js API route as proxy for security
const API_BASE = "/api/builderscore";

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const params = new URLSearchParams({ endpoint });
  const url = `${API_BASE}?${params.toString()}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "API request failed" }));
    throw new Error(error.error || error.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getLeaderboard(
  filters: LeaderboardFilters = {}
): Promise<LeaderboardResponse> {
  try {
    const params = new URLSearchParams();
    
    if (filters.per_page !== undefined) {
      params.append("per_page", filters.per_page.toString());
    }
    if (filters.page !== undefined) {
      params.append("page", filters.page.toString());
    }
    if (filters.sponsor_slug) {
      params.append("sponsor_slug", filters.sponsor_slug);
    }
    if (filters.grant_id !== undefined) {
      params.append("grant_id", filters.grant_id.toString());
    }

    const queryString = params.toString();
    return await fetchAPI<LeaderboardResponse>(
      `/leaderboards${queryString ? `?${queryString}` : ""}`
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

