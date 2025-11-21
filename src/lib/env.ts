/**
 * Environment Variables
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  githubToken: process.env.GITHUB_TOKEN || '',
  talentProtocolKey: process.env.TALENT_PROTOCOL_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

