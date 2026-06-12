import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WebFooter } from '../web/WebFooter';

// Mock do ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#6324a4',
      surface: '#FFFFFF',
      text: '#1F2937',
      textLight: '#6B7280',
      border: '#E2E0E7',
    },
  }),
}));

const EXPECTED_LINKS = [
  'Sobre',
  'Ajuda',
  'Termos de Privacidade',
  'Cookies',
  'Acessibilidade',
  'Desenvolvedores',
];

describe('WebFooter', () => {
  it('deve renderizar todos os links do footer', async () => {
    const { getByText } = await render(<WebFooter />);

    EXPECTED_LINKS.forEach((label) => {
      expect(getByText(label)).toBeTruthy();
    });
  });

  it('deve renderizar o texto de copyright', async () => {
    const { getByText } = await render(<WebFooter />);

    expect(getByText('© 2026 ProEstoque — Todos os direitos reservados')).toBeTruthy();
  });

  it('deve permitir pressionar cada link sem erros', async () => {
    const { getByText } = await render(<WebFooter />);

    EXPECTED_LINKS.forEach((label) => {
      const link = getByText(label);
      fireEvent.press(link);
    });
  });

  it('deve renderizar os links com accessibilityRole "link"', async () => {
    const { getAllByRole } = await render(<WebFooter />);

    const links = getAllByRole('link');
    expect(links).toHaveLength(EXPECTED_LINKS.length);
  });
});
