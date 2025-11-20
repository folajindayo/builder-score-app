/**
 * Logger
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (msg: string, data?: any) => {
    if (isDev) console.log(`ℹ️ ${msg}`, data);
  },

  error: (msg: string, error?: any) => {
    console.error(`❌ ${msg}`, error);
  },

  warn: (msg: string, data?: any) => {
    if (isDev) console.warn(`⚠️ ${msg}`, data);
  },

  success: (msg: string) => {
    if (isDev) console.log(`✅ ${msg}`);
  },
};

