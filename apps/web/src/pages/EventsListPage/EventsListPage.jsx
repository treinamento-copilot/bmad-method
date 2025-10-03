import React from 'react';
import EventsList from '../../components/event/EventsList';
import styles from './EventsListPage.module.css';

/**
 * Página para visualizar e gerenciar lista de eventos
 * Página principal da aplicação para gerenciar eventos
 */
const EventsListPage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.navigation}>
          <button 
            onClick={() => window.location.href = '/'}
            className={styles.navButton}
          >
            ← Criar Evento
          </button>
        </div>
      </header>
      
      <main className={styles.main}>
        <EventsList />
      </main>
    </div>
  );
};

export default EventsListPage;