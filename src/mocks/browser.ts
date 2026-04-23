import { setupWorker } from 'msw/browser';
import { storeHandlers } from './handlers/stores.handlers';
import { categoryHandlers } from './handlers/categories.handlers';

export const worker = setupWorker(...storeHandlers, ...categoryHandlers);
