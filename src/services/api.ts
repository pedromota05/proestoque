import axios from 'axios';
import { Platform } from 'react-native';

// O localhost funciona na Web e no iOS Simulator, mas falha no Android Emulator.
// Substitua o IP abaixo pelo IP da sua máquina na rede local!
const IP_MAQUINA = '192.168.1.107';
const BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:3333/api'
  : `http://${IP_MAQUINA}:3333/api`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
