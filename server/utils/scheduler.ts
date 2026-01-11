import { checkOverdueTasks } from './notifications.js';

// Run notification check every hour
export function startScheduler() {
  // Run immediately on start
  checkOverdueTasks();

  // Then run every hour
  setInterval(() => {
    checkOverdueTasks();
  }, 60 * 60 * 1000); // 1 hour

  console.log('✅ Scheduler started - checking for overdue tasks every hour');
}
