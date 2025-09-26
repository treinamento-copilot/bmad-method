/**
 * @fileoverview Componente EventForm - Formulário de criação de eventos
 * @author Dev Agent
 */

import React, { useState, useEffect } from 'react';
import { calculateEventItems } from '../../../utils/constants';
import styles from './EventForm.module.css';

/**
 * Componente de formulário para criação de eventos
 * @param {Object} props - Props do componente
 * @param {Function} props.onSubmit - Callback chamado ao submeter o formulário
 * @param {boolean} props.isLoading - Indica se está carregando
 * @param {string} props.error - Mensagem de erro
 * @returns {JSX.Element} Componente EventForm
 */
const EventForm = ({ onSubmit, isLoading = false, error = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    estimatedParticipants: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [calculatedItems, setCalculatedItems] = useState([]);

  /**
   * Calcula itens automáticos quando o número de participantes muda
   */
  useEffect(() => {
    if (formData.estimatedParticipants && parseInt(formData.estimatedParticipants) > 0) {
      const items = calculateEventItems(parseInt(formData.estimatedParticipants));
      setCalculatedItems(items);
    } else {
      setCalculatedItems([]);
    }
  }, [formData.estimatedParticipants]);

  /**
   * Manipula mudanças nos campos do formulário
   * @param {Event} e - Evento de mudança
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro de validação quando o campo é alterado
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Valida o formulário
   * @returns {boolean} true se válido, false caso contrário
   */
  const validateForm = () => {
    const errors = {};

    // Validar nome
    if (!formData.name.trim()) {
      errors.name = 'Nome do evento é obrigatório';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Nome do evento deve ter pelo menos 3 caracteres';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Nome do evento deve ter no máximo 100 caracteres';
    }

    // Validar data
    if (!formData.date) {
      errors.date = 'Data do evento é obrigatória';
    } else {
      const eventDate = new Date(formData.date);
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
      
      if (eventDate <= now) {
        errors.date = 'Data do evento deve ser no futuro';
      }
    }

    // Validar local
    if (!formData.location.trim()) {
      errors.location = 'Local do evento é obrigatório';
    } else if (formData.location.trim().length < 5) {
      errors.location = 'Local deve ter pelo menos 5 caracteres';
    } else if (formData.location.trim().length > 200) {
      errors.location = 'Local deve ter no máximo 200 caracteres';
    }

    // Validar participantes
    const participants = parseInt(formData.estimatedParticipants);
    if (!formData.estimatedParticipants) {
      errors.estimatedParticipants = 'Número de participantes é obrigatório';
    } else if (isNaN(participants) || participants < 1) {
      errors.estimatedParticipants = 'Deve ter pelo menos 1 participante';
    } else if (participants > 50) {
      errors.estimatedParticipants = 'Máximo de 50 participantes permitido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Manipula o envio do formulário
   * @param {Event} e - Evento de envio
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const eventData = {
      ...formData,
      name: formData.name.trim(),
      location: formData.location.trim(),
      estimatedParticipants: parseInt(formData.estimatedParticipants),
      items: calculatedItems
    };

    onSubmit(eventData);
  };

  /**
   * Formatar valor monetário para exibição
   * @param {number} value - Valor em centavos
   * @returns {string} Valor formatado
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Criar Novo Evento de Churrasco</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nome do Evento *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`${styles.input} ${validationErrors.name ? styles.inputError : ''}`}
            placeholder="Ex: Churrasco de Final de Ano"
            disabled={isLoading}
          />
          {validationErrors.name && (
            <span className={styles.fieldError}>{validationErrors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date" className={styles.label}>
            Data do Evento *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`${styles.input} ${validationErrors.date ? styles.inputError : ''}`}
            disabled={isLoading}
          />
          {validationErrors.date && (
            <span className={styles.fieldError}>{validationErrors.date}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>
            Local do Evento *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`${styles.input} ${validationErrors.location ? styles.inputError : ''}`}
            placeholder="Ex: Sítio do João, Rua das Flores, 123"
            disabled={isLoading}
          />
          {validationErrors.location && (
            <span className={styles.fieldError}>{validationErrors.location}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="estimatedParticipants" className={styles.label}>
            Número Estimado de Participantes *
          </label>
          <input
            type="number"
            id="estimatedParticipants"
            name="estimatedParticipants"
            value={formData.estimatedParticipants}
            onChange={handleInputChange}
            className={`${styles.input} ${validationErrors.estimatedParticipants ? styles.inputError : ''}`}
            placeholder="Ex: 10"
            min="1"
            max="50"
            disabled={isLoading}
          />
          {validationErrors.estimatedParticipants && (
            <span className={styles.fieldError}>{validationErrors.estimatedParticipants}</span>
          )}
        </div>

        {/* Preview dos itens calculados */}
        {calculatedItems.length > 0 && (
          <div className={styles.itemsPreview}>
            <h3 className={styles.previewTitle}>Itens Básicos (Calculados Automaticamente)</h3>
            <div className={styles.itemsList}>
              {calculatedItems.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemCategory}>({item.category})</span>
                  </div>
                  <div className={styles.itemDetails}>
                    <span className={styles.itemQuantity}>
                      {item.quantity} {item.unit}
                    </span>
                    <span className={styles.itemCost}>
                      {formatCurrency(item.estimatedCost * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.totalCost}>
              <strong>
                Total Estimado: {formatCurrency(
                  calculatedItems.reduce((total, item) => total + (item.estimatedCost * item.quantity), 0)
                )}
              </strong>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Criando Evento...' : 'Criar Evento'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;