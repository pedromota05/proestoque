import { renderHook } from '@testing-library/react-native';
import { useEstoque } from '../useEstoque';
import type { Produto } from '../../types';

// Helper para criar produtos mockados com valores padrão
function criarProduto(overrides: Partial<Produto> = {}): Produto {
  return {
    id: '1',
    nome: 'Produto Teste',
    preco: 100,
    quantidade: 10,
    quantidadeMinima: 5,
    categoriaId: 'cat-1',
    unidade: 'un',
    criadoEm: '2026-01-01T00:00:00Z',
    atualizadoEm: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

const produtosMock: Produto[] = [
  criarProduto({
    id: '1',
    nome: 'Teclado Mecânico',
    preco: 350,
    quantidade: 20,
    quantidadeMinima: 5,
  }),
  criarProduto({
    id: '2',
    nome: 'Mouse Gamer',
    preco: 200,
    quantidade: 3,
    quantidadeMinima: 5,
  }),
  criarProduto({
    id: '3',
    nome: 'Webcam HD',
    preco: 150,
    quantidade: 5,
    quantidadeMinima: 5,
  }),
  criarProduto({
    id: '4',
    nome: 'Monitor 27"',
    preco: 2500,
    quantidade: 8,
    quantidadeMinima: 2,
  }),
];

describe('useEstoque', () => {
  it('deve calcular o valor total do estoque corretamente', async () => {
    // Teclado: 20 * 350 = 7000
    // Mouse:   3 * 200  = 600
    // Webcam:  5 * 150  = 750
    // Monitor: 8 * 2500 = 20000
    // Total: 28350
    const { result } = await renderHook(() => useEstoque(produtosMock));

    expect(result.current.valorTotal).toBe(28350);
  });

  it('deve identificar corretamente os produtos com estoque baixo', async () => {
    // Mouse: quantidade (3) <= quantidadeMinima (5) → baixo
    // Webcam: quantidade (5) <= quantidadeMinima (5) → baixo (igual ao mínimo)
    const { result } = await renderHook(() => useEstoque(produtosMock));

    expect(result.current.produtosBaixoEstoque).toHaveLength(2);
    expect(result.current.produtosBaixoEstoque[0].nome).toBe('Mouse Gamer');
    expect(result.current.produtosBaixoEstoque[1].nome).toBe('Webcam HD');
  });

  it('deve calcular o número total de itens em estoque', async () => {
    // 20 + 3 + 5 + 8 = 36
    const { result } = await renderHook(() => useEstoque(produtosMock));

    expect(result.current.totalItens).toBe(36);
  });

  it('deve retornar zeros e array vazio quando a lista de produtos estiver vazia', async () => {
    const { result } = await renderHook(() => useEstoque([]));

    expect(result.current.valorTotal).toBe(0);
    expect(result.current.produtosBaixoEstoque).toHaveLength(0);
    expect(result.current.totalItens).toBe(0);
  });

  it('deve retornar array vazio de estoque baixo quando todos os produtos estão acima do mínimo', async () => {
    const produtosOk: Produto[] = [
      criarProduto({ id: '1', quantidade: 50, quantidadeMinima: 5 }),
      criarProduto({ id: '2', quantidade: 100, quantidadeMinima: 10 }),
    ];

    const { result } = await renderHook(() => useEstoque(produtosOk));

    expect(result.current.produtosBaixoEstoque).toHaveLength(0);
  });

  it('deve considerar produto com quantidade zero como estoque baixo', async () => {
    const produtoZerado: Produto[] = [
      criarProduto({ id: '1', quantidade: 0, quantidadeMinima: 5 }),
    ];

    const { result } = await renderHook(() => useEstoque(produtoZerado));

    expect(result.current.produtosBaixoEstoque).toHaveLength(1);
    expect(result.current.totalItens).toBe(0);
    expect(result.current.valorTotal).toBe(0);
  });
});
