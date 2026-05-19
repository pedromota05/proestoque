import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { PRODUTOS_MOCK, type Produto } from '../data/mockData';

// ─── Storage key ───
const STORAGE_KEY = '@proestoque:produtos';

// ─── Types ───
interface ProductsState {
  produtos: Produto[];
  loaded: boolean;
}

type ProductsAction =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

interface ProductsContextType {
  produtos: Produto[];
  loaded: boolean;
  adicionarProduto: (data: Omit<Produto, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  editarProduto: (id: string, data: Partial<Omit<Produto, 'id' | 'criadoEm'>>) => void;
  deletarProduto: (id: string) => void;
  getProdutoById: (id: string) => Produto | undefined;
}

// ─── Reducer ───
function produtosReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, produtos: action.payload, loaded: true };

    case 'ADD':
      return { ...state, produtos: [...state.produtos, action.payload] };

    case 'UPDATE':
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      };

    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };

    default:
      return state;
  }
}

// ─── Persist helper ───
async function persistProdutos(produtos: Produto[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  } catch (error) {
    console.error('Erro ao persistir produtos:', error);
  }
}

// ─── Context ───
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// ─── Provider ───
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    loaded: false,
  });

  // Carregar do AsyncStorage na montagem
  useEffect(() => {
    async function loadProdutos() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: Produto[] = JSON.parse(stored);
          dispatch({ type: 'LOAD', payload: parsed });
        } else {
          // Primeira execução: carrega mock como fallback
          dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
          await persistProdutos(PRODUTOS_MOCK);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos do storage:', error);
        dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
      }
    }

    loadProdutos();
  }, []);

  // ─── Actions ───
  const adicionarProduto = useCallback(
    (data: Omit<Produto, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
      const agora = new Date().toISOString();
      const novoProduto: Produto = {
        ...data,
        id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        criadoEm: agora,
        atualizadoEm: agora,
      };

      dispatch({ type: 'ADD', payload: novoProduto });

      // Persistir assincronamente
      const novaLista = [...state.produtos, novoProduto];
      persistProdutos(novaLista);
    },
    [state.produtos],
  );

  const editarProduto = useCallback(
    (id: string, data: Partial<Omit<Produto, 'id' | 'criadoEm'>>) => {
      const existente = state.produtos.find((p) => p.id === id);
      if (!existente) return;

      const produtoAtualizado: Produto = {
        ...existente,
        ...data,
        atualizadoEm: new Date().toISOString(),
      };

      dispatch({ type: 'UPDATE', payload: produtoAtualizado });

      const novaLista = state.produtos.map((p) =>
        p.id === id ? produtoAtualizado : p,
      );
      persistProdutos(novaLista);
    },
    [state.produtos],
  );

  const deletarProduto = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE', payload: id });

      const novaLista = state.produtos.filter((p) => p.id !== id);
      persistProdutos(novaLista);
    },
    [state.produtos],
  );

  const getProdutoById = useCallback(
    (id: string): Produto | undefined => {
      return state.produtos.find((p) => p.id === id);
    },
    [state.produtos],
  );

  const value = useMemo<ProductsContextType>(
    () => ({
      produtos: state.produtos,
      loaded: state.loaded,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
    }),
    [state.produtos, state.loaded, adicionarProduto, editarProduto, deletarProduto, getProdutoById],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

// ─── Hook customizado ───
export function useProducts(): ProductsContextType {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductsProvider');
  }
  return context;
}
