import { CleaningItem } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, MapPin, Clock, Star } from 'lucide-react';

interface ItemInfoDialogProps {
  item: CleaningItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemInfoDialog({ item, open, onOpenChange }: ItemInfoDialogProps) {
  if (!item) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDueStatus = () => {
    const now = new Date();
    const timeDiff = item.nextDue.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 0) {
      const hoursOverdue = Math.abs(Math.floor(hoursDiff));
      return {
        text: `Zaległe o ${hoursOverdue} godz.`,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      };
    } else if (hoursDiff < 24) {
      return {
        text: `Do wykonania dzisiaj`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
      };
    } else if (hoursDiff < 72) {
      return {
        text: `Do wykonania wkrótce`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
      };
    } else {
      const daysLeft = Math.floor(hoursDiff / 24);
      return {
        text: `Za ${daysLeft} dni`,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      };
    }
  };

  const dueStatus = getDueStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {item.isImportant && (
              <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
            )}
            <DialogTitle className="text-2xl">{item.name}</DialogTitle>
          </div>
          <DialogDescription>Szczegóły zadania sprzątania</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {item.image && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status Badge */}
          {!item.isCompleted && (
            <div className={`px-4 py-2 rounded-lg ${dueStatus.bgColor}`}>
              <p className={`${dueStatus.color} font-medium`}>{dueStatus.text}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Opis</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Lokalizacja</p>
                <p className="font-medium">{item.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Częstotliwość</p>
                <p className="font-medium">{item.frequency}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Następne sprzątanie</p>
                <p className="font-medium">{formatDate(item.nextDue)}</p>
              </div>
            </div>

            {item.lastCompleted && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Ostatnio wykonane</p>
                  <p className="font-medium">{formatDate(item.lastCompleted)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="flex gap-2">
              {item.isCompleted ? (
                <Badge className="bg-green-600">Wykonane</Badge>
              ) : (
                <Badge variant="secondary">Do wykonania</Badge>
              )}
              {item.isImportant && (
                <Badge className="bg-yellow-500">Ważne</Badge>
              )}
            </div>
          </div>

          {/* Completion Image */}
          {item.completionImage && (
            <div>
              <h3 className="font-semibold mb-2">Zdjęcie wykonanego sprzątania</h3>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={item.completionImage}
                  alt={`${item.name} - wykonane`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
