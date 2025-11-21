/**
 * Builder Profile Entity
 * Represents a builder with their scores and credentials
 */

export interface BuilderProfileProps {
  id: string;
  walletAddress: string;
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  score: BuilderScore;
  credentials: Credential[];
  socialLinks: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuilderScore {
  overall: number;
  reputation: number;
  activity: number;
  skills: number;
  contributions: number;
}

export interface Credential {
  id: string;
  type: CredentialType;
  issuer: string;
  issuedAt: Date;
  verified: boolean;
  metadata?: Record<string, any>;
}

export enum CredentialType {
  GITHUB = 'github',
  TALENT_PROTOCOL = 'talent_protocol',
  ENS = 'ens',
  LENS = 'lens',
  FARCASTER = 'farcaster',
  CUSTOM = 'custom',
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  website?: string;
  linkedin?: string;
}

export class BuilderProfileEntity {
  private constructor(private readonly props: BuilderProfileProps) {}

  static create(props: BuilderProfileProps): BuilderProfileEntity {
    this.validate(props);
    return new BuilderProfileEntity(props);
  }

  private static validate(props: BuilderProfileProps): void {
    if (!props.id) {
      throw new Error('Builder ID is required');
    }

    if (!props.walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(props.walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    if (props.score.overall < 0 || props.score.overall > 100) {
      throw new Error('Overall score must be between 0 and 100');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get walletAddress(): string {
    return this.props.walletAddress;
  }

  get displayName(): string {
    return this.props.displayName || this.props.username || this.truncateAddress();
  }

  get score(): BuilderScore {
    return { ...this.props.score };
  }

  get credentials(): Credential[] {
    return [...this.props.credentials];
  }

  truncateAddress(): string {
    return `${this.props.walletAddress.slice(0, 6)}...${this.props.walletAddress.slice(-4)}`;
  }

  hasVerifiedCredentials(): boolean {
    return this.props.credentials.some((c) => c.verified);
  }

  getCredentialsByType(type: CredentialType): Credential[] {
    return this.props.credentials.filter((c) => c.type === type);
  }

  isTopBuilder(): boolean {
    return this.props.score.overall >= 80;
  }

  addCredential(credential: Credential): BuilderProfileEntity {
    return new BuilderProfileEntity({
      ...this.props,
      credentials: [...this.props.credentials, credential],
      updatedAt: new Date(),
    });
  }

  updateScore(score: Partial<BuilderScore>): BuilderProfileEntity {
    return new BuilderProfileEntity({
      ...this.props,
      score: { ...this.props.score, ...score },
      updatedAt: new Date(),
    });
  }

  toJSON() {
    return {
      id: this.props.id,
      walletAddress: this.props.walletAddress,
      username: this.props.username,
      displayName: this.displayName,
      bio: this.props.bio,
      avatarUrl: this.props.avatarUrl,
      score: this.props.score,
      credentials: this.props.credentials,
      socialLinks: this.props.socialLinks,
      hasVerifiedCredentials: this.hasVerifiedCredentials(),
      isTopBuilder: this.isTopBuilder(),
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}

