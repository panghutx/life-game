// src/api/tasks.ts
import api from './client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  xp_reward: number;
  due_date?: string;
  repeat_rule: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export const tasksApi = {
  getAll: () => api.get<Task[]>('/tasks'),
  create: (data: Partial<Task>) => api.post<Task>('/tasks', data),
  update: (id: string, data: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  complete: (id: string) => api.post(`/tasks/${id}/complete`),
};
