import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import CadastroPizza from './components/cadastroPizza';
import CadastroCliente from './components/cadastroCliente';
import './styles.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-pizza" element={<CadastroPizza />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
