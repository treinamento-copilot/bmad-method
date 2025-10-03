import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateEvent from './pages/CreateEvent';
import EventsListPage from './pages/EventsListPage';
import './App.css';

/**
 * Componente principal da aplicação
 * Configura roteamento e layout base
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota principal - formulário de criação de evento */}
          <Route path="/" element={<CreateEvent />} />
          
          {/* Rota para lista de eventos */}
          <Route path="/events" element={<EventsListPage />} />
          
          {/* Rota para visualizar evento (para futuro uso) */}
          <Route 
            path="/event/:id" 
            element={
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <h1>🎉 Evento Criado com Sucesso!</h1>
                <p>Esta página será implementada em uma próxima story.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Criar Outro Evento
                </button>
              </div>
            } 
          />
          
          {/* Fallback - redireciona para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
