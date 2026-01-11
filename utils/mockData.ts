import { CleaningItem } from '../types';

// Helper function to calculate next due date based on frequency
export function getNextDueDate(frequency: string, lastCompleted?: Date): Date {
  const base = lastCompleted || new Date();
  const next = new Date(base);
  
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

export const initialCleaningItems: CleaningItem[] = [
  {
    id: '1',
    name: 'Wycieranie baru',
    description: 'Dokładne wytarcie powierzchni baru, dezynfekcja blatu',
    frequency: 'Codziennie',
    location: 'Bar',
    image: 'https://images.unsplash.com/photo-1626379481874-3dc5678fa8ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHN1cHBsaWVzfGVufDF8fHx8MTc2ODA3MDQ3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    isImportant: true,
    isCompleted: false,
    lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    nextDue: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago - overdue
  },
  {
    id: '2',
    name: 'Sprzątanie zmywaka',
    description: 'Umycie zmywaka, czyszczenie zlewu, wycieranie powierzchni',
    frequency: 'Co 2 dni',
    location: 'Zmywak',
    image: 'https://images.unsplash.com/photo-1567767326925-e2047bf469d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwY2xlYW58ZW58MXx8fHwxNzY4MTUxOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isImportant: false,
    isCompleted: false,
    nextDue: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    id: '3',
    name: 'Czyszczenie łazienki',
    description: 'Mycie toalet, czyszczenie umywalek, wycieranie luster, uzupełnianie papieru',
    frequency: 'Codziennie',
    location: 'Łazienka',
    image: 'https://images.unsplash.com/photo-1609879937493-56540300d8cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMGNsZWFufGVufDF8fHx8MTc2ODE1MTk1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    isImportant: false,
    isCompleted: false,
    nextDue: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
  },
  {
    id: '4',
    name: 'Sprzątanie biura',
    description: 'Odkurzanie, wycieranie biurek, opróżnianie koszy',
    frequency: 'Co tydzień',
    location: 'Biuro',
    image: 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY4MTUxOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    isImportant: false,
    isCompleted: true,
    lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    nextDue: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    completionImage: 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY4MTUxOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '5',
    name: 'Sprzątanie sali',
    description: 'Odkurzanie podłogi, wycieranie stołów i krzeseł',
    frequency: 'Co 2 dni',
    location: 'Sala',
    isImportant: false,
    isCompleted: false,
    nextDue: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: '6',
    name: 'Porządki w zapleczu',
    description: 'Organizacja przestrzeni, wyrzucanie śmieci, czyszczenie regałów',
    frequency: 'Co 2 tygodnie',
    location: 'Zaplecze',
    isImportant: true,
    isCompleted: false,
    nextDue: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
  },
];
