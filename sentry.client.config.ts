import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  
  // Adjust this value in production
  tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Filtering
  beforeSend(event, hint) {
    // Filter out localhost errors in development
    if (ENVIRONMENT === 'development') {
      return null;
    }
    
    // Filter out specific errors
    const error = hint.originalException;
    if (error instanceof Error) {
      // Ignore network errors
      if (error.message.includes('Failed to fetch')) {
        return null;
      }
      
      // Ignore wallet connection errors (user-initiated)
      if (error.message.includes('User rejected')) {
        return null;
      }
    }
    
    return event;
  },
  
  // Performance monitoring
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/[^/]*\.vercel\.app/],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

