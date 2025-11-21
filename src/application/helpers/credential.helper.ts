/**
 * Credential Helper Functions
 */

export function getCredentialWeight(type: string): number {
  const weights: Record<string, number> = {
    github: 0.3,
    talent_protocol: 0.25,
    ens: 0.15,
    lens: 0.15,
    farcaster: 0.1,
    custom: 0.05,
  };
  
  return weights[type] || 0;
}

export function validateCredential(credential: any): boolean {
  if (!credential.type || !credential.issuer) return false;
  
  if (credential.type === 'github' && !credential.metadata?.username) {
    return false;
  }
  
  return true;
}

export function calculateCredentialScore(credentials: any[]): number {
  const verifiedCredentials = credentials.filter(c => c.verified);
  
  return verifiedCredentials.reduce((score, cred) => {
    const weight = getCredentialWeight(cred.type);
    return score + (weight * 100);
  }, 0);
}

