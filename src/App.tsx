import React from 'react';
import Login from './components/login';
import CadastroPizza from './components/cadastroPizza';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-pizza" element={<CadastroPizza />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;