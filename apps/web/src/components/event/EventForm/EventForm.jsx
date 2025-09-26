import React, { useState } from 'react';
import styles from './EventForm.module.css';

/**
 * Componente de formulário para criação de eventos de churrasco
 * @param {Object} props - Props do componente
 * @param {Function} props.onSubmit - Callback executado quando o formulário é submetido
 * @param {boolean} props.loading - Indica se o formulário está em estado de loading
 */
const EventForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    estimatedParticipants: ''
  });

  const [errors, setErrors] = useState({});

  /**
   * Valida os dados do formulário
   * @param {Object} data - Dados do formulário
   * @returns {Object} Objeto com erros de validação
   */
  const validateForm = (data) => {
    const newErrors = {};

    if (!data.name?.trim()) {
      newErrors.name = 'Nome do evento é obrigatório';
    } else if (data.name.trim().length > 100) {
      newErrors.name = 'Nome do evento deve ter no máximo 100 caracteres';
    }

    if (!data.date) {
      newErrors.date = 'Data do evento é obrigatória';
    } else {
      const eventDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        newErrors.date = 'Data do evento deve ser hoje ou no futuro';
      }
    }

    if (!data.location?.trim()) {
      newErrors.location = 'Local do evento é obrigatório';
    } else if (data.location.trim().length > 200) {
      newErrors.location = 'Local do evento deve ter no máximo 200 caracteres';
    }

    if (!data.estimatedParticipants) {
      newErrors.estimatedParticipants = 'Número de participantes é obrigatório';
    } else {
      const participants = parseInt(data.estimatedParticipants);
      if (isNaN(participants) || participants < 1) {
        newErrors.estimatedParticipants = 'Número de participantes deve ser pelo menos 1';
      } else if (participants > 50) {
        newErrors.estimatedParticipants = 'Número de participantes não pode exceder 50';
      }
    }

    return newErrors;
  };

  /**
   * Handle para mudanças nos inputs
   * @param {Event} e - Evento do input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handle para submissão do formulário
   * @param {Event} e - Evento do formulário
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      onSubmit({
        ...formData,
        name: formData.name.trim(),
        location: formData.location.trim(),
        estimatedParticipants: parseInt(formData.estimatedParticipants)
      });
    }
  };

  /**
   * Formata a data mínima para o input (hoje)
   * @returns {string} Data no formato YYYY-MM-DD
   */
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Criar Novo Churrasco</h1>
        <p className={styles.subtitle}>
          Preencha os dados básicos para começar a organizar seu evento
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nome do Evento *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Ex: Churrasco da Empresa"
              maxLength="100"
              disabled={loading}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="date" className={styles.label}>
              Data do Evento *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
              min={getMinDate()}
              disabled={loading}
            />
            {errors.date && <span className={styles.errorMessage}>{errors.date}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="location" className={styles.label}>
              Local do Evento *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
              placeholder="Ex: Chácara do João, Rua das Flores 123"
              maxLength="200"
              disabled={loading}
            />
            {errors.location && <span className={styles.errorMessage}>{errors.location}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="estimatedParticipants" className={styles.label}>
              Número Estimado de Pessoas *
            </label>
            <input
              type="number"
              id="estimatedParticipants"
              name="estimatedParticipants"
              value={formData.estimatedParticipants}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.estimatedParticipants ? styles.inputError : ''}`}
              placeholder="Ex: 10"
              min="1"
              max="50"
              disabled={loading}
            />
            {errors.estimatedParticipants && (
              <span className={styles.errorMessage}>{errors.estimatedParticipants}</span>
            )}
            <small className={styles.inputHint}>
              Isso nos ajuda a calcular automaticamente as quantidades necessárias
            </small>
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
            disabled={loading}
          >
            {loading ? 'Criando Evento...' : 'Criar Evento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;