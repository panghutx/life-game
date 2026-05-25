// src/api/auth.ts
import api from './client';

export interface User {
  id: string;
  username: string;
  level: number;
  total_xp: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, password }),

  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),
};