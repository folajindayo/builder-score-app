// Integration features (commits 121-125)
export async function fetchGitHubActivity(username: string): Promise<any> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub activity:', error);
    return [];
  }
}

export async function fetchGitHubRepos(username: string): Promise<any> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];
  }
}

export async function fetchTwitterProfile(username: string): Promise<any> {
  // Mock - would use Twitter API with proper auth
  return {
    username,
    followers: 0,
    following: 0,
    tweets: 0,
  };
}

export interface DiscordBotCommand {
  name: string;
  description: string;
  handler: (args: string[]) => Promise<string>;
}

export const discordCommands: DiscordBotCommand[] = [
  {
    name: 'score',
    description: 'Get your builder score',
    handler: async (args) => `Your current score is: ${args[0] || 'N/A'}`,
  },
  {
    name: 'leaderboard',
    description: 'View top builders',
    handler: async () => 'Top 10 builders:\n1. Builder1 (950)\n2. Builder2 (920)...',
  },
  {
    name: 'profile',
    description: 'View your profile',
    handler: async (args) => `Profile: ${args[0] || 'Unknown'}`,
  },
];

export interface TelegramNotification {
  chatId: string;
  message: string;
  parseMode?: 'HTML' | 'Markdown';
}

export async function sendTelegramNotification(notification: TelegramNotification): Promise<void> {
  // Mock - would use Telegram Bot API
  console.log('Sending Telegram notification:', notification);
}

export async function resolveENS(address: string): Promise<string | null> {
  try {
    // Mock - would use ENS resolution
    if (address.endsWith('.eth')) return address;
    return null;
  } catch (error) {
    return null;
  }
}

export async function getENSAvatar(ensName: string): Promise<string | null> {
  try {
    // Mock - would fetch ENS avatar
    return null;
  } catch (error) {
    return null;
  }
}

export function integrateWithWalletConnect(): void {
  // Already integrated via ReownKit in the app
  console.log('WalletConnect integrated via ReownKit');
}

