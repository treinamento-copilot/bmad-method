import React from 'react';
import { Navbar, Dashboard } from './components';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="App-main">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
