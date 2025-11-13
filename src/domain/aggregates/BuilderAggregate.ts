/**
 * Builder Aggregate Root
 * 
 * Aggregates Builder entity with related entities and value objects.
 * Ensures consistency within the aggregate boundary.
 */

import { Achievement } from '../entities/Achievement';
import { Builder } from '../entities/Builder';
import { Transaction } from '../entities/Transaction';
import { Score } from '../value-objects/Score';

export class BuilderAggregate {
  private _builder: Builder;
  private _score: Score;
  private _achievements: Achievement[];
  private _transactions: Transaction[];

  constructor(
    builder: Builder,
    score: Score,
    achievements: Achievement[] = [],
    transactions: Transaction[] = []
  ) {
    this._builder = builder;
    this._score = score;
    this._achievements = achievements;
    this._transactions = transactions;
  }

  /**
   * Get builder entity
   */
  get builder(): Builder {
    return this._builder;
  }

  /**
   * Get current score
   */
  get score(): Score {
    return this._score;
  }

  /**
   * Get achievements
   */
  get achievements(): readonly Achievement[] {
    return Object.freeze([...this._achievements]);
  }

  /**
   * Get transactions
   */
  get transactions(): readonly Transaction[] {
    return Object.freeze([...this._transactions]);
  }

  /**
   * Update builder profile
   */
  updateProfile(updates: Parameters<Builder['updateProfile']>[0]): void {
    this._builder.updateProfile(updates);
  }

  /**
   * Update score
   */
  updateScore(newScore: Score): void {
    this._score = newScore;
  }

  /**
   * Add achievement
   */
  addAchievement(achievement: Achievement): void {
    const exists = this._achievements.some((a) =>
      a.equals(achievement)
    );

    if (!exists) {
      this._achievements.push(achievement);
      // Could emit domain event here
    }
  }

  /**
   * Add transaction
   */
  addTransaction(transaction: Transaction): void {
    this._transactions.push(transaction);
  }

  /**
   * Get achievement count
   */
  getAchievementCount(): number {
    return this._achievements.length;
  }

  /**
   * Get transaction count
   */
  getTransactionCount(): number {
    return this._transactions.length;
  }

  /**
   * Get confirmed transaction count
   */
  getConfirmedTransactionCount(): number {
    return this._transactions.filter((t) => t.isConfirmed()).length;
  }

  /**
   * Get total achievement points
   */
  getTotalAchievementPoints(): number {
    return this._achievements.reduce((sum, a) => sum + a.points, 0);
  }

  /**
   * Check if builder has specific achievement
   */
  hasAchievement(type: Achievement['type']): boolean {
    return this._achievements.some((a) => a.type === type);
  }

  /**
   * Get recent achievements (last 7 days)
   */
  getRecentAchievements(): Achievement[] {
    return this._achievements.filter((a) => a.isRecent());
  }

  /**
   * Get recent transactions (last 24 hours)
   */
  getRecentTransactions(): Transaction[] {
    return this._transactions.filter((t) => t.isRecent());
  }
}

