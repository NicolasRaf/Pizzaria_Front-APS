import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Customer {
  customerName: string;
  cpf: string;
  email: string;
  phone: string;
  houseNumber: string;
  street: string;
  zip: string;
}

const CadastroCliente: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [zip, setZip] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleCadastro = async (event: React.FormEvent) => {
    event.preventDefault();

    const newCustomer: Customer = {
      customerName,
      cpf,
      email,
      phone,
      houseNumber,
      street,
      zip,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/customers`, newCustomer, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const customerId = response.data.id;
      setMessage('Cliente cadastrado com sucesso!');
      setCustomerName('');
      setCpf('');
      setEmail('');
      setPhone('');
      setHouseNumber('');
      setStreet('');
      setZip('');
      navigate(`/cadastro-pizza?customerId=${customerId}`);
    } catch (error) {
      setMessage(`Erro ao cadastrar cliente: ${error}`);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Cliente</h2>
      <form onSubmit={handleCadastro}>
        <label>
          Nome:
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </label>
        <label>
          CPF:
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Telefone:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <label>
          Número da Casa:
          <input
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            required
          />
        </label>
        <label>
          Rua:
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </label>
        <label>
          CEP:
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </label>
        <button type="submit">Cadastrar Cliente</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CadastroCliente;
