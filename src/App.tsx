import React from 'react';
import Login from './components/login';
import CadastroPizza from './components/cadastroPizza';
import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-pizza" element={<CadastroPizza />} />
      </Routes>
    </Router>
  );
};

export default App;