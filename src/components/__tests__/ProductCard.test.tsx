import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard, Produto } from '../ProductCard';

// Mock do ThemeContext para evitar dependência do Provider nos testes
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#6324a4',
      primaryLight: '#F3EEFB',
      surface: '#FFFFFF',
      text: '#1F2937',
      textLight: '#6B7280',
      border: '#E2E0E7',
      warningBackground: '#FEF3C7',
      warningText: '#92400E',
    },
  }),
}));

// Produto com estoque normal (acima do mínimo)
const produtoEstoqueNormal: Produto = {
  id: '1',
  nome: 'Teclado Mecânico RGB',
  quantidade: 50,
  preco: 349.9,
  estoqueMinimo: 10,
};

// Produto com estoque baixo (igual ao mínimo)
const produtoEstoqueBaixo: Produto = {
  id: '2',
  nome: 'Mouse Gamer',
  quantidade: 5,
  preco: 199.99,
  estoqueMinimo: 5,
};

// Produto com estoque abaixo do mínimo
const produtoEstoqueCritico: Produto = {
  id: '3',
  nome: 'Monitor Ultrawide',
  quantidade: 2,
  preco: 2499.0,
  estoqueMinimo: 10,
};

describe('ProductCard', () => {
  it('deve renderizar o nome do produto corretamente', async () => {
    const { getByTestId } = await render(
      <ProductCard produto={produtoEstoqueNormal} onEditar={jest.fn()} />
    );

    const nomeElement = getByTestId('product-name');
    expect(nomeElement.props.children).toBe('Teclado Mecânico RGB');
  });

  it('deve exibir a quantidade correta em estoque', async () => {
    const { getByTestId } = await render(
      <ProductCard produto={produtoEstoqueNormal} onEditar={jest.fn()} />
    );

    const quantidadeElement = getByTestId('product-quantity');
    expect(quantidadeElement.props.children).toEqual(['Estoque: ', 50]);
  });

  it('NÃO deve exibir o alerta de estoque baixo quando o estoque está normal', async () => {
    const { queryByTestId } = await render(
      <ProductCard produto={produtoEstoqueNormal} onEditar={jest.fn()} />
    );

    const alerta = queryByTestId('low-stock-alert');
    expect(alerta).toBeNull();
  });

  it('deve exibir o alerta de estoque baixo quando a quantidade é igual ao mínimo', async () => {
    const { getByTestId } = await render(
      <ProductCard produto={produtoEstoqueBaixo} onEditar={jest.fn()} />
    );

    const alerta = getByTestId('low-stock-alert');
    expect(alerta).toBeTruthy();
  });

  it('deve exibir o alerta de estoque baixo quando a quantidade está abaixo do mínimo', async () => {
    const { getByTestId, getByText } = await render(
      <ProductCard produto={produtoEstoqueCritico} onEditar={jest.fn()} />
    );

    expect(getByTestId('low-stock-alert')).toBeTruthy();
    expect(getByText('⚠ Estoque baixo')).toBeTruthy();
  });

  it('deve chamar onEditar com o ID correto ao pressionar o botão de editar', async () => {
    const mockOnEditar = jest.fn();

    const { getByTestId } = await render(
      <ProductCard produto={produtoEstoqueNormal} onEditar={mockOnEditar} />
    );

    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);

    expect(mockOnEditar).toHaveBeenCalledTimes(1);
    expect(mockOnEditar).toHaveBeenCalledWith('1');
  });

  it('NÃO deve chamar onEditar antes do botão ser pressionado', async () => {
    const mockOnEditar = jest.fn();

    await render(
      <ProductCard produto={produtoEstoqueNormal} onEditar={mockOnEditar} />
    );

    expect(mockOnEditar).not.toHaveBeenCalled();
  });
});
