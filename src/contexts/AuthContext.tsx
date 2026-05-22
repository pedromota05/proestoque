import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../services/api';

// ─── Tipos ───
export interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Storage keys ───
const STORAGE_KEYS = {
  TOKEN: '@proestoque:token',
  USER: '@proestoque:user',
} as const;

// ─── Context ───
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ───
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão ao montar
  useEffect(() => {
    async function restoreSession() {
      try {
        const [results] = await Promise.all([
          AsyncStorage.multiGet([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);

        const storedToken = results[0][1];
        const storedUser = results[1][1];

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Função auxiliar para persistir sessão
  const persistSession = useCallback(async (userData: User, tokenValue: string) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, tokenValue],
      [STORAGE_KEYS.USER, JSON.stringify(userData)],
    ]);
    setToken(tokenValue);
    setUser(userData);
  }, []);

  // Login real via API
  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token: jwtToken } = response.data;

      await persistSession(usuario, jwtToken);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Não foi possível realizar o login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [persistSession]);

  // Registro real via API
  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/registro', { nome, email, senha });
      const { usuario, token: jwtToken } = response.data;

      await persistSession(usuario, jwtToken);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Não foi possível criar a conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [persistSession]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      registrar,
      logout,
    }),
    [user, token, isLoading, login, registrar, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook customizado ───
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
