/**
 * Application enums
 */

/**
 * View mode for leaderboard display
 */
export enum ViewMode {
  TABLE = 'table',
  CARD = 'card',
  GRID = 'grid',
}

/**
 * Sort order
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Sort field
 */
export enum SortField {
  POSITION = 'position',
  SCORE = 'score',
  EARNINGS = 'earnings',
  MCAP = 'mcap',
}

/**
 * Table density
 */
export enum TableDensity {
  COMPACT = 'compact',
  COMFORTABLE = 'comfortable',
  SPACIOUS = 'spacious',
}

/**
 * Toast notification type
 */
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

/**
 * Button variant
 */
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  DANGER = 'danger',
}

/**
 * Button size
 */
export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

/**
 * Badge variant
 */
export enum BadgeVariant {
  DEFAULT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

/**
 * Loading state
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

