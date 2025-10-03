import React, { useState, useEffect } from 'react';
import { eventService } from '../../../services/eventService';
import styles from './EventsList.module.css';

/**
 * Componente para visualizar e gerenciar lista de eventos
 * Permite edição, adição e exclusão de eventos
 */
const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [newEventData, setNewEventData] = useState({
    name: '',
    date: '',
    location: '',
    estimatedParticipants: ''
  });

  // Carregar eventos na inicialização
  useEffect(() => {
    loadEvents();
  }, []);

  /**
   * Carrega a lista de eventos da API
   */
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.listEvents();
      setEvents(response.data || []);
    } catch (err) {
      setError(`Erro ao carregar eventos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicia a edição de um evento
   */
  const startEdit = (event) => {
    setEditingEvent({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0]
    });
  };

  /**
   * Cancela a edição
   */
  const cancelEdit = () => {
    setEditingEvent(null);
  };

  /**
   * Salva as alterações do evento
   */
  const saveEvent = async () => {
    try {
      setError(null);
      await eventService.updateEvent(editingEvent._id, {
        name: editingEvent.name,
        date: editingEvent.date,
        location: editingEvent.location,
        estimatedParticipants: parseInt(editingEvent.estimatedParticipants)
      });
      
      setEditingEvent(null);
      await loadEvents(); // Recarrega a lista
    } catch (err) {
      setError(`Erro ao salvar evento: ${err.message}`);
    }
  };

  /**
   * Exclui um evento com confirmação
   */
  const deleteEvent = async (eventId, eventName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o evento "${eventName}"?`)) {
      return;
    }

    try {
      setError(null);
      await eventService.deleteEvent(eventId);
      await loadEvents(); // Recarrega a lista
    } catch (err) {
      setError(`Erro ao excluir evento: ${err.message}`);
    }
  };

  /**
   * Cria um novo evento
   */
  const createNewEvent = async () => {
    try {
      setError(null);
      await eventService.createEvent(newEventData);
      
      setNewEventData({
        name: '',
        date: '',
        location: '',
        estimatedParticipants: ''
      });
      setShowNewEventForm(false);
      await loadEvents(); // Recarrega a lista
    } catch (err) {
      setError(`Erro ao criar evento: ${err.message}`);
    }
  };

  /**
   * Atualiza os dados do evento sendo editado
   */
  const handleEditChange = (field, value) => {
    setEditingEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Atualiza os dados do novo evento
   */
  const handleNewEventChange = (field, value) => {
    setNewEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Formata a data para exibição
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  /**
   * Obtém a data mínima para inputs (hoje)
   */
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando eventos...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Meus Eventos</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowNewEventForm(true)}
        >
          + Novo Evento
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)} className={styles.closeError}>×</button>
        </div>
      )}

      {/* Formulário para novo evento */}
      {showNewEventForm && (
        <div className={styles.newEventForm}>
          <h3>Criar Novo Evento</h3>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Nome do evento"
              value={newEventData.name}
              onChange={(e) => handleNewEventChange('name', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="date"
              value={newEventData.date}
              min={getMinDate()}
              onChange={(e) => handleNewEventChange('date', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Local do evento"
              value={newEventData.location}
              onChange={(e) => handleNewEventChange('location', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="number"
              placeholder="Número de participantes"
              min="1"
              value={newEventData.estimatedParticipants}
              onChange={(e) => handleNewEventChange('estimatedParticipants', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formActions}>
            <button 
              onClick={createNewEvent}
              className={styles.saveButton}
              disabled={!newEventData.name || !newEventData.date || !newEventData.location || !newEventData.estimatedParticipants}
            >
              Criar Evento
            </button>
            <button 
              onClick={() => setShowNewEventForm(false)}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de eventos */}
      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum evento criado ainda.</p>
          <p>Clique em "Novo Evento" para começar!</p>
        </div>
      ) : (
        <div className={styles.eventsList}>
          {events.map(event => (
            <div key={event._id} className={styles.eventCard}>
              {editingEvent && editingEvent._id === event._id ? (
                // Modo de edição
                <div className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      value={editingEvent.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="date"
                      value={editingEvent.date}
                      min={getMinDate()}
                      onChange={(e) => handleEditChange('date', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => handleEditChange('location', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="number"
                      min="1"
                      value={editingEvent.estimatedParticipants}
                      onChange={(e) => handleEditChange('estimatedParticipants', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button onClick={saveEvent} className={styles.saveButton}>
                      Salvar
                    </button>
                    <button onClick={cancelEdit} className={styles.cancelButton}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo de visualização
                <div className={styles.eventInfo}>
                  <div className={styles.eventHeader}>
                    <h3 className={styles.eventName}>{event.name}</h3>
                    <div className={styles.eventActions}>
                      <button 
                        onClick={() => startEdit(event)}
                        className={styles.editButton}
                        title="Editar evento"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteEvent(event._id, event.name)}
                        className={styles.deleteButton}
                        title="Excluir evento"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className={styles.eventDetails}>
                    <p><strong>Data:</strong> {formatDate(event.date)}</p>
                    <p><strong>Local:</strong> {event.location}</p>
                    <p><strong>Participantes:</strong> {event.estimatedParticipants} pessoa(s)</p>
                    <p><strong>Status:</strong> {event.status || 'Ativo'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;