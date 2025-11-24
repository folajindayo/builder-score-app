/**
 * Environment Variables
 */

export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003',
  TALENT_API_KEY: process.env.TALENT_API_KEY || '',
  TALENT_API_URL: process.env.TALENT_API_URL || 'https://api.talentprotocol.com',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;
