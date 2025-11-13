/**
 * Transaction Entity
 * 
 * Represents a blockchain transaction associated with a builder.
 */

import { Entity } from './Entity';

export enum TransactionType {
  DEPLOYMENT = 'deployment',
  INTERACTION = 'interaction',
  TRANSFER = 'transfer',
  SWAP = 'swap',
  MINT = 'mint',
  BURN = 'burn',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export interface TransactionProps {
  hash: string;
  from: string;
  to?: string;
  value: string;
  type: TransactionType;
  status: TransactionStatus;
  blockNumber?: number;
  timestamp: Date;
  gasUsed?: string;
  gasPrice?: string;
  data?: string;
  metadata?: Record<string, any>;
}

export class Transaction extends Entity<string> {
  private _props: TransactionProps;

  constructor(
    hash: string,
    props: Omit<TransactionProps, 'hash'>,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(hash, createdAt, updatedAt);
    this.validateProps({ hash, ...props });
    this._props = { hash, ...props };
  }

  /**
   * Get transaction hash
   */
  get hash(): string {
    return this._props.hash;
  }

  /**
   * Get sender address
   */
  get from(): string {
    return this._props.from;
  }

  /**
   * Get recipient address
   */
  get to(): string | undefined {
    return this._props.to;
  }

  /**
   * Get transaction value
   */
  get value(): string {
    return this._props.value;
  }

  /**
   * Get transaction type
   */
  get type(): TransactionType {
    return this._props.type;
  }

  /**
   * Get transaction status
   */
  get status(): TransactionStatus {
    return this._props.status;
  }

  /**
   * Get block number
   */
  get blockNumber(): number | undefined {
    return this._props.blockNumber;
  }

  /**
   * Get timestamp
   */
  get timestamp(): Date {
    return this._props.timestamp;
  }

  /**
   * Get gas used
   */
  get gasUsed(): string | undefined {
    return this._props.gasUsed;
  }

  /**
   * Get gas price
   */
  get gasPrice(): string | undefined {
    return this._props.gasPrice;
  }

  /**
   * Get transaction data
   */
  get data(): string | undefined {
    return this._props.data;
  }

  /**
   * Get metadata
   */
  get metadata(): Record<string, any> | undefined {
    return this._props.metadata;
  }

  /**
   * Check if transaction is confirmed
   */
  isConfirmed(): boolean {
    return this._props.status === TransactionStatus.CONFIRMED;
  }

  /**
   * Check if transaction is pending
   */
  isPending(): boolean {
    return this._props.status === TransactionStatus.PENDING;
  }

  /**
   * Check if transaction failed
   */
  hasFailed(): boolean {
    return this._props.status === TransactionStatus.FAILED;
  }

  /**
   * Check if transaction is recent (within last 24 hours)
   */
  isRecent(): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return this._props.timestamp > oneDayAgo;
  }

  /**
   * Update transaction status
   */
  updateStatus(status: TransactionStatus, blockNumber?: number): void {
    this._props.status = status;
    if (blockNumber !== undefined) {
      this._props.blockNumber = blockNumber;
    }
    this.touch();
  }

  /**
   * Validate transaction props
   */
  private validateProps(props: TransactionProps): void {
    if (!props.hash || !this.isValidHash(props.hash)) {
      throw new Error('Valid transaction hash is required');
    }

    if (!props.from || !this.isValidAddress(props.from)) {
      throw new Error('Valid from address is required');
    }

    if (props.to && !this.isValidAddress(props.to)) {
      throw new Error('Invalid to address');
    }

    if (!props.value) {
      throw new Error('Transaction value is required');
    }
  }

  /**
   * Validate hash format
   */
  private isValidHash(hash: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }

  /**
   * Validate address format
   */
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Clone transaction
   */
  clone(): Transaction {
    return new Transaction(
      this.hash,
      { ...this._props },
      this.createdAt,
      this.updatedAt
    );
  }

  /**
   * Convert to plain object
   */
  toObject(): TransactionProps & { createdAt: Date; updatedAt: Date } {
    return {
      ...this._props,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

