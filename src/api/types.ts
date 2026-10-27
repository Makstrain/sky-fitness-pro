// src/api/types.ts

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  // добавь остальные поля, когда увидим API
}

export interface User {
  id: number;
  login: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  login: string;
  password: string;
  email?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
