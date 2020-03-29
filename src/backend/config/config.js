import 'dotenv/config';
import { envVar } from '../common/env-val';

export const APP_PORT = envVar('APP_PORT', 8081);
export const BROWSER_SYNC_PORT = envVar('BROWSER_SYNC_PORT', 8082);
export const IS_PRODUCTION = envVar('NODE_ENV', 'development') === 'production';
