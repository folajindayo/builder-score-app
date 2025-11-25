# Builder Score App

An onchain builder score and searcher application built with Next.js, ReownKit (AppKit), WalletConnect Wallet SDK, and Talent Protocol API.

## Features

- **Wallet Connection**: Connect your wallet using ReownKit (AppKit) to view your builder score
- **Builder Score Display**: View your onchain builder reputation score with credentials and skills
- **Builder Search**: Search for builders by:
  - Wallet address or ENS name
  - Builder score range
  - Skills
  - Credentials
- **Responsive Design**: Modern UI with Tailwind CSS styling

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Wallet Integration**:
  - ReownKit (AppKit) with Wagmi adapter
  - WalletConnect Wallet SDK (@reown/walletkit)
- **API**: Talent Protocol API for builder scores and search
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Reown (WalletConnect) project ID from [Reown Dashboard](https://dashboard.reown.com)
- Talent Protocol API key (optional - placeholder for now)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment variables template:

```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here
TALENT_PROTOCOL_API_KEY=your_talent_protocol_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with AppKit provider
│   ├── page.tsx             # Home page with wallet connection
│   ├── search/
│   │   └── page.tsx         # Builder search page
│   ├── api/
│   │   └── talent/          # API routes for Talent Protocol (proxy)
│   └── providers.tsx        # AppKit and Wagmi providers
├── components/
│   ├── WalletButton.tsx      # Wallet connect/disconnect button
│   ├── BuilderScore.tsx     # Display builder score card
│   ├── BuilderSearcher.tsx  # Search interface component
│   └── SearchResults.tsx     # Display search results
├── config/
│   ├── appkit.ts            # ReownKit configuration
│   └── wallet-sdk.ts       # WalletConnect Wallet SDK configuration
├── lib/
│   ├── talent-api.ts        # Talent Protocol API client
│   ├── hooks.ts             # Custom React hooks
│   └── utils.ts             # Utility functions
└── types/
    └── talent.ts            # TypeScript types for Talent Protocol
```

## Environment Variables

- `NEXT_PUBLIC_PROJECT_ID`: Your Reown (WalletConnect) project ID (required)
- `TALENT_PROTOCOL_API_KEY`: Talent Protocol API key (optional - placeholder for now)
- `NEXT_PUBLIC_TALENT_API_URL`: Talent Protocol API base URL (optional, defaults to https://api.talentprotocol.com/v1)

## Usage

### View Your Builder Score

1. Navigate to the home page
2. Click "Connect Wallet" to connect your wallet
3. Your builder score will be displayed automatically

### Search for Builders

1. Navigate to the Search page
2. Use the search filters to find builders:
   - Enter a wallet address or ENS name
   - Set a score range (min/max)
   - Filter by skills (comma-separated)
   - Filter by credentials (comma-separated)
3. Results will update automatically as you type

## API Integration

The app uses Talent Protocol's API to fetch builder scores and search results. API calls are proxied through Next.js API routes for security.

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint

```bash
npm run lint
```

## Documentation

- [Keyboard Shortcuts Guide](./docs/KEYBOARD_SHORTCUTS.md) - Complete guide to all keyboard shortcuts
- [ReownKit (AppKit) Documentation](https://docs.reown.com/appkit/overview)
- [WalletConnect Wallet SDK Documentation](https://docs.walletconnect.network/wallet-sdk/overview)
- [Talent Protocol Documentation](https://docs.talentprotocol.com/docs/developers/get-started)

## License

MIT
## Architecture

This project follows a clean architecture pattern with the following layers:

### Layers
- **Presentation Layer**: API routes and controllers
- **Business Logic Layer**: Services and domain logic
- **Data Access Layer**: Repositories and database interactions
- **Infrastructure Layer**: External services and utilities

### Design Patterns
- Dependency Injection for loose coupling
- Repository pattern for data access
- Factory pattern for object creation
- Observer pattern for event handling

### Key Components
```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── repositories/   # Data access
├── models/         # Data structures
├── utils/          # Helper functions
└── middleware/     # Express middleware
```
## Security

### Best Practices Implemented
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting
- Helmet.js security headers
- JWT authentication
- Environment variable protection

### Security Headers
```typescript
helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  noSniff: true,
  ieNoOpen: true,
})
```
## Testing Strategy

### Test Coverage
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical flows
- Performance tests for scalability

### Running Tests
```bash
npm run test          # Run all tests
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests
npm run test:coverage # Coverage report
```

### Test Structure
- AAA pattern (Arrange, Act, Assert)
- Mocking external dependencies
- Test fixtures and factories
- Snapshot testing where appropriate
