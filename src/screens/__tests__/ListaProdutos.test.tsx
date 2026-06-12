import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import ProdutosScreen from '../../../app/(tabs)/produtos/index';
import type { Produto } from '../../types';

// ─── Dados mockados ───
const produtosMock: Produto[] = [
  {
    id: '1',
    nome: 'Teclado Mecânico RGB',
    preco: 349.9,
    quantidade: 20,
    quantidadeMinima: 5,
    categoriaId: 'cat-1',
    unidade: 'un',
    criadoEm: '2026-01-01T00:00:00Z',
    atualizadoEm: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    nome: 'Mouse Gamer Pro',
    preco: 199.99,
    quantidade: 3,
    quantidadeMinima: 5,
    categoriaId: 'cat-1',
    unidade: 'un',
    criadoEm: '2026-01-01T00:00:00Z',
    atualizadoEm: '2026-01-01T00:00:00Z',
  },
];

// ─── Valores padrão dos mocks (serão sobrescritos por teste) ───
let mockProductsReturnValue: Record<string, unknown> = {};
let mockCategoriasReturnValue: Record<string, unknown> = {};

// ─── Mock dos contextos e hooks que a tela consome ───
jest.mock('../../contexts/ProductsContext', () => ({
  useProducts: () => mockProductsReturnValue,
}));

jest.mock('../../hooks/useCategorias', () => ({
  useCategorias: () => mockCategoriasReturnValue,
}));

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#6324a4',
      primaryLight: '#F3EEFB',
      secondary: '#54277f',
      accent: '#2dbf6c',
      accentLight: '#E8F9F0',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#1F2937',
      textLight: '#6B7280',
      border: '#E2E0E7',
      error: '#EF4444',
      errorBackground: '#FEE2E2',
      successBackground: '#D1FAE5',
      successText: '#065F46',
      warning: '#F59E0B',
      warningBackground: '#FEF3C7',
      warningText: '#92400E',
    },
  }),
}));

export const mockPush = jest.fn();

// Mock do expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock do react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ProdutosScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reseta para valores padrão antes de cada teste
    mockProductsReturnValue = {
      produtos: [],
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: jest.fn(),
    };

    mockCategoriasReturnValue = {
      categorias: [],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };
  });

  it('deve exibir o estado de loading (skeleton) enquanto os dados são carregados', async () => {
    // Simula estado de carregamento: isLoading = true, sem produtos ainda
    mockProductsReturnValue = {
      produtos: [],
      isLoading: true,
      error: null,
      loaded: false,
      recarregar: jest.fn(),
    };
    mockCategoriasReturnValue = {
      categorias: [],
      isLoading: true,
      error: null,
      recarregar: jest.fn(),
    };

    const { getByText, queryByText } = await render(<ProdutosScreen />);

    // O título "Produtos" aparece no header mesmo durante o loading
    expect(getByText('Produtos')).toBeTruthy();

    // Os nomes dos produtos NÃO devem aparecer durante o loading
    expect(queryByText('Teclado Mecânico RGB')).toBeNull();
    expect(queryByText('Mouse Gamer Pro')).toBeNull();
  });

  it('deve exibir os produtos após o carregamento ser concluído', async () => {
    // Simula dados carregados com sucesso
    mockProductsReturnValue = {
      produtos: produtosMock,
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: jest.fn(),
    };
    mockCategoriasReturnValue = {
      categorias: [{ id: 'cat-1', nome: 'Periféricos', icone: 'game-controller-outline', cor: '#6324a4', criadoEm: '2026-01-01T00:00:00Z' }],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };

    const { findByText } = await render(<ProdutosScreen />);

    // Aguarda os produtos aparecerem na tela
    const teclado = await findByText('Teclado Mecânico RGB');
    const mouse = await findByText('Mouse Gamer Pro');

    expect(teclado).toBeTruthy();
    expect(mouse).toBeTruthy();
  });

  it('deve exibir a mensagem de erro quando a API falha', async () => {
    const mensagemErro = 'Não foi possível carregar os produtos.';

    // Simula falha na API: error preenchido, sem produtos
    mockProductsReturnValue = {
      produtos: [],
      isLoading: false,
      error: mensagemErro,
      loaded: true,
      recarregar: jest.fn(),
    };

    const { findByText } = await render(<ProdutosScreen />);

    // O ErrorView exibe o título fixo e a mensagem de erro
    const titulo = await findByText('Ops, algo deu errado');
    const mensagem = await findByText(mensagemErro);

    expect(titulo).toBeTruthy();
    expect(mensagem).toBeTruthy();
  });

  it('deve exibir o botão "Tentar Novamente" quando ocorre um erro', async () => {
    mockProductsReturnValue = {
      produtos: [],
      isLoading: false,
      error: 'Erro de rede',
      loaded: true,
      recarregar: jest.fn(),
    };

    const { findByText } = await render(<ProdutosScreen />);

    const botaoRetry = await findByText('Tentar Novamente');
    expect(botaoRetry).toBeTruthy();
  });

  it('deve exibir a contagem correta de produtos filtrados', async () => {
    mockProductsReturnValue = {
      produtos: produtosMock,
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: jest.fn(),
    };
    mockCategoriasReturnValue = {
      categorias: [],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };

    const { findByText } = await render(<ProdutosScreen />);

    // A tela exibe "{n} produtos" no header
    const contagem = await findByText('2 produtos');
    expect(contagem).toBeTruthy();
  });

  it('deve chamar a função de recarregar ao pressionar "Tentar Novamente" na view de erro', async () => {
    const mockRecarregar = jest.fn();
    const mockRecarregarCategorias = jest.fn();

    mockProductsReturnValue = {
      produtos: [],
      isLoading: false,
      error: 'Erro de rede',
      loaded: true,
      recarregar: mockRecarregar,
    };
    mockCategoriasReturnValue = {
      categorias: [],
      isLoading: false,
      error: null,
      recarregar: mockRecarregarCategorias,
    };

    const { findByText } = await render(<ProdutosScreen />);
    
    const botaoRetry = await findByText('Tentar Novamente');
    fireEvent.press(botaoRetry);

    expect(mockRecarregar).toHaveBeenCalled();
    expect(mockRecarregarCategorias).toHaveBeenCalled();
  });

  it('deve exibir ListaVazia quando não houver produtos correspondentes à busca', async () => {
    mockProductsReturnValue = {
      produtos: produtosMock,
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: jest.fn(),
    };
    mockCategoriasReturnValue = {
      categorias: [],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };

    const { getByPlaceholderText, findByText } = await render(<ProdutosScreen />);

    const searchInput = getByPlaceholderText('Buscar produto...');
    fireEvent.changeText(searchInput, 'Produto Inexistente');

    // Quando não acha nada, exibe "Nenhum produto encontrado"
    const emptyState = await findByText('Nenhum produto encontrado');
    expect(emptyState).toBeTruthy();
  });

  it('deve disparar onRefresh ao puxar a lista para baixo', async () => {
    const mockRecarregar = jest.fn();
    mockProductsReturnValue = {
      produtos: produtosMock,
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: mockRecarregar,
    };
    mockCategoriasReturnValue = {
      categorias: [],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };

    const { getByTestId } = await render(<ProdutosScreen />);

    const flatList = getByTestId('flatlist-produtos');
    const { refreshControl } = flatList.props;
    
    // Dispara a prop onRefresh do RefreshControl dentro de um act() pois tem mudanças de estado async
    await act(async () => {
      await refreshControl.props.onRefresh();
    });

    expect(mockRecarregar).toHaveBeenCalled();
  });

  it('deve navegar para os detalhes do produto ao clicar no card', async () => {
    mockProductsReturnValue = {
      produtos: produtosMock,
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: jest.fn(),
    };
    mockCategoriasReturnValue = {
      categorias: [],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };

    const { findByText } = await render(<ProdutosScreen />);

    // Clica no primeiro produto
    const produtoCard = await findByText('Teclado Mecânico RGB');
    fireEvent.press(produtoCard);

    expect(mockPush).toHaveBeenCalledWith('/produtos/1');
  });

  it('deve alterar o modo de visualização para "Agrupado" ao clicar no botão', async () => {
    mockProductsReturnValue = {
      produtos: produtosMock,
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: jest.fn(),
    };
    // Mockamos uma categoria para os produtos agruparem nela
    mockCategoriasReturnValue = {
      categorias: [{ id: 'cat-1', nome: 'Categoria Teste', icone: 'cube-outline', cor: '#fff', criadoEm: '' }],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };

    const { findByText, findByTestId, findAllByText } = await render(<ProdutosScreen />);

    const btnAgrupado = await findByText('Agrupado');
    fireEvent.press(btnAgrupado);

    // Quando troca pra agrupado, a SectionList deve ser renderizada
    const sectionList = await findByTestId('sectionlist-produtos');
    expect(sectionList).toBeTruthy();
    
    // O título da categoria deve aparecer como section header (junto com o chip, encontra 2)
    const categoryTexts = await findAllByText('Categoria Teste');
    expect(categoryTexts.length).toBeGreaterThan(0);
  });

  it('deve filtrar produtos por categoria ao clicar no chip', async () => {
    mockProductsReturnValue = {
      produtos: produtosMock,
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: jest.fn(),
    };
    mockCategoriasReturnValue = {
      categorias: [
        { id: 'cat-1', nome: 'Categoria Teste', icone: 'cube-outline', cor: '#fff', criadoEm: '' },
        { id: 'cat-vazia', nome: 'Vazia', icone: 'cube-outline', cor: '#fff', criadoEm: '' },
      ],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };

    const { findByText, queryByText } = await render(<ProdutosScreen />);

    // Clica no chip da categoria Vazia
    const chipVazia = await findByText('Vazia');
    fireEvent.press(chipVazia);

    // Produtos não devem mais aparecer pois não pertencem a essa categoria
    await waitFor(() => {
      expect(queryByText('Teclado Mecânico RGB')).toBeNull();
    });
  });

  it('deve limpar a busca ao clicar no ícone de limpar (X)', async () => {
    mockProductsReturnValue = {
      produtos: produtosMock,
      isLoading: false,
      error: null,
      loaded: true,
      recarregar: jest.fn(),
    };
    mockCategoriasReturnValue = {
      categorias: [],
      isLoading: false,
      error: null,
      recarregar: jest.fn(),
    };

    const { getByPlaceholderText, getByLabelText, queryByText } = await render(<ProdutosScreen />);

    const searchInput = getByPlaceholderText('Buscar produto...');
    fireEvent.changeText(searchInput, 'Produto Inexistente');

    // O produto some
    await waitFor(() => {
      expect(queryByText('Teclado Mecânico RGB')).toBeNull();
    });

    // Clica no botão de fechar/limpar
    const btnLimpar = getByLabelText('Limpar busca');
    fireEvent.press(btnLimpar);

    // O valor do input volta a ser vazio e o produto reaparece
    await waitFor(() => {
      expect(searchInput.props.value).toBe('');
      expect(queryByText('Teclado Mecânico RGB')).toBeTruthy();
    });
  });
});
