export const nullish = val => typeof val === 'undefined' || val === null;
export const nullishOrEmpty = val => val === '' || nullish(val);
