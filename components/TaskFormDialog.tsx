import { useState, useEffect } from 'react';
import { CleaningItem, Location, Frequency } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { calculateNextDueDate } from '../utils/dateUtils';

interface TaskFormDialogProps {
  item: CleaningItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: CleaningItem) => void;
}

const LOCATIONS: Location[] = ['Bar', 'Zaplecze', 'Biuro', 'Produkcja', 'Sala', 'Łazienka', 'Zmywak', 'Inne'];
const FREQUENCIES: Frequency[] = ['Codziennie', 'Co 2 dni', 'Co tydzień', 'Co 2 tygodnie', 'Co miesiąc'];

export function TaskFormDialog({ item, open, onOpenChange, onSave }: TaskFormDialogProps) {
  const [formData, setFormData] = useState<Partial<CleaningItem>>({
    name: '',
    description: '',
    frequency: 'Codziennie',
    location: 'Bar',
    image: '',
    isImportant: false,
    isCompleted: false,
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        description: '',
        frequency: 'Codziennie',
        location: 'Bar',
        image: '',
        isImportant: false,
        isCompleted: false,
      });
    }
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: CleaningItem = {
      id: item?.id || `task-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      frequency: formData.frequency as Frequency,
      location: formData.location as Location,
      image: formData.image,
      isImportant: formData.isImportant || false,
      isCompleted: formData.isCompleted || false,
      lastCompleted: item?.lastCompleted,
      nextDue: item?.nextDue || calculateNextDueDate(formData.frequency as Frequency),
      completionImage: item?.completionImage,
    };

    onSave(newItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edytuj zadanie' : 'Dodaj nowe zadanie'}</DialogTitle>
          <DialogDescription>
            {item ? 'Zaktualizuj informacje o zadaniu sprzątania' : 'Utwórz nowe zadanie sprzątania'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nazwa zadania*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="np. Wycieranie baru"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Szczegółowy opis zadania sprzątania"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lokalizacja*</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value as Location })}
                >
                  <SelectTrigger id="location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Częstotliwość*</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as Frequency })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL zdjęcia (opcjonalnie)</Label>
              <Input
                id="image"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="important"
                checked={formData.isImportant}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isImportant: checked as boolean })
                }
              />
              <Label htmlFor="important" className="cursor-pointer">
                Oznacz jako ważne
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit">
              {item ? 'Zapisz zmiany' : 'Dodaj zadanie'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
