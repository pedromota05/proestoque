import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebFooter } from '../../src/components/web/WebFooter';
import { LoadingView } from '../../src/components/LoadingView';
import { ProdutoListaSkeleton } from '../../src/components/ProdutoSkeleton';
import { ErrorView } from '../../src/components/ErrorView';
import { useTheme } from '../../src/contexts/ThemeContext';
import { ThemeColors } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { useProducts } from '../../src/contexts/ProductsContext';
import { useCategorias } from '../../src/hooks/useCategorias';
import {
  formatarPreco,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
} from '../../src/utils/helpers';
import type { Produto, Categoria } from '../../src/types';

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
  if (produto.quantidade === 0) return 'sem_estoque';
  if (produto.quantidade <= produto.quantidadeMinima) return 'baixo';
  return 'normal';
}

function getStatusConfig(status: StatusEstoque, colors: ThemeColors) {
  const configs: Record<StatusEstoque, { label: string; cor: string; fundo: string }> = {
    normal: {
      label: 'Normal',
      cor: colors.successText,
      fundo: colors.successBackground,
    },
    baixo: {
      label: 'Baixo',
      cor: colors.warningText,
      fundo: colors.warningBackground,
    },
    sem_estoque: {
      label: 'Sem estoque',
      cor: colors.error,
      fundo: colors.errorBackground,
    },
  };
  return configs[status];
}

function getCategoriaIcone(categoriaId: string, categorias: Categoria[]): string {
  return categorias.find((c) => c.id === categoriaId)?.icone ?? 'cube-outline';
}

// ─── Componentes internos ───
function ProdutoCard({ produto, categorias }: { produto: Produto; categorias: Categoria[] }) {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  const status = getStatusEstoque(produto);
  const config = getStatusConfig(status, colors);
  const icone = getCategoriaIcone(produto.categoriaId, categorias);

  return (
    <View style={s.produtoCard}>
      <View style={s.produtoIconeWrapper}>
        <Ionicons
          name={icone as keyof typeof Ionicons.glyphMap}
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={s.produtoInfo}>
        <Text style={s.produtoNome} numberOfLines={1}>
          {produto.nome}
        </Text>
        <Text style={s.produtoQtd}>
          {produto.quantidade} {produto.unidade}
        </Text>
      </View>

      <View style={[s.badge, { backgroundColor: config.fundo }]}>
        <Text style={[s.badgeText, { color: config.cor }]}>
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
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);

  if (produtos.length === 0) return null;

  const MAX_VISIVEIS = 3;
  const produtosVisiveis = mostrarTodos
    ? produtos
    : produtos.slice(0, MAX_VISIVEIS);
  const temMais = produtos.length > MAX_VISIVEIS;

  return (
    <View style={s.alertaContainer}>
      <View style={s.alertaHeader}>
        <Ionicons
          name="warning-outline"
          size={20}
          color={colors.error}
        />
        <Text style={s.alertaTitulo}>Estoque crítico</Text>
        <View style={s.alertaContador}>
          <Text style={s.alertaContadorText}>{produtos.length}</Text>
        </View>
      </View>

      {produtosVisiveis.map((p) => (
        <View key={p.id} style={s.alertaItem}>
          <Text style={s.alertaItemNome} numberOfLines={1}>
            {p.nome}
          </Text>
          <Text style={s.alertaItemQtd}>
            {p.quantidade} / {p.quantidadeMinima}
          </Text>
        </View>
      ))}

      {temMais && (
        <TouchableOpacity
          style={s.alertaVerTodos}
          activeOpacity={0.7}
          onPress={onToggle}
        >
          <Text style={s.alertaVerTodosText}>
            {mostrarTodos ? 'Ver menos ↑' : 'Ver todos →'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  const { produtos, recarregar, isLoading, error } = useProducts();
  const { categorias, isLoading: isLoadingCategorias, recarregar: recarregarCategorias } = useCategorias();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [refreshing, setRefreshing] = useState(false);
  const [mostrarTodosAlertas, setMostrarTodosAlertas] = useState(false);

  const nomeFormatado = user?.nome ? user.nome.charAt(0).toUpperCase() + user.nome.slice(1) : '';

  const saudacao = useMemo(() => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const produtosRecentes = useMemo(
    () =>
      [...produtos].sort(
        (a, b) =>
          new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
      ),
    [produtos],
  );

  const produtosBaixoEstoque = useMemo(
    () => getProdutosComEstoqueBaixo(produtos),
    [produtos],
  );

  const totalEstoque = useMemo(
    () => getValorTotalEstoque(produtos),
    [produtos],
  );

  const resumoCards: ResumoCard[] = useMemo(
    () => [
      {
        id: 'card-produtos',
        titulo: 'Produtos',
        valor: String(produtos.length),
        icone: 'cube-outline' as keyof typeof Ionicons.glyphMap,
        corIcone: colors.primary,
        corFundo: colors.primaryLight,
      },
      {
        id: 'card-alertas',
        titulo: 'Alertas',
        valor: String(produtosBaixoEstoque.length),
        icone: 'alert-circle-outline' as keyof typeof Ionicons.glyphMap,
        corIcone: colors.error,
        corFundo: colors.errorBackground,
      },
      {
        id: 'card-categorias',
        titulo: 'Categorias',
        valor: String(categorias.length),
        icone: 'grid-outline' as keyof typeof Ionicons.glyphMap,
        corIcone: colors.accent,
        corFundo: colors.accentLight,
      },
      {
        id: 'card-estoque',
        titulo: 'Em Estoque',
        valor: formatarPreco(totalEstoque),
        icone: 'cash-outline' as keyof typeof Ionicons.glyphMap,
        corIcone: colors.warning,
        corFundo: colors.warningBackground,
      },
    ],
    [produtosBaixoEstoque, totalEstoque, produtos.length, categorias.length, colors],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([recarregar(), recarregarCategorias()]);
    } finally {
      setRefreshing(false);
    }
  }, [recarregar, recarregarCategorias]);

  const handleRetry = () => {
    recarregar();
    recarregarCategorias();
  };

  const ListHeader = (
    <View style={s.headerWrapper}>
      {isDesktop ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <Text style={s.greeting}>
              {saudacao}, {nomeFormatado} 👋
            </Text>
            <Text style={s.subtitle}>Visão geral do estoque</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {user?.nome?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              style={s.addButton}
              activeOpacity={0.75}
              accessibilityLabel="Adicionar produto"
              onPress={() => router.push('/produtos/novo' as any)}
            >
              <Ionicons name="add" size={26} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={s.greetingRow}>
            <View style={s.greetingTexts}>
              <Text 
                style={[s.greeting, { fontSize: 22, lineHeight: 30 }]} 
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {saudacao}, {nomeFormatado} 👋
              </Text>
            </View>

            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {user?.nome?.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 24 }}>
            <Text style={s.subtitle}>Visão geral do estoque</Text>

            <TouchableOpacity
              style={s.addButton}
              activeOpacity={0.75}
              accessibilityLabel="Adicionar produto"
              onPress={() => router.push('/produtos/novo' as any)}
            >
              <Ionicons name="add" size={26} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={s.cardsGrid}>
        {resumoCards.map((card) => (
          <View key={card.id} style={s.resumoCard}>
            <View style={s.resumoCardInner}>
              <View
                style={[
                  s.resumoIconWrapper,
                  { backgroundColor: card.corFundo },
                ]}
              >
                <Ionicons
                  name={card.icone}
                  size={22}
                  color={card.corIcone}
                />
              </View>
              <Text style={s.resumoValor} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{card.valor}</Text>
              <Text style={s.resumoTitulo}>{card.titulo}</Text>
            </View>
          </View>
        ))}
      </View>

      <AlertaEstoqueCritico
        produtos={produtosBaixoEstoque}
        mostrarTodos={mostrarTodosAlertas}
        onToggle={() => setMostrarTodosAlertas(!mostrarTodosAlertas)}
      />

      <View style={s.secaoHeader}>
        <Text style={s.secaoTitulo}>Produtos recentes</Text>
        <Text style={s.secaoContador}>
          {produtosRecentes.length} itens
        </Text>
      </View>
    </View>
  );

  // ── Render ───
  const renderItem = useCallback(
    ({ item }: { item: Produto }) => (
      <View style={s.itemWrapper}>
        <ProdutoCard produto={item} categorias={categorias} />
      </View>
    ),
    [categorias, s],
  );

  const keyExtractor = useCallback((item: Produto) => item.id, []);

  if ((isLoading || isLoadingCategorias) && produtos.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        {ListHeader}
        <ProdutoListaSkeleton count={3} />
      </SafeAreaView>
    );
  }

  if (error && produtos.length === 0) {
    return <ErrorView message={error} onRetry={handleRetry} />;
  }

  return (
    <SafeAreaView style={s.safe}>
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
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={isWeb}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const CARD_GAP = 12;
const styles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  greetingTexts: {
    flex: 1,
    paddingRight: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
  },
  resumoTitulo: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
    marginTop: 2,
  },
  alertaContainer: {
    backgroundColor: colors.errorBackground,
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
    color: colors.error,
    marginLeft: 6,
    flex: 1,
  },
  alertaContador: {
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  alertaContadorText: {
    color: colors.surface,
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
    color: colors.text,
    fontWeight: '500',
  },
  alertaItemQtd: {
    fontSize: 13,
    color: colors.error,
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
    color: colors.error,
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
    color: colors.text,
  },
  secaoContador: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  produtoIconeWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
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
    color: colors.text,
  },
  produtoQtd: {
    fontSize: 13,
    color: colors.textLight,
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '700',
  },
});
