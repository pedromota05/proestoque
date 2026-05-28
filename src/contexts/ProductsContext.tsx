import axios from 'axios';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { api } from '../services/api';
import { notificarEstoqueCritico } from '../services/notifications';
import { useAuth } from './AuthContext';
import type { Produto } from '../types';

// ─── Types ───
interface ProductsState {
  produtos: Produto[];
  loaded: boolean;
  isLoading: boolean;
  error: string | null;
}

type ProductsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Produto[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string }
  | { type: 'RESET' };

interface ProductsContextType {
  produtos: Produto[];
  loaded: boolean;
  isLoading: boolean;
  error: string | null;
  adicionarProduto: (data: Omit<Produto, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>;
  editarProduto: (id: string, data: Partial<Omit<Produto, 'id' | 'criadoEm'>>) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
  recarregar: () => Promise<void>;
}

// ─── Reducer ───
function produtosReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };

    case 'LOAD_SUCCESS':
      return { ...state, produtos: action.payload, loaded: true, isLoading: false, error: null };

    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload, loaded: true };

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

    case 'RESET':
      return { produtos: [], loaded: false, isLoading: false, error: null };

    default:
      return state;
  }
}

// ─── Context ───
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// ─── Provider ───
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    loaded: false,
    isLoading: false,
    error: null,
  });

  // Buscar produtos da API
  const carregarProdutos = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const response = await api.get('/produtos');
      const produtosFetch: Produto[] = response.data.dados || response.data;
      dispatch({ type: 'LOAD_SUCCESS', payload: produtosFetch });
      
      const criticos = produtosFetch.filter(p => p.quantidade <= p.quantidadeMinima);
      notificarEstoqueCritico(criticos);
    } catch (error) {
      console.error('Erro ao carregar produtos da API:', error);
      let errorMessage = 'Não foi possível carregar os produtos.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      dispatch({ type: 'LOAD_ERROR', payload: errorMessage });
    }
  }, []);

  // Só busca produtos quando o usuário está autenticado
  // Limpa os dados quando o usuário faz logout
  useEffect(() => {
    if (isAuthenticated) {
      carregarProdutos();
    } else {
      dispatch({ type: 'RESET' });
    }
  }, [isAuthenticated, carregarProdutos]);

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
      isLoading: state.isLoading,
      error: state.error,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
      recarregar: carregarProdutos,
    }),
    [state, adicionarProduto, editarProduto, deletarProduto, getProdutoById, carregarProdutos],
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

