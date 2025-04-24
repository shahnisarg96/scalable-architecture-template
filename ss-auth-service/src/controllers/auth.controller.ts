import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { PrismaClient, User } from '../../prisma/generated/prisma-client/index.js';
import { Request } from 'express';

const prisma = new PrismaClient();

/**
 * Signs up a new user by hashing their password, creating a user record in the database,
 * and generating an authentication token.
 *
 * @param email - The email address of the user.
 * @param password - The plain text password of the user.
 * @param role - The role of the user, either 'USER' or 'ADMIN'. Defaults to 'USER'.
 * @returns A promise that resolves to a JWT token containing the user's id, email, and role.
 */
export const signup = async (req: Request<{}, {}, User>) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new Error('User already exists, please proceed to login');
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashed, role: role },
        });
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        return { status: 201, token };
    } catch (error) {
        if (error instanceof Error) {
            return { status: 400, message: `Error during signup: ${error.message}` };
        }
        return { status: 500, message: 'An unknown error occurred during signup' };
    }
};

/**
 * Logs in a user by validating their email and password, updating their last login timestamp,
 * and generating an authentication token.
 *
 * @param email - The email address of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @returns A promise that resolves to a JWT token containing the user's ID, email, and role.
 * @throws An error if the credentials are invalid (e.g., user not found or password mismatch).
 */
export const login = async (req: Request) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        // Check if user exists and password matches
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        // Update lastLoginAt field
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        return { status: 200, token };
    } catch (error) {
        if (error instanceof Error) {
            return { status: 400, message: `Error during login: ${error.message}` };
        }
        return { status: 500, message: 'An unknown error occurred during login' };
    }
};
