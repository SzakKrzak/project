import { prisma } from './db.js';
import { calculateNextDueDate } from './dateUtils.js';

export async function checkOverdueTasks() {
  try {
    const tasks = await prisma.cleaningTask.findMany({
      where: { isActive: true },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
    });

    const now = new Date();
    const notifications = [];

    for (const task of tasks) {
      const lastCompletion = task.completions[0];
      const lastCompleted = lastCompletion ? new Date(lastCompletion.completedAt) : null;
      const nextDue = lastCompleted
        ? calculateNextDueDate(task.frequency as any, lastCompleted)
        : calculateNextDueDate(task.frequency as any);

      // Check if task is overdue (more than 24 hours past due date)
      const hoursOverdue = (now.getTime() - nextDue.getTime()) / (1000 * 60 * 60);

      if (hoursOverdue > 24) {
        // Check if notification already exists for this task
        const existingNotification = await prisma.notification.findFirst({
          where: {
            message: {
              contains: task.name,
            },
            type: 'task_overdue',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        });

        if (!existingNotification) {
          // Get all users to notify
          const users = await prisma.user.findMany();
          
          for (const user of users) {
            notifications.push({
              userId: user.id,
              message: `Zadanie "${task.name}" jest zaległe o ${Math.floor(hoursOverdue / 24)} dni`,
              type: 'task_overdue',
            });
          }
        }
      } else if (hoursOverdue > 0 && hoursOverdue <= 24) {
        // Task is due today
        const existingNotification = await prisma.notification.findFirst({
          where: {
            message: {
              contains: task.name,
            },
            type: 'task_due',
            createdAt: {
              gte: new Date(Date.now() - 12 * 60 * 60 * 1000), // Last 12 hours
            },
          },
        });

        if (!existingNotification) {
          const users = await prisma.user.findMany();
          
          for (const user of users) {
            notifications.push({
              userId: user.id,
              message: `Zadanie "${task.name}" jest do wykonania dzisiaj`,
              type: 'task_due',
            });
          }
        }
      }
    }

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications,
      });
      console.log(`✅ Created ${notifications.length} notifications`);
    }
  } catch (error) {
    console.error('Error checking overdue tasks:', error);
  }
}
