import { nullish } from './nullish';

export const tryParse = (str, defaultObj) => {
  let returnedObj;
  try {
    returnedObj = JSON.parse(str);

    if (nullish(returnedObj)) {
      returnedObj = defaultObj;
    }
  } catch (ex) {
    returnedObj = defaultObj;
  }

  return returnedObj;
};
