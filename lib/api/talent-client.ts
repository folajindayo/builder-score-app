/**
 * Talent Protocol API Client
 */

export class TalentClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.talentprotocol.com/v1';
  }

  async getBuilderScore(address: string) {
    const response = await fetch(`${this.baseUrl}/builders/${address}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch builder score');
    }

    return response.json();
  }

  async searchBuilders(query: string) {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search builders');
    }

    return response.json();
  }
}

