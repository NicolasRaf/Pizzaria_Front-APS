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
  const [sabores, setSabores] = useState<string[]>([]);
  const [sabor, setSabor] = useState('');
  const [tamanho, setTamanho] = useState('');

  useEffect(() => {
    // Verificar se a variável de ambiente está definida
    if (!import.meta.env.VITE_API_URL) {
      alert('Erro: a variável de ambiente VITE_API_URL não está definida');
      return;
    }

    // Buscar pizzas na API
    const fetchPizzas = async () => {
      try {
        const response = await axios.get<ApiPizza[]>(`${import.meta.env.VITE_API_URL}/pizzas`);
        alert(`Resposta da API: ${JSON.stringify(response.data)}`);
        const pizzasData: Pizza[] = response.data.map((pizza) => ({
          id: pizza.id,
          flavor: pizza.flavor,
          size: pizza.size,
          price: pizza.price,
          quantidade: 1, // Inicializando a quantidade como 1
        }));
        alert(JSON.stringify(pizzasData));
        setPizzas(pizzasData);

        // Obter lista de sabores únicos
        const uniqueFlavors = [...new Set(response.data.map(pizza => pizza.flavor))];
        alert(`Sabores únicos: ${uniqueFlavors}`);
        setSabores(uniqueFlavors);
      } catch (error) {
        alert(`Erro ao buscar pizzas na API: ${error}`);
      }
    };

    fetchPizzas();
  }, []);

  const handleCadastro = async (event: React.FormEvent) => {
    event.preventDefault();

    const pizzaSelecionada = pizzas.find(p => p.flavor === sabor && p.size === tamanho);
    if (pizzaSelecionada) {
      const novasPizzas = [...pizzas];
      const index = novasPizzas.findIndex(p => p.id === pizzaSelecionada.id);
      novasPizzas[index].quantidade += 1;
      setPizzas(novasPizzas);

      // Criar uma nova ordem na API
      const orderData: CustomerOrderRequestDTO = {
        pizzas: novasPizzas.map(pizza => ({
          id: pizza.id,
          quantidade: pizza.quantidade
        }))
      };

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/orders/create`, orderData);
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${id}`);
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
            {sabores.map((flavor) => (
              <option key={flavor} value={flavor}>
                {flavor}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tamanho da Pizza:
          <select value={tamanho} onChange={(e) => setTamanho(e.target.value)} required>
            <option value="">Selecione um tamanho</option>
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
