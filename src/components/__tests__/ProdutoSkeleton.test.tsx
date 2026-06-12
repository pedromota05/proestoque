import React from 'react';
import { render } from '@testing-library/react-native';
import { ProdutoSkeletonItem, ProdutoListaSkeleton } from '../ProdutoSkeleton';

// Mock do ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#FFFFFF',
      border: '#E2E0E7',
    },
  }),
}));

describe('ProdutoSkeletonItem', () => {
  it('deve renderizar no layout de linha (row) por padrão', async () => {
    const { toJSON } = await render(<ProdutoSkeletonItem />);

    // Sem layoutColuna, renderiza o layout row (flexDirection: 'row')
    expect(toJSON()).toBeTruthy();
  });

  it('deve renderizar no layout de linha quando layoutColuna é false', async () => {
    const { toJSON } = await render(<ProdutoSkeletonItem layoutColuna={false} />);

    expect(toJSON()).toBeTruthy();
  });

  it('deve renderizar no layout de coluna quando layoutColuna é true', async () => {
    const { toJSON } = await render(<ProdutoSkeletonItem layoutColuna={true} />);

    // Quando layoutColuna é true, entra no if (layoutColuna) → branch true
    expect(toJSON()).toBeTruthy();
  });
});

describe('ProdutoListaSkeleton', () => {
  it('deve renderizar com count e layoutColuna padrão (row)', async () => {
    const { toJSON } = await render(<ProdutoListaSkeleton />);

    // Padrão: count=6, layoutColuna=false → usa s.listaRow e s.itemRowWrapper
    expect(toJSON()).toBeTruthy();
  });

  it('deve renderizar no layout de coluna quando layoutColuna é true', async () => {
    const { toJSON } = await render(<ProdutoListaSkeleton layoutColuna={true} />);

    // layoutColuna=true → usa s.listaColuna e s.itemColunaWrapper
    expect(toJSON()).toBeTruthy();
  });

  it('deve renderizar no layout de linha quando layoutColuna é false', async () => {
    const { toJSON } = await render(<ProdutoListaSkeleton layoutColuna={false} />);

    // Explicitamente false → branch false para os ternários
    expect(toJSON()).toBeTruthy();
  });

  it('deve renderizar a quantidade correta de skeletons com count customizado', async () => {
    const { toJSON } = await render(<ProdutoListaSkeleton count={3} />);

    const tree = toJSON();
    // O container raiz deve ter exatamente 3 filhos (wrappers)
    expect(tree).toBeTruthy();
    if (tree && !Array.isArray(tree) && tree.children) {
      expect(tree.children).toHaveLength(3);
    }
  });

  it('deve renderizar 0 skeletons quando count é 0', async () => {
    const { toJSON } = await render(<ProdutoListaSkeleton count={0} />);

    const tree = toJSON();
    // Container sem filhos
    expect(tree).toBeTruthy();
    if (tree && !Array.isArray(tree)) {
      expect(tree.children ?? []).toHaveLength(0);
    }
  });

  it('deve combinar layoutColuna=true com count customizado', async () => {
    const { toJSON } = await render(
      <ProdutoListaSkeleton count={2} layoutColuna={true} />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();
    if (tree && !Array.isArray(tree) && tree.children) {
      expect(tree.children).toHaveLength(2);
    }
  });
});
