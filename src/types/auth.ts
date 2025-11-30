// Tipos para autenticación
export type UserRole = 'viewer' | 'streamer';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  level?: number;
  points?: number;
  coins?: number;
  pfp?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
