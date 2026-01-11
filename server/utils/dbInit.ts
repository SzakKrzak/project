import { prisma } from './db.js';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  try {
    // Check if admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { isManager: true },
    });

    if (!adminUser) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          name: 'Administrator',
          apartmentNumber: 'ADMIN',
          passwordHash: hashedPassword,
          isManager: true,
        },
      });
      console.log('✅ Default admin user created (apartment: ADMIN, password: admin123)');
    }

    // Check if there are any tasks
    const taskCount = await prisma.cleaningTask.count();
    if (taskCount === 0) {
      // Create default tasks
      const defaultTasks = [
        {
          name: 'Wycieranie baru',
          description: 'Dokładne wytarcie powierzchni baru, dezynfekcja blatu',
          frequency: 'Codziennie',
          location: 'Bar',
          imageUrl: 'https://images.unsplash.com/photo-1626379481874-3dc5678fa8ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHN1cHBsaWVzfGVufDF8fHx8MTc2ODA3MDQ3OHww&ixlib=rb-4.1.0&q=80&w=1080',
          isImportant: true,
        },
        {
          name: 'Sprzątanie zmywaka',
          description: 'Umycie zmywaka, czyszczenie zlewu, wycieranie powierzchni',
          frequency: 'Co 2 dni',
          location: 'Zmywak',
          imageUrl: 'https://images.unsplash.com/photo-1567767326925-e2047bf469d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwY2xlYW58ZW58MXx8fHwxNzY4MTUxOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
          isImportant: false,
        },
        {
          name: 'Czyszczenie łazienki',
          description: 'Mycie toalet, czyszczenie umywalek, wycieranie luster, uzupełnianie papieru',
          frequency: 'Codziennie',
          location: 'Łazienka',
          imageUrl: 'https://images.unsplash.com/photo-1609879937493-56540300d8cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMGNsZWFufGVufDF8fHx8MTc2ODE1MTk1MHww&ixlib=rb-4.1.0&q=80&w=1080',
          isImportant: false,
        },
        {
          name: 'Sprzątanie biura',
          description: 'Odkurzanie, wycieranie biurek, opróżnianie koszy',
          frequency: 'Co tydzień',
          location: 'Biuro',
          imageUrl: 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY4MTUxOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
          isImportant: false,
        },
        {
          name: 'Sprzątanie sali',
          description: 'Odkurzanie podłogi, wycieranie stołów i krzeseł',
          frequency: 'Co 2 dni',
          location: 'Sala',
          isImportant: false,
        },
        {
          name: 'Porządki w zapleczu',
          description: 'Organizacja przestrzeni, wyrzucanie śmieci, czyszczenie regałów',
          frequency: 'Co 2 tygodnie',
          location: 'Zaplecze',
          isImportant: true,
        },
      ];

      await prisma.cleaningTask.createMany({
        data: defaultTasks,
      });
      console.log('✅ Default cleaning tasks created');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}
