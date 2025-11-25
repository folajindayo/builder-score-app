import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Setup MSW worker for browser environment
 * This can be used for development and browser testing
 */
export const worker = setupWorker(...handlers);
