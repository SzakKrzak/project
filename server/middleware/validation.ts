import { Request, Response, NextFunction } from 'express';

export function validateTask(req: Request, res: Response, next: NextFunction) {
  const { name, description, frequency, location } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Nazwa zadania jest wymagana' });
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ error: 'Opis zadania jest wymagany' });
  }

  const validFrequencies = ['Codziennie', 'Co 2 dni', 'Co tydzień', 'Co 2 tygodnie', 'Co miesiąc'];
  if (!frequency || !validFrequencies.includes(frequency)) {
    return res.status(400).json({ error: 'Nieprawidłowa częstotliwość' });
  }

  const validLocations = ['Bar', 'Zaplecze', 'Biuro', 'Produkcja', 'Sala', 'Łazienka', 'Zmywak', 'Inne'];
  if (!location || !validLocations.includes(location)) {
    return res.status(400).json({ error: 'Nieprawidłowa lokalizacja' });
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { apartmentNumber, password } = req.body;

  if (!apartmentNumber || typeof apartmentNumber !== 'string') {
    return res.status(400).json({ error: 'Numer lokalu jest wymagany' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków' });
  }

  next();
}

export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const { name, apartmentNumber, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Imię jest wymagane' });
  }

  if (!apartmentNumber || typeof apartmentNumber !== 'string') {
    return res.status(400).json({ error: 'Numer lokalu jest wymagany' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków' });
  }

  next();
}
