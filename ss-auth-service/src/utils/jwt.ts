import fs from 'fs'
import jwt from 'jsonwebtoken'
import path from 'path'
import { User } from '../../prisma/generated/prisma-client';
import { config } from '../config/index.js'

const __dirname = import.meta.dirname;
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../keys/private.pem'), 'utf8')

/**
 * Generates a JSON Web Token (JWT) for a given user.
 *
 * @param user - An object containing the user's `id`, `email`, and `role`.
 * @returns A signed JWT string.
 *
 * @remarks
 * - The token is signed using the RS256 algorithm and is valid for 1 hour.
 * - Ensure that `privateKey` is securely stored and not hardcoded in the codebase.
 *   It is recommended to move `privateKey` to environment variables or a secure secrets manager.
 *
 */
export const generateToken = (user: Pick<User , 'id' | 'email' | 'role'>) => {
    return jwt.sign(user, privateKey, { algorithm: 'RS256', expiresIn: Number(config.tokenExpiry) || 3600 })
}