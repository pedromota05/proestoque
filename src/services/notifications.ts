import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Produto } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissaoNotificacoes() {
  if (Platform.OS === 'web') return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

export async function notificarEstoqueCritico(produtos: Produto[]) {
  if (Platform.OS === 'web' || produtos.length === 0) return;

  const temPermissao = await solicitarPermissaoNotificacoes();
  if (!temPermissao) return;

  const maxNotificacoes = 3;
  const produtosNotificar = produtos.slice(0, maxNotificacoes);
  const excedente = produtos.length - maxNotificacoes;

  // Cancela notificações anteriores de estoque para evitar duplicidade (opcional)
  // await Notifications.cancelAllScheduledNotificationsAsync();

  for (const produto of produtosNotificar) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Estoque Crítico!',
        body: `O produto "${produto.nome}" está abaixo do mínimo. Restam apenas ${produto.quantidade} ${produto.unidade}.`,
        data: { produtoId: produto.id },
      },
      trigger: null, // Notificação imediata
    });
  }

  if (excedente > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📦 Vários produtos em baixa!',
        body: `Existem mais ${excedente} produto(s) com estoque abaixo do mínimo. Verifique o painel.`,
      },
      trigger: null,
    });
  }
}

export async function agendarVerificacaoDiaria() {
  if (Platform.OS === 'web') return;

  const temPermissao = await solicitarPermissaoNotificacoes();
  if (!temPermissao) return;

  // Limpar agendamentos anteriores para não duplicar (opcional)
  // Mas cuidado para não cancelar outras notificações. Vamos agendar de forma simples.
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bom dia! 📋',
      body: 'Hora de verificar o painel e os alertas de estoque do dia.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}
