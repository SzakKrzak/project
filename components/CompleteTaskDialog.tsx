import { useState } from 'react';
import { CleaningItem } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Upload, X } from 'lucide-react';
import { api } from '../utils/api';

interface CompleteTaskDialogProps {
  item: CleaningItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (itemId: string, completionImage: string) => Promise<void>;
}

export function CompleteTaskDialog({ 
  item, 
  open, 
  onOpenChange,
  onComplete 
}: CompleteTaskDialogProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  if (!item) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Plik jest zbyt duży. Maksymalny rozmiar to 10MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Tylko pliki obrazów są dozwolone.');
        return;
      }

      try {
        setUploading(true);
        setError('');
        const response = await api.uploadImage(file);
        setUploadedImage(response.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Błąd przesyłania pliku');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleComplete = async () => {
    if (uploadedImage) {
      try {
        setError('');
        await onComplete(item.id, uploadedImage);
        setUploadedImage(null);
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Błąd oznaczania zadania jako wykonane');
      }
    }
  };

  const handleCancel = () => {
    setUploadedImage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Wykonaj sprzątanie</DialogTitle>
          <DialogDescription>
            {item.name} - dodaj zdjęcie posprzątanej rzeczy
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div>
            <Label htmlFor="completion-image">Zdjęcie wykonanego sprzątania</Label>
            {!uploadedImage ? (
              <label
                htmlFor="completion-image"
                className="mt-2 flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Kliknij aby dodać zdjęcie</span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (max. 10MB)</p>
                </div>
                <input
                  id="completion-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="mt-2 relative">
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={uploadedImage}
                    alt="Zdjęcie wykonanego sprzątania"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-900">
              Po dodaniu zdjęcia, zadanie zostanie oznaczone jako wykonane, a cykl częstotliwości zostanie zresetowany.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={uploading}>
            Anuluj
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={!uploadedImage || uploading}
            className="bg-green-600 hover:bg-green-700"
          >
            {uploading ? 'Przesyłanie...' : 'Zatwierdź wykonanie'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
