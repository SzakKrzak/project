import express from 'express';
import { prisma } from '../utils/db.js';
import { authenticateToken, requireManager, AuthRequest } from '../middleware/auth.js';
import { calculateNextDueDate } from '../utils/dateUtils.js';
import { validateTask } from '../middleware/validation.js';

const router = express.Router();

// Get all tasks
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { includeCompleted, location, frequency } = req.query;

    const where: any = {
      isActive: true,
    };

    if (location) {
      where.location = location;
    }

    if (frequency) {
      where.frequency = frequency;
    }

    const tasks = await prisma.cleaningTask.findMany({
      where,
      orderBy: [
        { isImportant: 'desc' },
        { createdAt: 'asc' },
      ],
      include: {
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 1,
          include: {
            user: {
              select: {
                name: true,
                apartmentNumber: true,
              },
            },
          },
        },
      },
    });

    // Calculate next due date and completion status
    const tasksWithStatus = tasks.map((task) => {
      const lastCompletion = task.completions[0];
      const lastCompleted = lastCompletion ? new Date(lastCompletion.completedAt) : null;
      const nextDue = lastCompleted
        ? calculateNextDueDate(task.frequency as any, lastCompleted)
        : calculateNextDueDate(task.frequency as any);

      // Task is completed if it was completed within the last 24 hours
      const isCompleted = lastCompletion && new Date(lastCompletion.completedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);

      return {
        id: task.id,
        name: task.name,
        description: task.description,
        frequency: task.frequency,
        location: task.location,
        image: task.imageUrl,
        isImportant: task.isImportant,
        isCompleted: !!isCompleted,
        lastCompleted: lastCompleted ? lastCompleted.toISOString() : undefined,
        nextDue: nextDue.toISOString(),
        completionImage: lastCompletion?.completionImage,
      };
    });

    // Filter by completion status if requested
    let filteredTasks = tasksWithStatus;
    if (includeCompleted === 'false') {
      filteredTasks = tasksWithStatus.filter((t) => !t.isCompleted);
    } else if (includeCompleted === 'true') {
      filteredTasks = tasksWithStatus.filter((t) => t.isCompleted);
    }

    res.json(filteredTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Błąd pobierania zadań' });
  }
});

// Get single task
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const task = await prisma.cleaningTask.findUnique({
      where: { id: req.params.id },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                apartmentNumber: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Zadanie nie znalezione' });
    }

    const lastCompletion = task.completions[0];
    const lastCompleted = lastCompletion ? new Date(lastCompletion.completedAt) : null;
    const nextDue = lastCompleted
      ? calculateNextDueDate(task.frequency as any, lastCompleted)
      : calculateNextDueDate(task.frequency as any);

    res.json({
      id: task.id,
      name: task.name,
      description: task.description,
      frequency: task.frequency,
      location: task.location,
      image: task.imageUrl,
      isImportant: task.isImportant,
      isCompleted: !!lastCompletion,
      lastCompleted: lastCompleted ? lastCompleted.toISOString() : undefined,
      nextDue: nextDue.toISOString(),
      completionImage: lastCompletion?.completionImage,
      history: task.completions.map((c) => ({
        id: c.id,
        completedAt: c.completedAt.toISOString(),
        completionImage: c.completionImage,
        notes: c.notes,
        user: c.user,
      })),
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Błąd pobierania zadania' });
  }
});

// Create task (manager only)
router.post('/', authenticateToken, requireManager, validateTask, async (req: AuthRequest, res) => {
  try {
    const { name, description, frequency, location, image, isImportant } = req.body;

    if (!name || !description || !frequency || !location) {
      return res.status(400).json({ error: 'Wszystkie wymagane pola muszą być wypełnione' });
    }

    const task = await prisma.cleaningTask.create({
      data: {
        name,
        description,
        frequency,
        location,
        imageUrl: image,
        isImportant: isImportant || false,
      },
    });

    res.status(201).json({
      id: task.id,
      name: task.name,
      description: task.description,
      frequency: task.frequency,
      location: task.location,
      image: task.imageUrl,
      isImportant: task.isImportant,
      isCompleted: false,
      nextDue: calculateNextDueDate(frequency),
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Błąd tworzenia zadania' });
  }
});

// Update task (manager only)
router.put('/:id', authenticateToken, requireManager, validateTask, async (req: AuthRequest, res) => {
  try {
    const { name, description, frequency, location, image, isImportant } = req.body;

    const task = await prisma.cleaningTask.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        frequency,
        location,
        imageUrl: image,
        isImportant,
      },
    });

    res.json({
      id: task.id,
      name: task.name,
      description: task.description,
      frequency: task.frequency,
      location: task.location,
      image: task.imageUrl,
      isImportant: task.isImportant,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Błąd aktualizacji zadania' });
  }
});

// Delete task (manager only)
router.delete('/:id', authenticateToken, requireManager, async (req: AuthRequest, res) => {
  try {
    await prisma.cleaningTask.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });

    res.json({ message: 'Zadanie usunięte' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Błąd usuwania zadania' });
  }
});

// Complete task
router.post('/:id/complete', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { completionImage, notes } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Brak autoryzacji' });
    }

    const task = await prisma.cleaningTask.findUnique({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Zadanie nie znalezione' });
    }

    const completion = await prisma.taskCompletion.create({
      data: {
        taskId: task.id,
        userId: req.user.id,
        completionImage,
        notes,
      },
      include: {
        user: {
          select: {
            name: true,
            apartmentNumber: true,
          },
        },
      },
    });

    // Create notification for managers
    const managers = await prisma.user.findMany({
      where: { isManager: true },
    });

    await prisma.notification.createMany({
      data: managers.map((manager) => ({
        userId: manager.id,
        message: `Zadanie "${task.name}" zostało wykonane przez ${req.user.name}`,
        type: 'task_completed',
      })),
    });

    res.status(201).json({
      id: completion.id,
      completedAt: completion.completedAt,
      completionImage: completion.completionImage,
      notes: completion.notes,
      user: completion.user,
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Błąd oznaczania zadania jako wykonane' });
  }
});

// Toggle important (manager only)
router.patch('/:id/important', authenticateToken, requireManager, async (req: AuthRequest, res) => {
  try {
    const task = await prisma.cleaningTask.findUnique({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Zadanie nie znalezione' });
    }

    const updatedTask = await prisma.cleaningTask.update({
      where: { id: req.params.id },
      data: { isImportant: !task.isImportant },
    });

    res.json({ isImportant: updatedTask.isImportant });
  } catch (error) {
    console.error('Toggle important error:', error);
    res.status(500).json({ error: 'Błąd zmiany statusu ważności' });
  }
});

export default router;
