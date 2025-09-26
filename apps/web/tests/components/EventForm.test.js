/**
 * @fileoverview Testes unitários do componente EventForm
 * @author Dev Agent James
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventForm from '../../src/components/event/EventForm';

// Mock CSS Modules
jest.mock('../../src/components/event/EventForm/EventForm.module.css', () => ({}));

describe('EventForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  /**
   * Testa renderização básica do componente
   */
  describe('Renderização', () => {
    test('renderiza todos os campos obrigatórios', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/nome do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/local do evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/número estimado de pessoas/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /criar evento/i })).toBeInTheDocument();
    });

    test('renderiza título e subtítulo corretos', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText('Criar Novo Churrasco')).toBeInTheDocument();
      expect(screen.getByText(/preencha os dados básicos/i)).toBeInTheDocument();
    });

    test('campos têm placeholders apropriados', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      expect(screen.getByPlaceholderText(/churrasco da empresa/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/chácara do joão/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/ex: 10/i)).toBeInTheDocument();
    });
  });

  /**
   * Testa validação de formulário
   */
  describe('Validação', () => {
    test('exibe erro quando nome está vazio', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /criar evento/i });
      await user.click(submitButton);

      expect(screen.getByText('Nome do evento é obrigatório')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('exibe erro quando nome excede 100 caracteres', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/nome do evento/i);
      const longName = 'a'.repeat(101);
      
      await user.type(nameInput, longName);
      await user.click(screen.getByRole('button', { name: /criar evento/i }));

      expect(screen.getByText(/nome do evento deve ter no máximo 100 caracteres/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('exibe erro quando data está vazia', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /criar evento/i });
      await user.click(submitButton);

      expect(screen.getByText('Data do evento é obrigatória')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('exibe erro quando data é no passado', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const dateInput = screen.getByLabelText(/data do evento/i);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      await user.type(dateInput, yesterdayStr);
      await user.click(screen.getByRole('button', { name: /criar evento/i }));

      expect(screen.getByText(/data do evento deve ser hoje ou no futuro/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('exibe erro quando local está vazio', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /criar evento/i });
      await user.click(submitButton);

      expect(screen.getByText('Local do evento é obrigatório')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('exibe erro quando local excede 200 caracteres', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const locationInput = screen.getByLabelText(/local do evento/i);
      const longLocation = 'a'.repeat(201);
      
      await user.type(locationInput, longLocation);
      await user.click(screen.getByRole('button', { name: /criar evento/i }));

      expect(screen.getByText(/local do evento deve ter no máximo 200 caracteres/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('exibe erro quando número de participantes está vazio', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /criar evento/i });
      await user.click(submitButton);

      expect(screen.getByText('Número de participantes é obrigatório')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('exibe erro quando número de participantes é menor que 1', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const participantsInput = screen.getByLabelText(/número estimado de pessoas/i);
      
      await user.type(participantsInput, '0');
      await user.click(screen.getByRole('button', { name: /criar evento/i }));

      expect(screen.getByText(/número de participantes deve ser pelo menos 1/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('exibe erro quando número de participantes excede 50', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const participantsInput = screen.getByLabelText(/número estimado de pessoas/i);
      
      await user.type(participantsInput, '51');
      await user.click(screen.getByRole('button', { name: /criar evento/i }));

      expect(screen.getByText(/número de participantes não pode exceder 50/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  /**
   * Testa interações do usuário
   */
  describe('Interações do Usuário', () => {
    test('limpa erro quando usuário começa a digitar', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      // Submete formulário vazio para gerar erros
      await user.click(screen.getByRole('button', { name: /criar evento/i }));
      expect(screen.getByText('Nome do evento é obrigatório')).toBeInTheDocument();

      // Digita no campo nome
      const nameInput = screen.getByLabelText(/nome do evento/i);
      await user.type(nameInput, 'a');

      // Erro deve desaparecer
      expect(screen.queryByText('Nome do evento é obrigatório')).not.toBeInTheDocument();
    });

    test('submite formulário com dados válidos', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      // Preenche todos os campos
      await user.type(screen.getByLabelText(/nome do evento/i), 'Churrasco da Empresa');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      await user.type(screen.getByLabelText(/data do evento/i), tomorrowStr);
      
      await user.type(screen.getByLabelText(/local do evento/i), 'Chácara do João');
      await user.type(screen.getByLabelText(/número estimado de pessoas/i), '10');

      // Submete formulário
      await user.click(screen.getByRole('button', { name: /criar evento/i }));

      // Verifica se onSubmit foi chamado com dados corretos
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Churrasco da Empresa',
        date: tomorrowStr,
        location: 'Chácara do João',
        estimatedParticipants: 10
      });
    });

    test('trim nos campos de texto', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      // Preenche campos com espaços
      await user.type(screen.getByLabelText(/nome do evento/i), '  Churrasco  ');
      await user.type(screen.getByLabelText(/local do evento/i), '  Chácara  ');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      await user.type(screen.getByLabelText(/data do evento/i), tomorrowStr);
      await user.type(screen.getByLabelText(/número estimado de pessoas/i), '5');

      await user.click(screen.getByRole('button', { name: /criar evento/i }));

      // Verifica se dados foram trimmed
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Churrasco',
        date: tomorrowStr,
        location: 'Chácara',
        estimatedParticipants: 5
      });
    });
  });

  /**
   * Testa estado de loading
   */
  describe('Estado de Loading', () => {
    test('desabilita formulário durante loading', () => {
      render(<EventForm onSubmit={mockOnSubmit} loading={true} />);

      expect(screen.getByLabelText(/nome do evento/i)).toBeDisabled();
      expect(screen.getByLabelText(/data do evento/i)).toBeDisabled();
      expect(screen.getByLabelText(/local do evento/i)).toBeDisabled();
      expect(screen.getByLabelText(/número estimado de pessoas/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /criando evento/i })).toBeDisabled();
    });

    test('exibe texto de loading no botão', () => {
      render(<EventForm onSubmit={mockOnSubmit} loading={true} />);

      expect(screen.getByRole('button', { name: /criando evento/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /criar evento/i })).not.toBeInTheDocument();
    });
  });

  /**
   * Testa data mínima
   */
  describe('Validação de Data', () => {
    test('data mínima é hoje', () => {
      render(<EventForm onSubmit={mockOnSubmit} />);

      const dateInput = screen.getByLabelText(/data do evento/i);
      const today = new Date().toISOString().split('T')[0];
      
      expect(dateInput).toHaveAttribute('min', today);
    });

    test('aceita data de hoje', async () => {
      const user = userEvent.setup();
      render(<EventForm onSubmit={mockOnSubmit} />);

      const today = new Date().toISOString().split('T')[0];
      
      await user.type(screen.getByLabelText(/nome do evento/i), 'Churrasco Hoje');
      await user.type(screen.getByLabelText(/data do evento/i), today);
      await user.type(screen.getByLabelText(/local do evento/i), 'Local Teste');
      await user.type(screen.getByLabelText(/número estimado de pessoas/i), '5');

      await user.click(screen.getByRole('button', { name: /criar evento/i }));

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/data do evento deve ser hoje ou no futuro/i)).not.toBeInTheDocument();
    });
  });
});