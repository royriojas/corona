import { exec } from 'child_process';
import thenify from './thenify';

const execp = thenify(exec);

export default execp;
