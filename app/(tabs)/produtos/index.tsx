import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebFooter } from '../../../src/components/web/WebFooter';
import { LoadingView } from '../../../src/components/LoadingView';
import { ProdutoListaSkeleton } from '../../../src/components/ProdutoSkeleton';
import { ErrorView } from '../../../src/components/ErrorView';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { ThemeColors } from '../../../src/constants/theme';
import { useProducts } from '../../../src/contexts/ProductsContext';
import { useCategorias } from '../../../src/hooks/useCategorias';
import type { Produto, Categoria } from '../../../src/types';

const isWeb = Platform.OS === 'web';

// ─── Tipos auxiliares ───
type StatusEstoque = 'normal' | 'baixo' | 'sem_estoque';
type ModoVisualizacao = 'grade' | 'agrupado';
type Secao = { title: string; categoriaId: string; data: Produto[] };

interface ChipCategoria {
  id: string | null;
  nome: string;
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
function ProdutoCard({
  produto,
  categorias,
  layoutColuna = false,
  onPress,
}: {
  produto: Produto;
  categorias: Categoria[];
  layoutColuna?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  const status = getStatusEstoque(produto);
  const config = getStatusConfig(status, colors);
  const icone = getCategoriaIcone(produto.categoriaId, categorias);
  const [imageError, setImageError] = useState(false);

  const showImage = produto.foto && !imageError;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        s.produtoCard,
        layoutColuna && s.produtoCardColuna,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: produto.foto }}
          style={[
            s.produtoFoto,
            !layoutColuna && s.iconeRow,
            layoutColuna && s.iconeColuna,
          ]}
          onError={() => setImageError(true)}
        />
      ) : (
        <View
          style={[
            s.produtoIconeWrapper,
            !layoutColuna && s.iconeRow,
            layoutColuna && s.iconeColuna,
          ]}
        >
          <Ionicons
            name={icone as keyof typeof Ionicons.glyphMap}
            size={22}
            color={colors.primary}
          />
        </View>
      )}

      <View
        style={[
          s.produtoInfo,
          layoutColuna && s.produtoInfoColuna,
        ]}
      >
        <Text
          style={[s.produtoNome, layoutColuna && s.textCenter]}
          numberOfLines={layoutColuna ? 2 : 1}
        >
          {produto.nome}
        </Text>
        <Text
          style={[s.produtoQtd, layoutColuna && s.textCenter]}
        >
          {produto.quantidade} {produto.unidade}
        </Text>
      </View>

      <View
        style={[
          s.badge,
          { backgroundColor: config.fundo },
          layoutColuna && s.badgeColuna,
        ]}
      >
        <Text style={[s.badgeText, { color: config.cor }]}>
          {config.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function ListaVazia() {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);

  return (
    <View style={s.itemWrapper}>
      <View style={s.vazioContainer}>
        <Ionicons
          name="search-outline"
          size={56}
          color={colors.border}
        />
        <Text style={s.vazioTitulo}>Nenhum produto encontrado</Text>
        <Text style={s.vazioSubtitulo}>
          Tente ajustar a busca ou alterar o filtro de categoria.
        </Text>
      </View>
    </View>
  );
}

// ─── Componente principal ───
export default function ProdutosScreen() {
  const { produtos, recarregar, isLoading, error } = useProducts();
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  const { categorias, isLoading: isLoadingCategorias, recarregar: recarregarCategorias } = useCategorias();
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] =
    useState<ModoVisualizacao>('grade');

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const layoutColuna = modoVisualizacao === 'grade' && !isDesktop;

  const chips = useMemo<ChipCategoria[]>(() => [
    { id: null, nome: 'Todos' },
    ...categorias.map((c) => ({ id: c.id, nome: c.nome }))
  ], [categorias]);

  const produtosFiltrados = useMemo(() => {
    const termoNormalizado = busca.trim().toLowerCase();

    return produtos.filter((p) => {
      const correspondeCategoria =
        categoriaSelecionada === null ||
        p.categoriaId === categoriaSelecionada;

      const correspondeBusca =
        termoNormalizado === '' ||
        p.nome.toLowerCase().includes(termoNormalizado);

      return correspondeCategoria && correspondeBusca;
    });
  }, [busca, categoriaSelecionada, produtos]);

  const secoesAgrupadas = useMemo<Secao[]>(() => {
    return categorias.map((cat) => ({
      title: cat.nome,
      categoriaId: cat.id,
      data: produtosFiltrados.filter((p) => p.categoriaId === cat.id),
    })).filter((secao) => secao.data.length > 0);
  }, [produtosFiltrados, categorias]);

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

  const renderGradeItem = useCallback(
    ({ item }: { item: Produto }) => (
      <ProdutoCard
        produto={item}
        categorias={categorias}
        layoutColuna={layoutColuna}
        onPress={() => router.push(`/produtos/${item.id}` as any)}
      />
    ),
    [layoutColuna, router, categorias],
  );

  const renderAgrupItem = useCallback(
    ({ item }: { item: Produto }) => (
      <View style={s.itemWrapper}>
        <ProdutoCard
          produto={item}
          categorias={categorias}
          onPress={() => router.push(`/produtos/${item.id}` as any)}
        />
      </View>
    ),
    [router, categorias, s],
  );

  const keyExtractor = useCallback((item: Produto) => item.id, []);

  const ListHeader = (
    <View style={s.headerWrapper}>
      <View style={s.titleRow}>
        <Text style={s.titulo}>Produtos</Text>
        {isWeb && (
          <TouchableOpacity
            style={s.addButton}
            activeOpacity={0.75}
            accessibilityLabel="Adicionar produto"
            onPress={() => router.push('/produtos/novo' as any)}
          >
            <Ionicons name="add" size={26} color={colors.surface} />
          </TouchableOpacity>
        )}
      </View>

      <View style={s.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textLight}
          style={s.searchIcon}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={colors.textLight}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <TouchableOpacity
            onPress={() => setBusca('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Limpar busca"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={s.chipsRow}>
        {chips.map((chip) => {
          const ativo = categoriaSelecionada === chip.id;
          return (
            <TouchableOpacity
              key={chip.id ?? 'todos'}
              style={[
                s.chip,
                ativo ? s.chipAtivo : s.chipInativo,
              ]}
              activeOpacity={0.7}
              onPress={() => setCategoriaSelecionada(chip.id)}
            >
              <Text
                style={[
                  s.chipText,
                  ativo ? s.chipTextAtivo : s.chipTextInativo,
                ]}
              >
                {chip.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.toggleRow}>
        <TouchableOpacity
          style={[
            s.toggleBtn,
            modoVisualizacao === 'grade' && s.toggleBtnAtivo,
          ]}
          activeOpacity={0.7}
          onPress={() => setModoVisualizacao('grade')}
        >
          <Ionicons
            name="grid-outline"
            size={16}
            color={
              modoVisualizacao === 'grade'
                ? colors.surface
                : colors.textLight
            }
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              s.toggleText,
              modoVisualizacao === 'grade'
                ? s.toggleTextAtivo
                : s.toggleTextInativo,
            ]}
          >
            Grade
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.toggleBtn,
            modoVisualizacao === 'agrupado' && s.toggleBtnAtivo,
          ]}
          activeOpacity={0.7}
          onPress={() => setModoVisualizacao('agrupado')}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={
              modoVisualizacao === 'agrupado'
                ? colors.surface
                : colors.textLight
            }
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              s.toggleText,
              modoVisualizacao === 'agrupado'
                ? s.toggleTextAtivo
                : s.toggleTextInativo,
            ]}
          >
            Agrupado
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.resultadoRow}>
        <Text style={s.resultadoLabel}>
          {produtosFiltrados.length}{' '}
          {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
        </Text>
      </View>
    </View>
  );

  const listFooter = isWeb ? (
    <View style={{ flexGrow: 1, justifyContent: 'flex-end', paddingTop: 40 }}>
      <WebFooter />
    </View>
  ) : (
    <View style={{ height: 80 }} />
  );

  const refreshCtrl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
    />
  );

  if ((isLoading || isLoadingCategorias) && produtos.length === 0) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        {ListHeader}
        <ProdutoListaSkeleton layoutColuna={layoutColuna} count={6} />
      </SafeAreaView>
    );
  }

  if (error && produtos.length === 0) {
    return <ErrorView message={error} onRetry={handleRetry} />;
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {modoVisualizacao === 'grade' ? (
        <FlatList
          testID="flatlist-produtos"
          style={{ flex: 1 }}
          data={produtosFiltrados}
          renderItem={renderGradeItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={s.gridRow}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListaVazia}
          ListFooterComponent={listFooter}
          ListFooterComponentStyle={isWeb ? { flexGrow: 1 } : undefined}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={isWeb}
          refreshControl={refreshCtrl}
        />
      ) : (
        <SectionList
          testID="sectionlist-produtos"
          style={{ flex: 1 }}
          sections={secoesAgrupadas}
          keyExtractor={keyExtractor}
          renderItem={renderAgrupItem}
          renderSectionHeader={({ section }) => (
            <View style={s.sectionHeaderWrapper}>
              <View style={s.sectionHeader}>
                <Ionicons
                  name={
                    (categorias.find((c) => c.id === section.categoriaId)
                      ?.icone ?? 'cube-outline') as keyof typeof Ionicons.glyphMap
                  }
                  size={18}
                  color={colors.primary}
                />
                <Text style={s.sectionTitle}>{section.title}</Text>
                <View style={s.sectionBadge}>
                  <Text style={s.sectionBadgeText}>
                    {section.data.length}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListaVazia}
          ListFooterComponent={listFooter}
          ListFooterComponentStyle={isWeb ? { flexGrow: 1 } : undefined}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={isWeb}
          refreshControl={refreshCtrl}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* FAB — apenas mobile */}
      {!isWeb && (
        <TouchableOpacity
          style={s.fab}
          activeOpacity={0.8}
          onPress={() => router.push('/produtos/novo' as any)}
          accessibilityLabel="Adicionar produto"
        >
          <Ionicons name="add" size={28} color={colors.surface} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: isWeb ? 0 : 16,
    flexGrow: 1,
  },
  gridRow: {
    maxWidth: 1024,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    gap: 10,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
    outlineStyle: 'none' as any,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipAtivo: {
    backgroundColor: colors.primary,
  },
  chipInativo: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextAtivo: {
    color: colors.surface,
  },
  chipTextInativo: {
    color: colors.textLight,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  toggleBtnAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleTextAtivo: {
    color: colors.surface,
  },
  toggleTextInativo: {
    color: colors.textLight,
  },
  resultadoRow: {
    marginBottom: 12,
  },
  resultadoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  sectionHeaderWrapper: {
    maxWidth: 1024,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  produtoCardColuna: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 200,
    padding: 16,
  },
  produtoIconeWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  produtoFoto: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  iconeRow: {
    marginRight: 12,
  },
  iconeColuna: {
    marginBottom: 12,
  },
  produtoInfo: {
    flex: 1,
    marginRight: 8,
  },
  produtoInfoColuna: {
    flex: 1,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
  textCenter: {
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeColuna: {
    marginTop: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  vazioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  vazioTitulo: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  vazioSubtitulo: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
