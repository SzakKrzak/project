import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MainScreen } from './components/MainScreen';
import { ManagementScreen } from './components/ManagementScreen';
import { ItemInfoDialog } from './components/ItemInfoDialog';
import { CompleteTaskDialog } from './components/CompleteTaskDialog';
import { ManagementPasswordDialog } from './components/ManagementPasswordDialog';
import { TaskFormDialog } from './components/TaskFormDialog';
import { CleaningItem } from './types';
import { api } from './utils/api';

interface User {
  id: string;
  name: string;
  apartmentNumber: string;
  isManager: boolean;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cleaningItems, setCleaningItems] = useState<CleaningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showManagement, setShowManagement] = useState(false);
  const [selectedInfoItem, setSelectedInfoItem] = useState<CleaningItem | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [selectedCompleteItem, setSelectedCompleteItem] = useState<CleaningItem | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<CleaningItem | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.getCurrentUser();
        setUser(response.user);
        setIsLoggedIn(true);
        await loadTasks();
      } catch (error) {
        // Not logged in
        api.logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Load tasks
  const loadTasks = async () => {
    try {
      setError(null);
      const tasks = await api.getTasks();
      setCleaningItems(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd ładowania zadań');
      console.error('Error loading tasks:', err);
    }
  };

  // Reload tasks when needed
  useEffect(() => {
    if (isLoggedIn) {
      loadTasks();
    }
  }, [isLoggedIn]);

  const handleLogin = async (_name: string, apartmentNumber: string, password: string) => {
    try {
      setError(null);
      const response = await api.login(apartmentNumber, password);
      setUser(response.user);
      setIsLoggedIn(true);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd logowania');
      throw err;
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setUser(null);
    setCleaningItems([]);
    setShowManagement(false);
  };

  const handleManagementPanel = () => {
    if (user?.isManager) {
      setShowManagement(true);
    } else {
      setShowPasswordDialog(true);
    }
  };

  const handlePasswordSuccess = async (password: string) => {
    try {
      await api.verifyManager(password);
      setShowManagement(true);
    } catch (err) {
      throw err;
    }
  };

  const handleBackFromManagement = () => {
    setShowManagement(false);
  };

  const handleInfoClick = (item: CleaningItem) => {
    setSelectedInfoItem(item);
    setShowInfoDialog(true);
  };

  const handleItemClick = (item: CleaningItem) => {
    if (!item.isCompleted) {
      setSelectedCompleteItem(item);
      setShowCompleteDialog(true);
    }
  };

  const handleCompleteTask = async (itemId: string, completionImage: string) => {
    try {
      setError(null);
      await api.completeTask(itemId, completionImage);
      await loadTasks();
      setShowCompleteDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd oznaczania zadania jako wykonane');
      throw err;
    }
  };

  const handleAddItem = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditItem = (item: CleaningItem) => {
    setEditingTask(item);
    setShowTaskForm(true);
  };

  const handleSaveTask = async (item: CleaningItem) => {
    try {
      setError(null);
      if (editingTask) {
        await api.updateTask(item.id, {
          name: item.name,
          description: item.description,
          frequency: item.frequency,
          location: item.location,
          image: item.image,
          isImportant: item.isImportant,
        });
      } else {
        await api.createTask({
          name: item.name,
          description: item.description,
          frequency: item.frequency,
          location: item.location,
          image: item.image,
          isImportant: item.isImportant,
        });
      }
      setEditingTask(null);
      setShowTaskForm(false);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd zapisywania zadania');
      throw err;
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      setError(null);
      await api.deleteTask(itemId);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd usuwania zadania');
      throw err;
    }
  };

  const handleToggleImportant = async (itemId: string) => {
    try {
      setError(null);
      await api.toggleImportant(itemId);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd zmiany statusu ważności');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} error={error} />;
  }

  if (showManagement) {
    return (
      <>
        <ManagementScreen
          items={cleaningItems}
          onBack={handleBackFromManagement}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onToggleImportant={handleToggleImportant}
        />
        <TaskFormDialog
          item={editingTask}
          open={showTaskForm}
          onOpenChange={setShowTaskForm}
          onSave={handleSaveTask}
        />
      </>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              ×
            </button>
          </div>
        </div>
      )}
      <MainScreen
        userName={user?.name || ''}
        items={cleaningItems}
        onLogout={handleLogout}
        onManagementPanel={handleManagementPanel}
        onInfoClick={handleInfoClick}
        onItemClick={handleItemClick}
        loading={cleaningItems.length === 0 && !error}
      />
      <ItemInfoDialog
        item={selectedInfoItem}
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
      />
      <CompleteTaskDialog
        item={selectedCompleteItem}
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        onComplete={handleCompleteTask}
      />
      <ManagementPasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSuccess={handlePasswordSuccess}
      />
    </>
  );
}