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

    test('renders ChurrasApp Dashboard', () => {
      render(<App />);
      
      // Verificar se o título do dashboard está presente
      const dashboardTitle = screen.getByText(/ChurrasApp Dashboard/i);
      expect(dashboardTitle).toBeInTheDocument();
    });

    test('has basic structure elements', () => {
      render(<App />);
      
      // Verificar se existe uma estrutura básica
      const appDiv = document.querySelector('.App');
      expect(appDiv).toBeInTheDocument();
      
      // Verificar se navbar está presente
      const navbar = document.querySelector('.navbar');
      expect(navbar).toBeInTheDocument();
      
      // Verificar se main content está presente
      const mainContent = document.querySelector('.App-main');
      expect(mainContent).toBeInTheDocument();
    });

    test('renders dashboard components', () => {
      render(<App />);
      
      // Verificar se elementos específicos do dashboard estão presentes
      const statsGrid = document.querySelector('.statsGrid');
      expect(statsGrid).toBeInTheDocument();
      
      const actionsGrid = document.querySelector('.actionsGrid');
      expect(actionsGrid).toBeInTheDocument();
      
      const createEventButton = screen.getByText(/Criar Evento/i);
      expect(createEventButton).toBeInTheDocument();
      
      const recentActivitySection = document.querySelector('.recentActivity');
      expect(recentActivitySection).toBeInTheDocument();
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
