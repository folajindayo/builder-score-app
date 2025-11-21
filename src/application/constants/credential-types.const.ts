/**
 * Credential Type Constants
 */

export const CREDENTIAL_TYPES = {
  GITHUB: 'github',
  TALENT_PROTOCOL: 'talent_protocol',
  ENS: 'ens',
  LENS: 'lens',
  FARCASTER: 'farcaster',
  CUSTOM: 'custom',
} as const;

export type CredentialTypeType = typeof CREDENTIAL_TYPES[keyof typeof CREDENTIAL_TYPES];

export const CREDENTIAL_TYPE_LABELS: Record<string, string> = {
  github: 'GitHub',
  talent_protocol: 'Talent Protocol',
  ens: 'ENS',
  lens: 'Lens Protocol',
  farcaster: 'Farcaster',
  custom: 'Custom',
};

export const CREDENTIAL_TYPE_ICONS: Record<string, string> = {
  github: '🐙',
  talent_protocol: '🎯',
  ens: '🌐',
  lens: '🌿',
  farcaster: '🎭',
  custom: '✨',
};

