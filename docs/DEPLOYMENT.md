# Deployment Guide

## Prerequisites

- Node.js 20+
- npm or yarn
- Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_TALENT_PROTOCOL_API_KEY=your_api_key
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## Build

```bash
npm run build
```

## Deploy to Vercel

```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Post-Deployment

1. Verify all environment variables are set
2. Check error tracking in Sentry
3. Monitor analytics in Vercel Dashboard
4. Test all features in production

## Rollback

```bash
vercel rollback
```

