import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
function ProdutoCard({ produto }: { produto: Produto }) {
  const status = getStatusEstoque(produto);
  const config = STATUS_CONFIG[status];
  const icone = getCategoriaIcone(produto.categoriaId);

  return (
    <View style={styles.itemWrapper}>
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Produto }) => <ProdutoCard produto={item} />,
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

      <View style={styles.resultadoRow}>
        <Text style={styles.resultadoLabel}>
          {produtosFiltrados.length}{' '}
          {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        style={{ flex: 1 }}
        data={produtosFiltrados}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListaVazia}
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
  resultadoRow: {
    marginBottom: 12,
  },
  resultadoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textLight,
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
