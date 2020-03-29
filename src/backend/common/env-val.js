import { tryParse } from './try-parse';
import { nullish } from './nullish';
import { process } from './node-globals';

export const envVar = (key, defaultVal) => {
  const val = process.env[key];

  if (nullish(val) || val === '') {
    return defaultVal;
  }
  // in case of failure we want the original string
  // as it might be a simple string not representing a JSON object
  return tryParse(val, val);
};
