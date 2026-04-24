import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
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
import { WebFooter } from '../../src/components/web/WebFooter';
import { theme } from '../../src/constants/theme';
import {
  CATEGORIAS_MOCK,
  PRODUTOS_MOCK,
  type Produto,
} from '../../src/data/mockData';

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

const CHIPS: ChipCategoria[] = [
  { id: null, nome: 'Todos' },
  ...CATEGORIAS_MOCK.map((c) => ({ id: c.id, nome: c.nome })),
];

// ─── Componentes internos ───
function ProdutoCard({
  produto,
  layoutColuna = false,
}: {
  produto: Produto;
  layoutColuna?: boolean;
}) {
  const status = getStatusEstoque(produto);
  const config = STATUS_CONFIG[status];
  const icone = getCategoriaIcone(produto.categoriaId);

  return (
    <View
      style={[
        styles.produtoCard,
        layoutColuna && styles.produtoCardColuna,
      ]}
    >
      <View
        style={[
          styles.produtoIconeWrapper,
          !layoutColuna && styles.iconeRow,
          layoutColuna && styles.iconeColuna,
        ]}
      >
        <Ionicons
          name={icone as keyof typeof Ionicons.glyphMap}
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View
        style={[
          styles.produtoInfo,
          layoutColuna && styles.produtoInfoColuna,
        ]}
      >
        <Text
          style={[styles.produtoNome, layoutColuna && styles.textCenter]}
          numberOfLines={layoutColuna ? 2 : 1}
        >
          {produto.nome}
        </Text>
        <Text
          style={[styles.produtoQtd, layoutColuna && styles.textCenter]}
        >
          {produto.quantidadeEstoque} {produto.unidade}
        </Text>
      </View>

      <View
        style={[
          styles.badge,
          { backgroundColor: config.fundo },
          layoutColuna && styles.badgeColuna,
        ]}
      >
        <Text style={[styles.badgeText, { color: config.cor }]}>
          {config.label}
        </Text>
      </View>
    </View>
  );
}

function ListaVazia() {
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.vazioContainer}>
        <Ionicons
          name="search-outline"
          size={56}
          color={theme.colors.border}
        />
        <Text style={styles.vazioTitulo}>Nenhum produto encontrado</Text>
        <Text style={styles.vazioSubtitulo}>
          Tente ajustar a busca ou alterar o filtro de categoria.
        </Text>
      </View>
    </View>
  );
}

// ─── Componente principal ───
export default function ProdutosScreen() {
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

  const produtosFiltrados = useMemo(() => {
    const termoNormalizado = busca.trim().toLowerCase();

    return PRODUTOS_MOCK.filter((p) => {
      const correspondeCategoria =
        categoriaSelecionada === null ||
        p.categoriaId === categoriaSelecionada;

      const correspondeBusca =
        termoNormalizado === '' ||
        p.nome.toLowerCase().includes(termoNormalizado);

      return correspondeCategoria && correspondeBusca;
    });
  }, [busca, categoriaSelecionada]);

  const secoesAgrupadas = useMemo<Secao[]>(() => {
    return CATEGORIAS_MOCK.map((cat) => ({
      title: cat.nome,
      categoriaId: cat.id,
      data: produtosFiltrados.filter((p) => p.categoriaId === cat.id),
    })).filter((secao) => secao.data.length > 0);
  }, [produtosFiltrados]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const renderGradeItem = useCallback(
    ({ item }: { item: Produto }) => (
      <ProdutoCard produto={item} layoutColuna={layoutColuna} />
    ),
    [layoutColuna],
  );

  const renderAgrupItem = useCallback(
    ({ item }: { item: Produto }) => (
      <View style={styles.itemWrapper}>
        <ProdutoCard produto={item} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Produto) => item.id, []);

  const ListHeader = (
    <View style={styles.headerWrapper}>
      <View style={styles.titleRow}>
        <Text style={styles.titulo}>Produtos</Text>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.75}
          accessibilityLabel="Adicionar produto"
        >
          <Ionicons name="add" size={26} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={theme.colors.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={theme.colors.textLight}
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
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.chipsRow}>
        {CHIPS.map((chip) => {
          const ativo = categoriaSelecionada === chip.id;
          return (
            <TouchableOpacity
              key={chip.id ?? 'todos'}
              style={[
                styles.chip,
                ativo ? styles.chipAtivo : styles.chipInativo,
              ]}
              activeOpacity={0.7}
              onPress={() => setCategoriaSelecionada(chip.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  ativo ? styles.chipTextAtivo : styles.chipTextInativo,
                ]}
              >
                {chip.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            modoVisualizacao === 'grade' && styles.toggleBtnAtivo,
          ]}
          activeOpacity={0.7}
          onPress={() => setModoVisualizacao('grade')}
        >
          <Ionicons
            name="grid-outline"
            size={16}
            color={
              modoVisualizacao === 'grade'
                ? theme.colors.surface
                : theme.colors.textLight
            }
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.toggleText,
              modoVisualizacao === 'grade'
                ? styles.toggleTextAtivo
                : styles.toggleTextInativo,
            ]}
          >
            Grade
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            modoVisualizacao === 'agrupado' && styles.toggleBtnAtivo,
          ]}
          activeOpacity={0.7}
          onPress={() => setModoVisualizacao('agrupado')}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={
              modoVisualizacao === 'agrupado'
                ? theme.colors.surface
                : theme.colors.textLight
            }
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.toggleText,
              modoVisualizacao === 'agrupado'
                ? styles.toggleTextAtivo
                : styles.toggleTextInativo,
            ]}
          >
            Agrupado
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultadoRow}>
        <Text style={styles.resultadoLabel}>
          {produtosFiltrados.length}{' '}
          {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
        </Text>
      </View>
    </View>
  );

  const webFooter = isWeb ? (
    <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
      <WebFooter />
    </View>
  ) : undefined;

  const refreshCtrl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary]}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {modoVisualizacao === 'grade' ? (
        <FlatList
          style={{ flex: 1 }}
          data={produtosFiltrados}
          renderItem={renderGradeItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListaVazia}
          ListFooterComponent={webFooter}
          ListFooterComponentStyle={isWeb ? { flexGrow: 1 } : undefined}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={isWeb}
          refreshControl={refreshCtrl}
        />
      ) : (
        <SectionList
          style={{ flex: 1 }}
          sections={secoesAgrupadas}
          keyExtractor={keyExtractor}
          renderItem={renderAgrupItem}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeaderWrapper}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name={
                    (CATEGORIAS_MOCK.find((c) => c.id === section.categoriaId)
                      ?.icone ?? 'cube-outline') as keyof typeof Ionicons.glyphMap
                  }
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>
                    {section.data.length}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListaVazia}
          ListFooterComponent={webFooter}
          ListFooterComponentStyle={isWeb ? { flexGrow: 1 } : undefined}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={isWeb}
          refreshControl={refreshCtrl}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: 0,
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
    color: theme.colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
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
    backgroundColor: theme.colors.primary,
  },
  chipInativo: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextAtivo: {
    color: theme.colors.surface,
  },
  chipTextInativo: {
    color: theme.colors.textLight,
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
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  toggleBtnAtivo: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleTextAtivo: {
    color: theme.colors.surface,
  },
  toggleTextInativo: {
    color: theme.colors.textLight,
  },
  resultadoRow: {
    marginBottom: 12,
  },
  resultadoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textLight,
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
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: theme.colors.text,
  },
  produtoQtd: {
    fontSize: 13,
    color: theme.colors.textLight,
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
    color: theme.colors.text,
    marginTop: 16,
  },
  vazioSubtitulo: {
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
