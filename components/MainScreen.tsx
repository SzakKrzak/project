import { useState, useMemo } from 'react';
import { CleaningItem } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { CleaningItemCard } from './CleaningItemCard';
import { NotificationsPanel } from './NotificationsPanel';
import { LogOut, Settings, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface MainScreenProps {
  userName: string;
  items: CleaningItem[];
  onLogout: () => void;
  onManagementPanel: () => void;
  onInfoClick: (item: CleaningItem) => void;
  onItemClick: (item: CleaningItem) => void;
  loading?: boolean;
}

type SortOption = 'name' | 'frequency' | 'location' | 'dueDate';

export function MainScreen({
  userName,
  items,
  onLogout,
  onManagementPanel,
  onInfoClick,
  onItemClick,
  loading = false,
}: MainScreenProps) {
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  // Filter items by tab
  const importantItems = useMemo(() => 
    items.filter(item => item.isImportant && !item.isCompleted),
    [items]
  );

  const toCleanItems = useMemo(() =>
    items.filter(item => !item.isCompleted),
    [items]
  );

  const cleanedItems = useMemo(() =>
    items.filter(item => item.isCompleted),
    [items]
  );

  // Sort function
  const sortItems = (itemsToSort: CleaningItem[]): CleaningItem[] => {
    return [...itemsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'frequency':
          const frequencyOrder = ['Codziennie', 'Co 2 dni', 'Co tydzień', 'Co 2 tygodnie', 'Co miesiąc'];
          return frequencyOrder.indexOf(a.frequency) - frequencyOrder.indexOf(b.frequency);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'dueDate':
          return a.nextDue.getTime() - b.nextDue.getTime();
        default:
          return 0;
      }
    });
  };

  const renderItemList = (itemsList: CleaningItem[]) => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-500">Ładowanie zadań...</p>
        </div>
      );
    }

    const sorted = sortItems(itemsList);
    
    if (sorted.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          Brak zadań w tej kategorii
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sorted.map(item => (
          <CleaningItemCard
            key={item.id}
            item={item}
            onInfoClick={onInfoClick}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">posprzataj.se</h1>
              <p className="text-sm text-gray-600">Witaj, {userName}</p>
            </div>
            <div className="flex gap-2">
              <NotificationsPanel />
              <Button variant="outline" onClick={onManagementPanel}>
                <Settings className="w-4 h-4 mr-2" />
                Panel
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Wyjdź
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Sort Controls */}
        <div className="mb-4 flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm">
          <ArrowUpDown className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium">Sortuj po:</span>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Termin</SelectItem>
              <SelectItem value="name">Nazwa</SelectItem>
              <SelectItem value="frequency">Częstotliwość</SelectItem>
              <SelectItem value="location">Lokalizacja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="toclean" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="important">
              Ważne {importantItems.length > 0 && `(${importantItems.length})`}
            </TabsTrigger>
            <TabsTrigger value="toclean">
              Do posprzątania {toCleanItems.length > 0 && `(${toCleanItems.length})`}
            </TabsTrigger>
            <TabsTrigger value="cleaned">
              Posprzątane {cleanedItems.length > 0 && `(${cleanedItems.length})`}
            </TabsTrigger>
            <TabsTrigger value="all">
              Wszystkie ({items.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="important">
            {renderItemList(importantItems)}
          </TabsContent>

          <TabsContent value="toclean">
            {renderItemList(toCleanItems)}
          </TabsContent>

          <TabsContent value="cleaned">
            {renderItemList(cleanedItems)}
          </TabsContent>

          <TabsContent value="all">
            {renderItemList(items)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
