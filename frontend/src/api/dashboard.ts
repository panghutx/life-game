// src/api/dashboard.ts
import api from './client';
import { Task } from './tasks';
import { Habit } from './habits';

export interface DashboardData {
  user: {
    id: string;
    username: string;
    level: number;
    total_xp: number;
    current_streak: number;
    longest_streak: number;
  };
  xp_progress: number;
  xp_needed: number;
  xp_percentage: number;
  today_tasks: Task[];
  habits: Habit[];
  recent_achievements: Array<{ achievement_key: string; unlocked_at: string }>;
}

export const dashboardApi = {
  get: () => api.get<DashboardData>('/dashboard'),
};
