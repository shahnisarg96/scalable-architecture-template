import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Configuration object for the application.
 * 
 * @property {string} port - The port on which the application will run. Defaults to '8081' if not specified in the environment variable `PORT`.
 * @property {string} tokenExpiry - The token expiry time in seconds. Defaults to '3600' if not specified in the environment variable `TOKEN_EXPIRY`.
 */
export const config = {
    port: process.env.PORT || '8081',
    tokenExpiry: process.env.TOKEN_EXPIRY || '3600',
};