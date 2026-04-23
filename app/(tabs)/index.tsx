import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebFooter } from '../../src/components/web/WebFooter';
import { theme } from '../../src/constants/theme';
import {
  CATEGORIAS_MOCK,
  PRODUTOS_MOCK,
  formatarPreco,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
  type Produto,
} from '../../src/data/mockData';

const isWeb = Platform.OS === 'web';

// ─── Tipos auxiliares ───
type StatusEstoque = 'normal' | 'baixo' | 'sem_estoque';

interface ResumoCard {
  id: string;
  titulo: string;
  valor: string;
  icone: keyof typeof Ionicons.glyphMap;
  corIcone: string;
  corFundo: string;
}

// ─── Helpers ───
function getStatusEstoque(produto: Produto): StatusEstoque {
  if (produto.quantidadeEstoque === 0) return 'sem_estoque';
  if (produto.quantidadeEstoque <= produto.estoqueMinimo) return 'baixo';
  return 'normal';
}

const STATUS_CONFIG: Record<
  StatusEstoque,
  { label: string; cor: string; fundo: string }
> = {
  normal: {
    label: 'Normal',
    cor: theme.colors.successText,
    fundo: theme.colors.successBackground,
  },
  baixo: {
    label: 'Baixo',
    cor: theme.colors.warningText,
    fundo: theme.colors.warningBackground,
  },
  sem_estoque: {
    label: 'Sem estoque',
    cor: theme.colors.error,
    fundo: theme.colors.errorBackground,
  },
};

function getCategoriaIcone(categoriaId: string): string {
  return (
    CATEGORIAS_MOCK.find((c) => c.id === categoriaId)?.icone ??
    'cube-outline'
  );
}

// ─── Dados derivados ───
const produtosRecentes = [...PRODUTOS_MOCK].sort(
  (a, b) =>
    new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
);

// ─── Componentes internos ───
function ProdutoCard({ produto }: { produto: Produto }) {
  const status = getStatusEstoque(produto);
  const config = STATUS_CONFIG[status];
  const icone = getCategoriaIcone(produto.categoriaId);

  return (
    <View style={styles.produtoCard}>
      <View style={styles.produtoIconeWrapper}>
        <Ionicons
          name={icone as keyof typeof Ionicons.glyphMap}
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome} numberOfLines={1}>
          {produto.nome}
        </Text>
        <Text style={styles.produtoQtd}>
          {produto.quantidadeEstoque} {produto.unidade}
        </Text>
      </View>

      <View style={[styles.badge, { backgroundColor: config.fundo }]}>
        <Text style={[styles.badgeText, { color: config.cor }]}>
          {config.label}
        </Text>
      </View>
    </View>
  );
}

interface AlertaEstoqueCriticoProps {
  produtos: Produto[];
  mostrarTodos: boolean;
  onToggle: () => void;
}

function AlertaEstoqueCritico({
  produtos,
  mostrarTodos,
  onToggle,
}: AlertaEstoqueCriticoProps) {
  if (produtos.length === 0) return null;

  const MAX_VISIVEIS = 3;
  const produtosVisiveis = mostrarTodos
    ? produtos
    : produtos.slice(0, MAX_VISIVEIS);
  const temMais = produtos.length > MAX_VISIVEIS;

  return (
    <View style={styles.alertaContainer}>
      <View style={styles.alertaHeader}>
        <Ionicons
          name="warning-outline"
          size={20}
          color={theme.colors.error}
        />
        <Text style={styles.alertaTitulo}>Estoque crítico</Text>
        <View style={styles.alertaContador}>
          <Text style={styles.alertaContadorText}>{produtos.length}</Text>
        </View>
      </View>

      {produtosVisiveis.map((p) => (
        <View key={p.id} style={styles.alertaItem}>
          <Text style={styles.alertaItemNome} numberOfLines={1}>
            {p.nome}
          </Text>
          <Text style={styles.alertaItemQtd}>
            {p.quantidadeEstoque} / {p.estoqueMinimo}
          </Text>
        </View>
      ))}

      {temMais && (
        <TouchableOpacity
          style={styles.alertaVerTodos}
          activeOpacity={0.7}
          onPress={onToggle}
        >
          <Text style={styles.alertaVerTodosText}>
            {mostrarTodos ? 'Ver menos ↑' : 'Ver todos →'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [mostrarTodosAlertas, setMostrarTodosAlertas] = useState(false);

  const produtosBaixoEstoque = useMemo(
    () => getProdutosComEstoqueBaixo(),
    [],
  );

  const totalEstoque = useMemo(
    () => getValorTotalEstoque(),
    [],
  );

  const resumoCards: ResumoCard[] = useMemo(
    () => [
      {
        id: 'card-produtos',
        titulo: 'Produtos',
        valor: String(PRODUTOS_MOCK.length),
        icone: 'cube-outline' as keyof typeof Ionicons.glyphMap,
        corIcone: theme.colors.primary,
        corFundo: theme.colors.primaryLight,
      },
      {
        id: 'card-alertas',
        titulo: 'Alertas',
        valor: String(produtosBaixoEstoque.length),
        icone: 'alert-circle-outline' as keyof typeof Ionicons.glyphMap,
        corIcone: theme.colors.error,
        corFundo: theme.colors.errorBackground,
      },
      {
        id: 'card-categorias',
        titulo: 'Categorias',
        valor: String(CATEGORIAS_MOCK.length),
        icone: 'grid-outline' as keyof typeof Ionicons.glyphMap,
        corIcone: theme.colors.accent,
        corFundo: theme.colors.accentLight,
      },
      {
        id: 'card-estoque',
        titulo: 'Em Estoque',
        valor: formatarPreco(totalEstoque),
        icone: 'cash-outline' as keyof typeof Ionicons.glyphMap,
        corIcone: theme.colors.warning,
        corFundo: theme.colors.warningBackground,
      },
    ],
    [produtosBaixoEstoque, totalEstoque],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const ListHeader = (
    <View style={styles.headerWrapper}>
      <View style={styles.greetingRow}>
        <View style={styles.greetingTexts}>
          <Text style={styles.greeting}>Olá, Pedro Mota 👋</Text>
          <Text style={styles.subtitle}>Visão geral do estoque</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.75}
          accessibilityLabel="Adicionar produto"
        >
          <Ionicons name="add" size={26} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsGrid}>
        {resumoCards.map((card) => (
          <View key={card.id} style={styles.resumoCard}>
            <View style={styles.resumoCardInner}>
              <View
                style={[
                  styles.resumoIconWrapper,
                  { backgroundColor: card.corFundo },
                ]}
              >
                <Ionicons
                  name={card.icone}
                  size={22}
                  color={card.corIcone}
                />
              </View>
              <Text style={styles.resumoValor}>{card.valor}</Text>
              <Text style={styles.resumoTitulo}>{card.titulo}</Text>
            </View>
          </View>
        ))}
      </View>

      <AlertaEstoqueCritico
        produtos={produtosBaixoEstoque}
        mostrarTodos={mostrarTodosAlertas}
        onToggle={() => setMostrarTodosAlertas(!mostrarTodosAlertas)}
      />

      <View style={styles.secaoHeader}>
        <Text style={styles.secaoTitulo}>Produtos recentes</Text>
        <Text style={styles.secaoContador}>
          {produtosRecentes.length} itens
        </Text>
      </View>
    </View>
  );

  // ── Render ───
  const renderItem = useCallback(
    ({ item }: { item: Produto }) => (
      <View style={styles.itemWrapper}>
        <ProdutoCard produto={item} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Produto) => item.id, []);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        style={{ flex: 1 }}
        data={produtosRecentes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          isWeb ? (
            <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
              <WebFooter />
            </View>
          ) : undefined
        }
        ListFooterComponentStyle={isWeb ? { flexGrow: 1 } : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={isWeb}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const CARD_GAP = 12;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: 0,
    flexGrow: 1,
  },
  itemWrapper: {
    maxWidth: 1024,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  headerWrapper: {
    marginBottom: 8,
    maxWidth: 1024,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingTexts: {
    flex: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(CARD_GAP / 2),
    marginBottom: 20,
  },
  resumoCard: {
    width: '50%',
    paddingHorizontal: CARD_GAP / 2,
    marginBottom: CARD_GAP,
  },
  resumoCardInner: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resumoIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resumoValor: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  resumoTitulo: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontWeight: '500',
    marginTop: 2,
  },
  alertaContainer: {
    backgroundColor: theme.colors.errorBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  alertaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertaTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.error,
    marginLeft: 6,
    flex: 1,
  },
  alertaContador: {
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  alertaContadorText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  alertaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 68, 68, 0.12)',
  },
  alertaItemNome: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  alertaItemQtd: {
    fontSize: 13,
    color: theme.colors.error,
    fontWeight: '700',
    marginLeft: 8,
  },
  alertaVerTodos: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  alertaVerTodosText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.error,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  secaoContador: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  produtoIconeWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  produtoInfo: {
    flex: 1,
    marginRight: 8,
  },
  produtoNome: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  produtoQtd: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
