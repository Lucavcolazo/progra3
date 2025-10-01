import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface AuthPayload {
  address: string;
}

declare global {
  // Extiende Request para llevar address
  namespace Express {
    interface Request {
      userAddress?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? '';
if (!JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en variables de entorno');
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload & { exp: number };
    req.userAddress = payload.address.toLowerCase();
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function signJwt(address: string) {
  return jwt.sign({ address: address.toLowerCase() }, JWT_SECRET, { expiresIn: '1h' });
}


