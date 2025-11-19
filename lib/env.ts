/**
 * Environment Variables
 * Type-safe access to environment variables
 */

interface EnvConfig {
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string;
  NEXT_PUBLIC_ANALYTICS_ENABLED?: string;
  NEXT_PUBLIC_SENTRY_ENABLED?: string;
  NEXT_PUBLIC_SENTRY_DSN?: string;
}

function getEnvVar(key: keyof EnvConfig, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value && defaultValue === undefined) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    console.warn(`Missing environment variable: ${key}`);
    return "";
  }
  
  return value || defaultValue || "";
}

export const env = {
  NODE_ENV: (process.env.NODE_ENV || "development") as EnvConfig["NODE_ENV"],
  NEXT_PUBLIC_APP_URL: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: getEnvVar("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"),
  NEXT_PUBLIC_ANALYTICS_ENABLED: getEnvVar("NEXT_PUBLIC_ANALYTICS_ENABLED", "false"),
  NEXT_PUBLIC_SENTRY_ENABLED: getEnvVar("NEXT_PUBLIC_SENTRY_ENABLED", "false"),
  NEXT_PUBLIC_SENTRY_DSN: getEnvVar("NEXT_PUBLIC_SENTRY_DSN", ""),
} as const;

export const isProd = env.NODE_ENV === "production";
export const isDev = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";

export function validateEnv(): void {
  const required: Array<keyof EnvConfig> = [
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && isProd) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

