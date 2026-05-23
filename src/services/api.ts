import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  TOKEN: '@proestoque:token',
  REFRESH_TOKEN: '@proestoque:refreshToken',
  USER: '@proestoque:user',
} as const;

// O localhost funciona na Web e no iOS Simulator, mas falha no Android Emulator.
// No Android Emulator, 10.0.2.2 é o alias para o localhost da máquina host.
// Para dispositivo físico, use o IP real da máquina na rede local.
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3333/api';
  }
  if (Platform.OS === 'android') {
    // 10.0.2.2 é o alias do Android Emulator para o localhost do host
    return 'http://10.0.2.2:3333/api';
  }
  // iOS Simulator pode usar localhost diretamente
  return 'http://localhost:3333/api';
};

const BASE_URL = getBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ───
// Anexa o token JWT em todas as requisições autenticadas
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ───
// Captura erros globais; gerencia Refresh Token para erros 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e a requisição original não for uma tentativa de login ou refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true; // Flag para evitar loop infinito

      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          throw new Error('Refresh token não encontrado');
        }

        // Tenta fazer o refresh chamando diretamente o axios genérico (sem interceptors para não gerar loops)
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        // Salva os novos tokens no storage
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.TOKEN, newToken],
          [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
        ]);

        // Atualiza o header da requisição original que falhou e a re-executa
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar o refresh, limpa a sessão (força o logout)
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.USER,
        ]);

        console.warn('Sessão expirada. O usuário foi deslogado.');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
