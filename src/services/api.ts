import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

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
    const token = await AsyncStorage.getItem('@proestoque:token');

    // [DEBUG] Remover após confirmar que o token está sendo lido corretamente
    console.log('Token injetado:', token);

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ───
// Captura erros globais; rejeita 401 para tratamento no AuthContext
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido — propaga para tratamento superior
      console.warn('Token expirado ou inválido (401).');
    }
    return Promise.reject(error);
  },
);
