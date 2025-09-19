/**
 * @fileoverview Testes para o componente Dashboard
 */

import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  test('renders without crashing', () => {
    render(<Dashboard />);
    
    const dashboardContainer = document.querySelector('.dashboardContainer');
    expect(dashboardContainer).toBeInTheDocument();
  });

  test('displays dashboard title and subtitle', () => {
    render(<Dashboard />);
    
    const title = screen.getByText(/ChurrasApp Dashboard/i);
    expect(title).toBeInTheDocument();
    
    const subtitle = screen.getByText(/Organize seus churrascos de forma simples e eficiente/i);
    expect(subtitle).toBeInTheDocument();
  });

  test('displays stats cards', () => {
    render(<Dashboard />);
    
    const statsGrid = document.querySelector('.statsGrid');
    expect(statsGrid).toBeInTheDocument();
    
    const statCards = document.querySelectorAll('.statCard');
    expect(statCards).toHaveLength(4);
  });

  test('displays action cards', () => {
    render(<Dashboard />);
    
    const actionsGrid = document.querySelector('.actionsGrid');
    expect(actionsGrid).toBeInTheDocument();
    
    const actionCards = document.querySelectorAll('.actionCard');
    expect(actionCards).toHaveLength(3);
  });

  test('displays action buttons', () => {
    render(<Dashboard />);
    
    const createEventBtn = screen.getByRole('button', { name: /Criar Evento/i });
    expect(createEventBtn).toBeInTheDocument();
    
    const manageGuestsBtn = screen.getByRole('button', { name: /Gerenciar Convidados/i });
    expect(manageGuestsBtn).toBeInTheDocument();
    
    const shoppingListBtn = screen.getByRole('button', { name: /Ver Lista/i });
    expect(shoppingListBtn).toBeInTheDocument();
  });

  test('displays empty state for recent activity', () => {
    render(<Dashboard />);
    
    const emptyState = document.querySelector('.emptyState');
    expect(emptyState).toBeInTheDocument();
    
    const emptyMessage = screen.getByText(/Nenhuma atividade recente/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});