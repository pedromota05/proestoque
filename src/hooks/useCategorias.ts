import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Categoria } from '../types';

export function useCategorias() {
  const { isAuthenticated } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err);
      setError(err?.response?.data?.message || 'Não foi possível carregar as categorias.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  return { categorias, isLoading, error, recarregar: carregarCategorias };
}
