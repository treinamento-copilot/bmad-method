import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../../components/event/EventForm';
import eventService from '../../services/eventService';
import styles from './CreateEvent.module.css';

/**
 * Página de criação de evento
 * Integra o componente EventForm com a lógica de criação via API
 */
const CreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Handle para submissão do formulário de criação de evento
   * @param {Object} eventData - Dados do evento do formulário
   */
  const handleCreateEvent = async (eventData) => {
    setLoading(true);
    setError(null);

    try {
      // Chama o service para criar o evento
      const createdEvent = await eventService.createEvent(eventData);
      
      // Redireciona para a página do evento criado
      if (createdEvent?.id) {
        navigate(`/event/${createdEvent.id}`);
      } else {
        throw new Error('Evento criado mas ID não retornado');
      }

    } catch (err) {
      console.error('Erro ao criar evento:', err);
      
      // Trata diferentes tipos de erro
      let errorMessage = 'Erro inesperado ao criar evento. Tente novamente.';
      
      if (err.name === 'ApiError') {
        if (err.status === 400) {
          errorMessage = err.message || 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (err.status === 500) {
          errorMessage = 'Erro no servidor. Tente novamente em alguns minutos.';
        } else if (err.status === 0) {
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          errorMessage = err.message || 'Erro ao criar evento.';
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Exibe erro se houver */}
      {error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>
            <strong>⚠️ Ops! Algo deu errado</strong>
            <p>{error}</p>
            <button 
              className={styles.errorButton}
              onClick={() => setError(null)}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Formulário de criação */}
      <EventForm 
        onSubmit={handleCreateEvent}
        loading={loading}
      />

      {/* Loading overlay */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            <p>Criando seu evento...</p>
            <small>Estamos configurando tudo para você!</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;