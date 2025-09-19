import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.title}>ChurrasApp Dashboard</h1>
        <p className={styles.subtitle}>Organize seus churrascos de forma simples e eficiente</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎪</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Eventos</h3>
            <p className={styles.statValue}>0</p>
            <p className={styles.statDescription}>Churrascos organizados</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Convidados</h3>
            <p className={styles.statValue}>0</p>
            <p className={styles.statDescription}>Total de participantes</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Arrecadado</h3>
            <p className={styles.statValue}>R$ 0,00</p>
            <p className={styles.statDescription}>Total em contribuições</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🍖</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Próximo Evento</h3>
            <p className={styles.statValue}>-</p>
            <p className={styles.statDescription}>Nenhum agendado</p>
          </div>
        </div>
      </div>

      <div className={styles.actionsGrid}>
        <div className={styles.actionCard}>
          <h3 className={styles.actionTitle}>Criar Novo Evento</h3>
          <p className={styles.actionDescription}>
            Organize um novo churrasco, defina data, local e quantidade de pessoas
          </p>
          <button className={styles.actionButton}>
            Criar Evento
          </button>
        </div>

        <div className={styles.actionCard}>
          <h3 className={styles.actionTitle}>Gerenciar Convidados</h3>
          <p className={styles.actionDescription}>
            Adicione convidados, controle confirmações e acompanhe pagamentos
          </p>
          <button className={styles.actionButton}>
            Gerenciar Convidados
          </button>
        </div>

        <div className={styles.actionCard}>
          <h3 className={styles.actionTitle}>Lista de Compras</h3>
          <p className={styles.actionDescription}>
            Calcule automaticamente carnes, bebidas e acompanhamentos necessários
          </p>
          <button className={styles.actionButton}>
            Ver Lista
          </button>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Atividade Recente</h2>
        <div className={styles.activityList}>
          <div className={styles.emptyState}>
            <p>Nenhuma atividade recente</p>
            <p className={styles.emptyDescription}>
              Quando você criar seu primeiro evento, as atividades aparecerão aqui
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;