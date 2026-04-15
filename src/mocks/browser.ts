import { setupWorker } from 'msw/browser';
import { storeHandlers } from './handlers/stores.handlers';

export const worker = setupWorker(...storeHandlers);
