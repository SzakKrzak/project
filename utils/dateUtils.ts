import { Frequency } from '../types';

export function calculateNextDueDate(frequency: Frequency, fromDate: Date = new Date()): Date {
  const next = new Date(fromDate);
  
  switch (frequency) {
    case 'Codziennie':
      next.setDate(next.getDate() + 1);
      break;
    case 'Co 2 dni':
      next.setDate(next.getDate() + 2);
      break;
    case 'Co tydzień':
      next.setDate(next.getDate() + 7);
      break;
    case 'Co 2 tygodnie':
      next.setDate(next.getDate() + 14);
      break;
    case 'Co miesiąc':
      next.setMonth(next.getMonth() + 1);
      break;
  }
  
  return next;
}
