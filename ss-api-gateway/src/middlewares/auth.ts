import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

/**
 * Load the public key for verifying JWT tokens.
 */
const publicKey = fs.readFileSync(path.resolve('/app/keys/public.pem'), 'utf8');

/**
 * Extend the Express Request type to include the `user` property.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to verify JWT tokens.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * 
 * @description
 * This middleware checks for the presence of a JWT token in the `Authorization` header,
 * verifies its validity using the public key, and attaches the decoded payload to the `req.user` object.
 * If the token is missing, invalid, or expired, it responds with an appropriate error message.
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;

    req.user = decoded;

    const method = req.method.toLowerCase();
    const role = decoded.role.toLowerCase();

    if (role === 'user' && method !== 'get') {
      return res.status(403).json({ message: 'Forbidden: Users can only perform GET requests' });
    }

    if (role !== 'admin' && role !== 'user') {
      return res.status(403).json({ message: 'Forbidden: Invalid role' });
    }
    
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    } else {
      return res.status(403).json({ message: 'Token verification failed' });
    }
  }
};
