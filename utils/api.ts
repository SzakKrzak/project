const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiError {
  error: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: 'Wystąpił błąd',
        }));
        throw new Error(error.error || 'Wystąpił błąd');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Wystąpił nieoczekiwany błąd');
    }
  }

  // Auth
  async login(apartmentNumber: string, password: string) {
    const response = await this.request<{ user: any; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ apartmentNumber, password }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async register(name: string, apartmentNumber: string, password: string) {
    const response = await this.request<{ user: any; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, apartmentNumber, password }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async verifyManager(password: string) {
    return this.request<{ verified: boolean }>('/auth/verify-manager', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Tasks
  async getTasks(params?: { includeCompleted?: string; location?: string; frequency?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const tasks = await this.request<any[]>(`/tasks${query ? `?${query}` : ''}`);
    // Convert date strings to Date objects
    return tasks.map(task => ({
      ...task,
      lastCompleted: task.lastCompleted ? new Date(task.lastCompleted) : undefined,
      nextDue: new Date(task.nextDue),
    }));
  }

  async getTask(id: string) {
    const task = await this.request<any>(`/tasks/${id}`);
    // Convert date strings to Date objects
    return {
      ...task,
      lastCompleted: task.lastCompleted ? new Date(task.lastCompleted) : undefined,
      nextDue: new Date(task.nextDue),
      history: task.history?.map((h: any) => ({
        ...h,
        completedAt: new Date(h.completedAt),
      })),
    };
  }

  async createTask(task: any) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: any) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string) {
    return this.request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async completeTask(id: string, completionImage: string, notes?: string) {
    return this.request<any>(`/tasks/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ completionImage, notes }),
    });
  }

  async toggleImportant(id: string) {
    return this.request<{ isImportant: boolean }>(`/tasks/${id}/important`, {
      method: 'PATCH',
    });
  }

  // Upload
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const url = `${this.baseUrl}/upload/image`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Błąd przesyłania pliku',
      }));
      throw new Error(error.error || 'Błąd przesyłania pliku');
    }

    return await response.json();
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request<{ message: string }>('/notifications/read-all', {
      method: 'PATCH',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
