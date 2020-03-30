import { window } from './globals';
import { tryParse } from '../../backend/common/try-parse';

const { localStorage } = window;

export const lsSave = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('lsSave error', err);
    console.error('key/value', key, value);
  }
};

export const lsGet = (key, defVal) => tryParse(localStorage.getItem(key), defVal);

export const lsClear = key => localStorage.removeItem(key);

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (err) {
    console.error('localStorage.clear error', err);
  }
};
