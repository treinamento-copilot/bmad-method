/**
 * @fileoverview Testes do componente EventForm
 * @author Dev Agent
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventForm from './components/event/EventForm';

describe('EventForm Component', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('Rendering', () => {
    test('should render all required form fields', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText(/nome do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/local do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/número estimado de participantes/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /criar evento/i })).toBeInTheDocument();
    });

    test('should display form title', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByText(/criar novo evento de churrasco/i)).toBeInTheDocument();
    });

    test('should show loading state', () => {
      render(<EventForm onSubmit={mockOnSubmit} isLoading={true} />);
      
      const submitButton = screen.getByRole('button');
      expect(submitButton).toHaveTextContent(/criando evento/i);
      expect(submitButton).toBeDisabled();
    });

    test('should show error message', () => {
      const errorMessage = 'Erro de teste';
      render(<EventForm onSubmit={mockOnSubmit} error={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('should show validation errors for empty required fields', async () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /criar evento/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/nome do evento é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/data do evento é obrigatória/i)).toBeInTheDocument();
        expect(screen.getByText(/local do evento é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/número de participantes é obrigatório/i)).toBeInTheDocument();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate name field length', async () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/nome do evento/i);
      
      // Nome muito curto
      fireEvent.change(nameInput, { target: { value: 'AB' } });
      const submitButton = screen.getByRole('button', { name: /criar evento/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/nome do evento deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
      });
    });

    test('should validate participants number range', async () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      const participantsInput = screen.getByLabelText(/número estimado de participantes/i);
      
      // Número inválido
      fireEvent.change(participantsInput, { target: { value: '0' } });
      const submitButton = screen.getByRole('button', { name: /criar evento/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/deve ter pelo menos 1 participante/i)).toBeInTheDocument();
      });
    });

    test('should validate maximum participants', async () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      const participantsInput = screen.getByLabelText(/número estimado de participantes/i);
      
      // Número muito alto
      fireEvent.change(participantsInput, { target: { value: '100' } });
      const submitButton = screen.getByRole('button', { name: /criar evento/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/máximo de 50 participantes permitido/i)).toBeInTheDocument();
      });
    });
  });

  describe('Automatic Item Calculation', () => {
    test('should display calculated items when participants number is entered', async () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      const participantsInput = screen.getByLabelText(/número estimado de participantes/i);
      fireEvent.change(participantsInput, { target: { value: '10' } });
      
      await waitFor(() => {
        expect(screen.getByText(/itens básicos \(calculados automaticamente\)/i)).toBeInTheDocument();
        expect(screen.getByText(/picanha/i)).toBeInTheDocument();
        expect(screen.getByText(/cerveja/i)).toBeInTheDocument();
        expect(screen.getByText(/carvão/i)).toBeInTheDocument();
        expect(screen.getByText(/total estimado/i)).toBeInTheDocument();
      });
    });

    test('should calculate correct quantities for 10 participants', async () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      const participantsInput = screen.getByLabelText(/número estimado de participantes/i);
      fireEvent.change(participantsInput, { target: { value: '10' } });
      
      await waitFor(() => {
        // Picanha: 0.4kg x 10 = 4kg
        expect(screen.getByText(/4 kg/i)).toBeInTheDocument();
        // Cerveja: 2 unidades x 10 = 20 unidades
        expect(screen.getByText(/20 unidade/i)).toBeInTheDocument();
        // Carvão: 0.25kg x 10 = 2.5kg
        expect(screen.getByText(/2\.5 kg/i)).toBeInTheDocument();
      });
    });

    test('should hide items preview when participants is cleared', async () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      const participantsInput = screen.getByLabelText(/número estimado de participantes/i);
      fireEvent.change(participantsInput, { target: { value: '10' } });
      
      await waitFor(() => {
        expect(screen.getByText(/itens básicos/i)).toBeInTheDocument();
      });
      
      fireEvent.change(participantsInput, { target: { value: '' } });
      
      await waitFor(() => {
        expect(screen.queryByText(/itens básicos/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper labels and roles', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);
      
      // Verificar se todos os campos têm labels associados
      expect(screen.getByLabelText(/nome do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/local do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/número estimado de participantes/i)).toBeInTheDocument();
      
      // Verificar se o botão tem role correto
      expect(screen.getByRole('button', { name: /criar evento/i })).toBeInTheDocument();
    });
  });
});