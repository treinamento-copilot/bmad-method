/**
 * @fileoverview Testes básicos para verificar se o App React renderiza sem crash
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

    test('renders event creation form', () => {
      render(<App />);
      
      // Verificar se o formulário de criação de eventos está presente
      const titleElement = screen.getByText(/ChurrasApp/i);
      expect(titleElement).toBeInTheDocument();
      
      // Verificar se o formulário tem os campos obrigatórios
      const nameInput = screen.getByLabelText(/Nome do Evento/i);
      expect(nameInput).toBeInTheDocument();
      
      const dateInput = screen.getByLabelText(/Data do Evento/i);
      expect(dateInput).toBeInTheDocument();
      
      const locationInput = screen.getByLabelText(/Local do Evento/i);
      expect(locationInput).toBeInTheDocument();
      
      const participantsInput = screen.getByLabelText(/Número Estimado de Participantes/i);
      expect(participantsInput).toBeInTheDocument();
    });

    test('has basic structure elements', () => {
      render(<App />);
      
      // Verificar se existe uma estrutura básica
      const appDiv = document.querySelector('.App');
      expect(appDiv).toBeInTheDocument();
      
      // Verificar se o botão de criação está presente
      const createButton = screen.getByRole('button', { name: /Criar Evento/i });
      expect(createButton).toBeInTheDocument();
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
