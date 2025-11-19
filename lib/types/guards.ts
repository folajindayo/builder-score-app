/**
 * Type guard functions
 */

import {
  ActivityType,
  ApiResponse,
  ApiError,
  BuilderProfile,
  LeaderboardEntry,
} from "./api";

export function isActivityType(value: unknown): value is ActivityType {
  return (
    typeof value === "string" && ["commit", "pr", "issue", "review"].includes(value)
  );
}

export function isBuilderProfile(value: unknown): value is BuilderProfile {
  return (
    typeof value === "object" &&
    value !== null &&
    "address" in value &&
    "score" in value &&
    "rank" in value &&
    "stats" in value &&
    typeof (value as any).address === "string" &&
    typeof (value as any).score === "number" &&
    typeof (value as any).rank === "number"
  );
}

export function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "address" in value &&
    "score" in value &&
    "rank" in value &&
    typeof (value as any).address === "string" &&
    typeof (value as any).score === "number" &&
    typeof (value as any).rank === "number"
  );
}

export function isEthereumAddress(value: unknown): value is string {
  return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof (value as any).success === "boolean"
  );
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    typeof (value as any).code === "string" &&
    typeof (value as any).message === "string"
  );
}

export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: true; data: T } {
  return response.success && response.data !== undefined;
}

export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: false; error: ApiError } {
  return !response.success && response.error !== undefined;
}

export function assertEthereumAddress(
  value: unknown,
  name: string = "address"
): asserts value is string {
  if (!isEthereumAddress(value)) {
    throw new Error(`Invalid Ethereum address: ${name}`);
  }
}

export function assertActivityType(
  value: unknown,
  name: string = "type"
): asserts value is ActivityType {
  if (!isActivityType(value)) {
    throw new Error(`Invalid activity type: ${name}`);
  }
}

export function assertBuilderProfile(
  value: unknown,
  name: string = "profile"
): asserts value is BuilderProfile {
  if (!isBuilderProfile(value)) {
    throw new Error(`Invalid builder profile: ${name}`);
  }
}

