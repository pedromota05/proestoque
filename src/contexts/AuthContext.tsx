import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

  // Login simulado
  const login = useCallback(async (email: string, _senha: string) => {
    setIsLoading(true);
    try {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      const fakeToken = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const nome = email.split('@')[0];
      const fakeUser: User = {
        id: String(Date.now()),
        nome,
        email,
      };

      // Salvar em paralelo no disco
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, fakeToken],
        [STORAGE_KEYS.USER, JSON.stringify(fakeUser)],
      ]);

      setToken(fakeToken);
      setUser(fakeUser);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      logout,
    }),
    [user, token, isLoading, login, logout],
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
