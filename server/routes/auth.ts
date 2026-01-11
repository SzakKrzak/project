import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';

const router = express.Router();

// Register
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, apartmentNumber, password } = req.body;

    if (!name || !apartmentNumber || !password) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { apartmentNumber },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Użytkownik z tym numerem lokalu już istnieje' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        apartmentNumber,
        passwordHash,
        isManager: false,
      },
      select: {
        id: true,
        name: true,
        apartmentNumber: true,
        isManager: true,
      },
    });

    const token = generateToken(user.id, user.apartmentNumber);

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Błąd rejestracji' });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { apartmentNumber, password } = req.body;

    if (!apartmentNumber || !password) {
      return res.status(400).json({ error: 'Numer lokalu i hasło są wymagane' });
    }

    const user = await prisma.user.findUnique({
      where: { apartmentNumber },
    });

    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy numer lokalu lub hasło' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Nieprawidłowy numer lokalu lub hasło' });
    }

    const token = generateToken(user.id, user.apartmentNumber);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        apartmentNumber: user.apartmentNumber,
        isManager: user.isManager,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Błąd logowania' });
  }
});

// Verify manager password
router.post('/verify-manager', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Hasło jest wymagane' });
    }

    if (!req.user?.isManager) {
      return res.status(403).json({ error: 'Wymagane uprawnienia kierownika' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Nieprawidłowe hasło' });
    }

    res.json({ verified: true });
  } catch (error) {
    console.error('Manager verification error:', error);
    res.status(500).json({ error: 'Błąd weryfikacji' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Błąd pobierania użytkownika' });
  }
});

function generateToken(userId: string, apartmentNumber: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET nie jest ustawiony');
  }

  return jwt.sign(
    { userId, apartmentNumber },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export default router;
