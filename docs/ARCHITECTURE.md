# Architecture Documentation

## Overview

Builder Score App is built with Next.js 15, React 19, and TypeScript.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, NativeWind (Tailwind CSS)
- **Wallet**: ReownKit (AppKit), Wagmi
- **State Management**: React Query
- **Testing**: Jest, React Testing Library, Playwright
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics

## Directory Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions and services
├── __tests__/          # Test files
├── docs/               # Documentation
├── public/             # Static assets
└── config/             # Configuration files
```

## Data Flow

1. User connects wallet
2. App fetches builder data from Talent Protocol API
3. Data is cached with React Query
4. UI updates reactively

## API Integration

- Talent Protocol API for builder data
- BuilderScore API for leaderboard
- ENS for name resolution

## Caching Strategy

- React Query for API caching (5-minute TTL)
- LocalStorage for user preferences
- Edge caching for static content

## Security

- All API keys stored in environment variables
- No sensitive data in localStorage
- CSP headers configured
- Rate limiting on API routes

