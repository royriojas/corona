import { lsSave, lsGet, lsClear } from './ls';

let storagePrefix = 'corona';

/**
 * creates a key that is combined with the storagePrefix
 * @param {string} key the key to be combined with the storagePrefix
 * @returns {string} the combined key to be used by the localStorage entries
 */
const getCombinedKey = key => `${storagePrefix}_${key}`;

/**
 * sets the storagePrefix to use by this module
 * @param {string} prefix the prefix to be used by all the keys this module store in the localStorage
 */
export const setStoragePrefix = prefix => (storagePrefix = prefix);

/**
 * Set the provided value in the localStorage using the key as its identifier.
 * The value will be serialized with `JSON.stringify` so it must not include cycles.
 * @param {string} key the key to indetify this cache entry
 * @param {*} value the value to store in the localStorage
 */
export const setInCache = (key, value) => {
  const theKey = getCombinedKey(key);
  lsSave(theKey, value);
};

/**
 * gets the entry from the cache that is identified by the provided key.
 * @param {string} key the key that indentify the cache entry
 * @param {*} defVal the default value to return in case parsing the stored item fails
 * @returns {*} the entry in the cache
 */
export const getFromCache = (key, defVal) => {
  const theKey = getCombinedKey(key);
  return lsGet(theKey, defVal);
};

/**
 * removes the entry identified by the provided key
 * @param {string} key
 */
export const removeFromCache = key => {
  const theKey = getCombinedKey(key);
  lsClear(theKey);
};
