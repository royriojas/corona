// code for `typeOf` borrowed from `jQuery.type`
// to avoid including jquery only to have this
const class2type = {};

const types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object'];

const toStr = Object.prototype.toString;

types.forEach(name => {
  class2type[`[object ${name}]`] = name.toLowerCase();
});

export default function typeOf(obj) {
  if (typeof obj === 'undefined') {
    return 'undefined';
  }
  return obj === null ? String(obj) : class2type[toStr.call(obj)] || 'object';
}

export const isBoolean = arg => typeOf(arg) === 'boolean';
export const isNumber = arg => Number(arg) === arg;
export const isString = arg => typeOf(arg) === 'string';
export const isFunction = arg => typeof arg === 'function';
export const isArray = arg => typeOf(arg) === 'array';
export const isDate = arg => typeOf(arg) === 'date';
export const isRegExp = arg => typeOf(arg) === 'regexp';
export const isObject = arg => typeOf(arg) === 'object';

export const isNum = arg => !Number.isNaN(arg) && isNumber(arg);
