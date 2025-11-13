/**
 * Achievement Entity
 * 
 * Represents a builder's achievement or milestone.
 */

import { Entity } from './Entity';

export enum AchievementType {
  FIRST_CONTRIBUTION = 'first_contribution',
  MILESTONE_10 = 'milestone_10',
  MILESTONE_50 = 'milestone_50',
  MILESTONE_100 = 'milestone_100',
  TOP_CONTRIBUTOR = 'top_contributor',
  STREAK_7_DAYS = 'streak_7_days',
  STREAK_30_DAYS = 'streak_30_days',
  STREAK_365_DAYS = 'streak_365_days',
  EARLY_ADOPTER = 'early_adopter',
  COMMUNITY_LEADER = 'community_leader',
  CODE_QUALITY = 'code_quality',
  INNOVATOR = 'innovator',
}

export enum AchievementTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
}

export interface AchievementProps {
  type: AchievementType;
  tier: AchievementTier;
  title: string;
  description: string;
  earnedAt: Date;
  builderAddress: string;
  points: number;
  metadata?: Record<string, any>;
}

export class Achievement extends Entity<string> {
  private _props: AchievementProps;

  constructor(
    id: string,
    props: AchievementProps,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.validateProps(props);
    this._props = { ...props };
  }

  /**
   * Get achievement type
   */
  get type(): AchievementType {
    return this._props.type;
  }

  /**
   * Get achievement tier
   */
  get tier(): AchievementTier {
    return this._props.tier;
  }

  /**
   * Get achievement title
   */
  get title(): string {
    return this._props.title;
  }

  /**
   * Get achievement description
   */
  get description(): string {
    return this._props.description;
  }

  /**
   * Get earned timestamp
   */
  get earnedAt(): Date {
    return this._props.earnedAt;
  }

  /**
   * Get builder address
   */
  get builderAddress(): string {
    return this._props.builderAddress;
  }

  /**
   * Get points awarded
   */
  get points(): number {
    return this._props.points;
  }

  /**
   * Get metadata
   */
  get metadata(): Record<string, any> | undefined {
    return this._props.metadata;
  }

  /**
   * Check if achievement is recent (within last 7 days)
   */
  isRecent(): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this._props.earnedAt > sevenDaysAgo;
  }

  /**
   * Check if achievement is rare (platinum or diamond tier)
   */
  isRare(): boolean {
    return (
      this._props.tier === AchievementTier.PLATINUM ||
      this._props.tier === AchievementTier.DIAMOND
    );
  }

  /**
   * Get tier value for comparison
   */
  getTierValue(): number {
    const tierValues: Record<AchievementTier, number> = {
      [AchievementTier.BRONZE]: 1,
      [AchievementTier.SILVER]: 2,
      [AchievementTier.GOLD]: 3,
      [AchievementTier.PLATINUM]: 4,
      [AchievementTier.DIAMOND]: 5,
    };
    return tierValues[this._props.tier];
  }

  /**
   * Validate achievement props
   */
  private validateProps(props: AchievementProps): void {
    if (!props.type) {
      throw new Error('Achievement type is required');
    }

    if (!props.tier) {
      throw new Error('Achievement tier is required');
    }

    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Achievement title is required');
    }

    if (!props.builderAddress || !this.isValidAddress(props.builderAddress)) {
      throw new Error('Valid builder address is required');
    }

    if (props.points < 0) {
      throw new Error('Achievement points cannot be negative');
    }
  }

  /**
   * Simple address validation
   */
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Clone achievement
   */
  clone(): Achievement {
    return new Achievement(
      this.id,
      { ...this._props },
      this.createdAt,
      this.updatedAt
    );
  }

  /**
   * Convert to plain object
   */
  toObject(): AchievementProps & { id: string; createdAt: Date; updatedAt: Date } {
    return {
      id: this.id,
      ...this._props,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Create achievement from factory
   */
  static create(
    builderAddress: string,
    type: AchievementType,
    tier: AchievementTier
  ): Achievement {
    const achievements: Record<
      AchievementType,
      { title: string; description: string; points: number }
    > = {
      [AchievementType.FIRST_CONTRIBUTION]: {
        title: 'First Contribution',
        description: 'Made your first contribution to the ecosystem',
        points: 10,
      },
      [AchievementType.MILESTONE_10]: {
        title: '10 Contributions',
        description: 'Reached 10 contributions milestone',
        points: 50,
      },
      [AchievementType.MILESTONE_50]: {
        title: '50 Contributions',
        description: 'Reached 50 contributions milestone',
        points: 250,
      },
      [AchievementType.MILESTONE_100]: {
        title: '100 Contributions',
        description: 'Reached 100 contributions milestone',
        points: 500,
      },
      [AchievementType.TOP_CONTRIBUTOR]: {
        title: 'Top Contributor',
        description: 'Ranked in top 10 contributors',
        points: 1000,
      },
      [AchievementType.STREAK_7_DAYS]: {
        title: '7 Day Streak',
        description: 'Contributed for 7 consecutive days',
        points: 100,
      },
      [AchievementType.STREAK_30_DAYS]: {
        title: '30 Day Streak',
        description: 'Contributed for 30 consecutive days',
        points: 500,
      },
      [AchievementType.STREAK_365_DAYS]: {
        title: 'Year Long Streak',
        description: 'Contributed for 365 consecutive days',
        points: 5000,
      },
      [AchievementType.EARLY_ADOPTER]: {
        title: 'Early Adopter',
        description: 'One of the first 100 builders',
        points: 250,
      },
      [AchievementType.COMMUNITY_LEADER]: {
        title: 'Community Leader',
        description: 'Demonstrated exceptional community leadership',
        points: 1000,
      },
      [AchievementType.CODE_QUALITY]: {
        title: 'Code Quality Champion',
        description: 'Maintained exceptional code quality standards',
        points: 750,
      },
      [AchievementType.INNOVATOR]: {
        title: 'Innovator',
        description: 'Introduced innovative solutions',
        points: 1500,
      },
    };

    const achievement = achievements[type];
    const id = `${builderAddress}-${type}-${Date.now()}`;

    return new Achievement(id, {
      type,
      tier,
      title: achievement.title,
      description: achievement.description,
      earnedAt: new Date(),
      builderAddress,
      points: achievement.points,
    });
  }
}

