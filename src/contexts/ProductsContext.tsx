import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { api } from '../services/api';
import type { Produto } from '../data/mockData';

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
  adicionarProduto: (data: Omit<Produto, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>;
  editarProduto: (id: string, data: Partial<Omit<Produto, 'id' | 'criadoEm'>>) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
  recarregar: () => Promise<void>;
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

// ─── Context ───
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// ─── Provider ───
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    loaded: false,
  });

  // Buscar produtos da API na montagem
  const carregarProdutos = useCallback(async () => {
    try {
      const response = await api.get('/produtos');
      // Extraímos os produtos de response.data.dados devido à paginação
      const produtosFetch: Produto[] = response.data.dados || response.data;
      dispatch({ type: 'LOAD', payload: produtosFetch });
    } catch (error) {
      console.error('Erro ao carregar produtos da API:', error);
      // Marca como loaded mesmo em caso de erro para não travar o splash
      dispatch({ type: 'LOAD', payload: [] });
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // ─── Actions ───
  const adicionarProduto = useCallback(
    async (data: Omit<Produto, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
      try {
        const response = await api.post('/produtos', data);
        dispatch({ type: 'ADD', payload: response.data });
      } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        throw error;
      }
    },
    [],
  );

  const editarProduto = useCallback(
    async (id: string, data: Partial<Omit<Produto, 'id' | 'criadoEm'>>) => {
      try {
        const response = await api.put(`/produtos/${id}`, data);
        dispatch({ type: 'UPDATE', payload: response.data });
      } catch (error) {
        console.error('Erro ao editar produto:', error);
        throw error;
      }
    },
    [],
  );

  const deletarProduto = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/produtos/${id}`);
        dispatch({ type: 'DELETE', payload: id });
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }
    },
    [],
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
      recarregar: carregarProdutos,
    }),
    [state.produtos, state.loaded, adicionarProduto, editarProduto, deletarProduto, getProdutoById, carregarProdutos],
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
