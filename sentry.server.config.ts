import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  
  // Adjust this value in production
  tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
  
  // Filtering
  beforeSend(event) {
    // Don't send events in development
    if (ENVIRONMENT === 'development') {
      return null;
    }
    
    return event;
  },
});

