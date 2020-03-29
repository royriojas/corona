import fs from 'fs';
import path from 'path';
import mkdir from 'mkdirp';

export const existsSync = fs.existsSync; // eslint-disable-line prefer-destructuring

export const readSync = (file, opts = {}) => {
  if (!opts.encoding) {
    opts.encoding = 'utf8';
  }
  return fs.readFileSync(file, opts);
};

export const writeSync = (file, contents, options) => {
  const dir = path.dirname(file);
  mkdir.sync(dir);
  return fs.writeFileSync(file, contents, options);
};
