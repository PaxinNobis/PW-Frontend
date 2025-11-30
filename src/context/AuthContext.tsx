// context/AuthContext.tsx
// Contexto global para gestionar el estado de autenticación en toda la app

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User, LoginCredentials, SignupData } from '../types/auth';
import { loginUser, signupUser, logoutUser, getCurrentUser, fetchCurrentUser } from '../services/auth.service';

/**
 * Contexto de autenticación
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props del proveedor
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación
 * Envuelve la aplicación y provee el estado de autenticación a todos los componentes
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Al montar el componente, verificar si hay una sesión activa
   */
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  /**
   * Función para iniciar sesión
   */
  /**
   * Función para iniciar sesión
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      const loggedUser = await loginUser(credentials);
      setUser(loggedUser);
    } catch (error) {
      // Re-lanzar el error para que el componente lo maneje
      throw error;
    }
  }, []);

  /**
   * Función para registrarse
   */
  const signup = useCallback(async (data: SignupData): Promise<void> => {
    try {
      const newUser = await signupUser(data);
      setUser(newUser);
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Función para cerrar sesión
   */
  const logout = useCallback((): void => {
    logoutUser();
    setUser(null);
  }, []);

  /**
   * Función para actualizar el usuario actual (por ejemplo, al cambiar de rol)
   */
  const updateUser = useCallback((updatedUser: User): void => {
    setUser(updatedUser);
    // Guardar en localStorage
    localStorage.setItem('streaming_user', JSON.stringify(updatedUser));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const updatedUser = await fetchCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser
  }), [user, loading, login, signup, logout, updateUser, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * Asegura que el contexto se use dentro de un AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};
