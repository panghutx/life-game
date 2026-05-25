// src/api/achievements.ts
import api from './client';

export interface Achievement {
  key: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export const achievementsApi = {
  getAll: () => api.get<Achievement[]>('/achievements'),
};
