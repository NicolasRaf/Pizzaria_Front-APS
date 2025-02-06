import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
      if (response.status === 200) {
        navigate('/cadastro-pizza');
      }
    } catch (error) {
      alert('Usuário ou senha inválidos');
      console.error('Login falhou:', error);
    }
  };

  return (
      <form onSubmit={handleLogin}>
    <h2>{process.env.REACT_APP_API_URL || "API URL não definida"}</h2> {/* Caso a variável esteja indefinida */}
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
