// src/api/habits.ts
import api from './client';

export interface Habit {
  id: string;
  name: string;
  xp_reward: number;
  current_streak: number;
  longest_streak: number;
  last_check_in?: string;
  created_at: string;
}

export const habitsApi = {
  getAll: () => api.get<Habit[]>('/habits'),
  create: (data: Partial<Habit>) => api.post<Habit>('/habits', data),
  update: (id: string, data: Partial<Habit>) => api.patch<Habit>(`/habits/${id}`, data),
  delete: (id: string) => api.delete(`/habits/${id}`),
  checkin: (id: string) => api.post(`/habits/${id}/checkin`),
};
