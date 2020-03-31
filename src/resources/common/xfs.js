import fs from 'fs';
import thenify from './thenify';
import { tryParse } from '../../backend/common/try-parse';

export const read = thenify(fs.readFile);

export const readJSON = async file => {
  const content = await read(file, { encoding: 'utf8' });
  return tryParse(content);
};
