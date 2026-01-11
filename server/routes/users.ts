import express from 'express';
import { prisma } from '../utils/db.js';
import { authenticateToken, requireManager, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all users (manager only)
router.get('/', authenticateToken, requireManager, async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        apartmentNumber: true,
        isManager: true,
        createdAt: true,
        _count: {
          select: {
            completedTasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Błąd pobierania użytkowników' });
  }
});

// Get user stats
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Brak autoryzacji' });
    }

    const stats = await prisma.taskCompletion.groupBy({
      by: ['userId'],
      where: {
        userId: req.user.id,
      },
      _count: {
        id: true,
      },
    });

    const totalCompletions = stats[0]?._count.id || 0;

    // Get recent completions
    const recentCompletions = await prisma.taskCompletion.findMany({
      where: { userId: req.user.id },
      orderBy: { completedAt: 'desc' },
      take: 10,
      include: {
        task: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    res.json({
      totalCompletions,
      recentCompletions,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Błąd pobierania statystyk' });
  }
});

export default router;
