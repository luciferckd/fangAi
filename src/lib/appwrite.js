/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node Modules
 */
import { Client, Account, Avatars, Databases } from 'appwrite';
import { mockAccount, mockDatabases, mockAvatars } from './localMock';

/**
 * Check if mock mode is forced via environment or if remote project is inactive
 */
const isMockForced =
  import.meta.env.VITE_USE_LOCAL_MOCK === 'true' ||
  import.meta.env.VITE_APPWRITE_PROJECT_ID === 'fang-ai';

let useLocalMock = isMockForced;

/**
 * Initial appwrite client
 */
const client = new Client();

client
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'fang-ai')
  .setEndpoint('https://cloud.appwrite.io/v1');

/**
 * Real Appwrite services
 */
const realAccount = new Account(client);
const realAvatars = new Avatars(client);
const realDatabases = new Databases(client);

const isPausedError = (err) => {
  const msg = (err?.message || '').toLowerCase();
  return (
    msg.includes('paused') ||
    msg.includes('inactivity') ||
    msg.includes('network error') ||
    msg.includes('failed to fetch')
  );
};

/**
 * Smart Proxy for Account:
 * Delegates to local mock if enabled, or automatically fails over if Appwrite is paused.
 */
const account = new Proxy(realAccount, {
  get(target, prop) {
    if (useLocalMock && prop in mockAccount) {
      return typeof mockAccount[prop] === 'function'
        ? mockAccount[prop].bind(mockAccount)
        : mockAccount[prop];
    }

    const orig = target[prop];
    if (typeof orig === 'function') {
      return async (...args) => {
        try {
          return await orig.apply(target, args);
        } catch (err) {
          if (isPausedError(err)) {
            console.warn(
              '[FangAI] Appwrite Cloud project is paused. Falling back to local offline mode.'
            );
            useLocalMock = true;
            if (typeof mockAccount[prop] === 'function') {
              return await mockAccount[prop](...args);
            }
          }
          throw err;
        }
      };
    }
    return orig;
  },
});

/**
 * Smart Proxy for Databases:
 * Delegates to local mock if enabled, or automatically fails over if Appwrite is paused.
 */
const databases = new Proxy(realDatabases, {
  get(target, prop) {
    if (useLocalMock && prop in mockDatabases) {
      return typeof mockDatabases[prop] === 'function'
        ? mockDatabases[prop].bind(mockDatabases)
        : mockDatabases[prop];
    }

    const orig = target[prop];
    if (typeof orig === 'function') {
      return async (...args) => {
        try {
          return await orig.apply(target, args);
        } catch (err) {
          if (isPausedError(err)) {
            console.warn(
              '[FangAI] Appwrite Cloud project is paused. Falling back to local offline mode.'
            );
            useLocalMock = true;
            if (typeof mockDatabases[prop] === 'function') {
              return await mockDatabases[prop](...args);
            }
          }
          throw err;
        }
      };
    }
    return orig;
  },
});

/**
 * Smart Proxy for Avatars:
 */
const avatars = new Proxy(realAvatars, {
  get(target, prop) {
    if (useLocalMock && prop in mockAvatars) {
      return typeof mockAvatars[prop] === 'function'
        ? mockAvatars[prop].bind(mockAvatars)
        : mockAvatars[prop];
    }
    return typeof target[prop] === 'function'
      ? target[prop].bind(target)
      : target[prop];
  },
});

export { account, avatars, databases };
