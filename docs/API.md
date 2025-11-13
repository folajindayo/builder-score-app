# API Documentation

## Talent Protocol API

### Get Builder Profile

```
GET /v1/builders/:address
```

Returns builder profile with score, credentials, and skills.

### Search Builders

```
GET /v1/builders/search?q=:query
```

Search for builders by name, address, or ENS.

## BuilderScore API

### Get Leaderboard

```
GET /api/leaderboard?page=:page
```

Returns paginated leaderboard data.

### Get User Score

```
GET /api/score/:address
```

Returns detailed score breakdown for a user.

## Authentication

All API requests require authentication via wallet signature or API key.

## Rate Limits

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Error Codes

- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

