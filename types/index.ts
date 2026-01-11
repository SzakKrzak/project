export type Location = 'Bar' | 'Zaplecze' | 'Biuro' | 'Produkcja' | 'Sala' | 'Łazienka' | 'Zmywak' | 'Inne';

export type Frequency = 'Codziennie' | 'Co 2 dni' | 'Co tydzień' | 'Co 2 tygodnie' | 'Co miesiąc';

export interface CleaningItem {
  id: string;
  name: string;
  description: string;
  frequency: Frequency;
  location: Location;
  image?: string;
  isImportant: boolean;
  isCompleted: boolean;
  lastCompleted?: Date;
  nextDue: Date;
  completionImage?: string;
}

export interface User {
  name: string;
  apartmentNumber: string;
  password: string;
}

export interface Manager {
  password: string;
}
