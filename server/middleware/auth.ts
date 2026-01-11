import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    apartmentNumber: string;
    isManager: boolean;
  };
}

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Brak tokenu uwierzytelniającego' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET nie jest ustawiony');
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      apartmentNumber: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        apartmentNumber: true,
        isManager: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Użytkownik nie znaleziony' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: 'Nieprawidłowy token' });
    }
    return res.status(500).json({ error: 'Błąd uwierzytelniania' });
  }
}

export function requireManager(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user?.isManager) {
    return res.status(403).json({ error: 'Wymagane uprawnienia kierownika' });
  }
  next();
}
