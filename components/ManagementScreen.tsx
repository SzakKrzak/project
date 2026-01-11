import { useState } from 'react';
import { CleaningItem } from '../types';
import { Button } from './ui/button';
import { ArrowLeft, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ManagementScreenProps {
  items: CleaningItem[];
  onBack: () => void;
  onAddItem: () => void;
  onEditItem: (item: CleaningItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleImportant: (itemId: string) => void;
}

export function ManagementScreen({
  items,
  onBack,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleImportant,
}: ManagementScreenProps) {
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<CleaningItem | null>(null);

  const handleDeleteClick = (item: CleaningItem) => {
    setDeleteConfirmItem(item);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmItem) {
      onDeleteItem(deleteConfirmItem.id);
      setDeleteConfirmItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
              <div>
                <h1 className="text-2xl">Panel zarządzania</h1>
                <p className="text-sm text-gray-600">Zarządzaj zadaniami sprzątania</p>
              </div>
            </div>
            <Button onClick={onAddItem}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj zadanie
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Brak zadań. Dodaj pierwsze zadanie sprzątania.
            </div>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
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
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {item.isImportant && (
                            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                          )}
                          <h3 className="font-semibold truncate">{item.name}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <Badge variant="secondary">{item.location}</Badge>
                        <Badge variant="outline">{item.frequency}</Badge>
                        {item.isCompleted && (
                          <Badge className="bg-green-600">Wykonane</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onToggleImportant(item.id)}
                        >
                          <Star
                            className={`w-4 h-4 mr-1 ${
                              item.isImportant ? 'fill-yellow-500 text-yellow-500' : ''
                            }`}
                          />
                          {item.isImportant ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditItem(item)}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edytuj
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Usuń
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && setDeleteConfirmItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć to zadanie?</AlertDialogTitle>
            <AlertDialogDescription>
              Zadanie "{deleteConfirmItem?.name}" zostanie trwale usunięte. Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
