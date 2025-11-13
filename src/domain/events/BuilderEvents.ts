/**
 * Builder Domain Events
 * 
 * Events related to Builder aggregate.
 */

import { DomainEvent } from './DomainEvent';

export class BuilderCreatedEvent extends DomainEvent {
  constructor(
    public readonly builderAddress: string,
    public readonly name?: string
  ) {
    super(builderAddress, 'BuilderCreated');
  }

  getEventData(): Record<string, any> {
    return {
      builderAddress: this.builderAddress,
      name: this.name,
    };
  }
}

export class BuilderProfileUpdatedEvent extends DomainEvent {
  constructor(
    public readonly builderAddress: string,
    public readonly updates: Record<string, any>
  ) {
    super(builderAddress, 'BuilderProfileUpdated');
  }

  getEventData(): Record<string, any> {
    return {
      builderAddress: this.builderAddress,
      updates: this.updates,
    };
  }
}

export class BuilderScoreUpdatedEvent extends DomainEvent {
  constructor(
    public readonly builderAddress: string,
    public readonly previousScore: number,
    public readonly newScore: number
  ) {
    super(builderAddress, 'BuilderScoreUpdated');
  }

  getEventData(): Record<string, any> {
    return {
      builderAddress: this.builderAddress,
      previousScore: this.previousScore,
      newScore: this.newScore,
      difference: this.newScore - this.previousScore,
    };
  }
}

export class AchievementEarnedEvent extends DomainEvent {
  constructor(
    public readonly builderAddress: string,
    public readonly achievementId: string,
    public readonly achievementType: string,
    public readonly points: number
  ) {
    super(builderAddress, 'AchievementEarned');
  }

  getEventData(): Record<string, any> {
    return {
      builderAddress: this.builderAddress,
      achievementId: this.achievementId,
      achievementType: this.achievementType,
      points: this.points,
    };
  }
}

