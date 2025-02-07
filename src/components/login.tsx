import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (username === 'xama' || username === 'nicolas' && password === 'admin') {
      navigate('/cadastro-pizza');
    } else {
      alert('Usuário ou senha incorretos.');
    }

  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <label>
        Usuário:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Senha:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Login;
