/**
 * @fileoverview Teste básico para verificar se o App React renderiza sem crash
 */

import { render, screen } from '@testing-library/react';
import App from './App';

describe('ChurrasApp Frontend - Basic Tests', () => {
  describe('App Component', () => {
    test('renders without crashing', () => {
      // Se este teste passa, o App renderiza sem erro
      render(<App />);
      
      // Verificar se pelo menos algum elemento está presente
      const appElement = document.querySelector('.App');
      expect(appElement).toBeInTheDocument();
    });

    test('renders learn react link', () => {
      render(<App />);
      
      // Create React App vem com este link por padrão
      const linkElement = screen.getByText(/learn react/i);
      expect(linkElement).toBeInTheDocument();
    });

    test('has basic structure elements', () => {
      render(<App />);
      
      // Verificar se existe uma estrutura básica
      const appDiv = document.querySelector('.App');
      expect(appDiv).toBeInTheDocument();
    });
  });

  describe('Environment Configuration', () => {
    test('should be able to access process.env object', () => {
      // Verificar se o objeto process.env está disponível
      expect(process.env).toBeDefined();
      expect(typeof process.env).toBe('object');
    });
  });
});
