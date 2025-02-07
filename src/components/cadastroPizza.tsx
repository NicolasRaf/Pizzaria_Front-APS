import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

interface Pizza {
  id: number;
  flavor: string;
  size: string;
  price: number;
  quantidade: number;
}

interface ApiPizza {
  id: number;
  flavor: string;
  size: string;
  price: number;
}

interface CustomerOrderRequestDTO {
  pizzas: { id: number; quantidade: number }[];
}

const CadastroPizza: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [sabor, setSabor] = useState('');
  const [tamanho, setTamanho] = useState('MEDIUM');

  useEffect(() => {
    // Buscar pizzas na API
    const fetchPizzas = async () => {
      try {
        const response = await axios.get<ApiPizza[]>(`${process.env.REACT_APP_API_URL}/pizzas`);
        const pizzasData: Pizza[] = response.data.map((pizza) => ({
          ...pizza,
          quantidade: 1, // Inicializando a quantidade como 1
        }));
        setPizzas(pizzasData);
      } catch (error) {
        console.error('Erro ao buscar pizzas:', error);
      }
    };

    fetchPizzas();
  }, []);

  const handleCadastro = async (event: React.FormEvent) => {
    event.preventDefault();

    const index = pizzas.findIndex(p => p.flavor === sabor && p.size === tamanho);
    if (index !== -1) {
      const novasPizzas = [...pizzas];
      novasPizzas[index].quantidade += 1;
      setPizzas(novasPizzas);

      // Atualizar a quantidade na API
      const orderData: CustomerOrderRequestDTO = {
        pizzas: novasPizzas.map(pizza => ({
          id: pizza.id,
          quantidade: pizza.quantidade
        }))
      };

      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/orders/create`, orderData);
        alert('Pizza cadastrada com sucesso!');
      } catch (error) {
        console.error('Erro ao cadastrar pedido:', error);
      }
    } else {
      alert('Pizza não encontrada');
    }
  };

  const handleRemover = async (id: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/orders/${id}`);
      setPizzas(pizzas.filter(pizza => pizza.id !== id));
    } catch (error) {
      console.error('Erro ao remover pedido:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleCadastro}>
        <h2>Cadastro de Pizza</h2>
        <label>
          Sabor da Pizza:
          <select value={sabor} onChange={(e) => setSabor(e.target.value)} required>
            <option value="">Selecione um sabor</option>
            {pizzas.map((pizza) => (
              <option key={pizza.id} value={pizza.flavor}>
                {pizza.flavor}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tamanho da Pizza:
          <select value={tamanho} onChange={(e) => setTamanho(e.target.value)}>
            <option value="MEDIUM">Média</option>
            <option value="LARGE">Grande</option>
            <option value="EXTRA_LARGE">Gigante</option>
          </select>
        </label>
        <button type="submit">Cadastrar</button>
      </form>

      <h3>Pizzas Cadastradas</h3>
      <table className="pizza-tabela">
        <thead>
          <tr>
            <th>Quantidade</th>
            <th>Sabor</th>
            <th>Tamanho</th>
            <th>Preço</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pizzas.map((pizza) => (
            <tr key={pizza.id} className="pizza-item">
              <td>{pizza.quantidade}</td>
              <td>{pizza.flavor}</td>
              <td>
                {pizza.size === 'MEDIUM' ? 'Média' : pizza.size === 'LARGE' ? 'Grande' : 'Gigante'}
              </td>
              <td>R$ {pizza.price.toFixed(2)}</td>
              <td><FaTimes className="remover" onClick={() => handleRemover(pizza.id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CadastroPizza;
