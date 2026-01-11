import { CleaningItem } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Info, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CleaningItemCardProps {
  item: CleaningItem;
  onInfoClick: (item: CleaningItem) => void;
  onItemClick: (item: CleaningItem) => void;
}

export function CleaningItemCard({ item, onInfoClick, onItemClick }: CleaningItemCardProps) {
  // Calculate urgency color
  const getUrgencyColor = (): string => {
    const now = new Date();
    const timeDiff = item.nextDue.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 0) {
      return 'border-red-500 bg-red-50'; // Overdue
    } else if (hoursDiff < 24) {
      return 'border-orange-500 bg-orange-50'; // Due within 24 hours
    } else if (hoursDiff < 72) {
      return 'border-yellow-500 bg-yellow-50'; // Due within 3 days
    } else {
      return 'border-green-500 bg-green-50'; // Future
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${getUrgencyColor()}`}
      onClick={() => onItemClick(item)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {item.image && (
            <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {item.isImportant && <Star className="w-5 h-5 fill-yellow-500 text-yellow-500 flex-shrink-0" />}
                <h3 className="font-semibold truncate">{item.name}</h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick(item);
                }}
                className="p-1 hover:bg-gray-200 rounded-full flex-shrink-0"
              >
                <Info className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary">{item.location}</Badge>
              {item.isCompleted && (
                <Badge className="bg-green-600">Wykonane</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
