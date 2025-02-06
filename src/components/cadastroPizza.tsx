import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

interface Pizza {
  id: number;
  sabor: string;
  tamanho: string;
  preco: number;
  quantidade: number;
}

const CadastroPizza: React.FC = () => {
  const [sabor, setSabor] = useState('');
  const [tamanho, setTamanho] = useState('Média');
  const [pizzas, setPizzas] = useState<Pizza[]>([]);

  useEffect(() => {
    // Buscar pizzas cadastradas na API ao carregar o componente
    const fetchPizzas = async () => {
      try {
        const response = await axios.get(`${process.env.VITE_API_URL}/pizzas`);
        setPizzas(response.data);
      } catch (error) {
        console.error('Erro ao buscar pizzas:', error);
      }
    };

    fetchPizzas();
  }, []);

  const sabores = [
    { nome: 'Calabresa', preco: 25.00 },
    { nome: 'Mussarela', preco: 22.00 },
    { nome: 'Portuguesa', preco: 28.00 },
    { nome: 'Frango com Catupiry', preco: 30.00 },
    { nome: 'Marguerita', preco: 27.00 }
  ];

  const handleCadastro = async (event: React.FormEvent) => {
    event.preventDefault();
    const saborSelecionado = sabores.find(s => s.nome === sabor);
    if (saborSelecionado) {
      const index = pizzas.findIndex(p => p.sabor === saborSelecionado.nome && p.tamanho === tamanho);
      if (index !== -1) {
        // Se a pizza já existe, aumenta a quantidade
        const novasPizzas = [...pizzas];
        novasPizzas[index].quantidade += 1;
        setPizzas(novasPizzas);
      } else {
        // Se a pizza não existe, adiciona uma nova pizza
        const novaPizza: Pizza = {
          id: new Date().getTime(),
          sabor: saborSelecionado.nome,
          tamanho,
          preco: saborSelecionado.preco,
          quantidade: 1
        };
        try {
          const response = await axios.post(`${process.env.VITE_API_URL}/pizzas`, novaPizza);
          setPizzas([...pizzas, response.data]);
          alert('Pizza cadastrada com sucesso!');
        } catch (error) {
          console.error('Erro ao cadastrar pizza:', error);
        }
      }
      setSabor('');
      setTamanho('Média');
    }
  };

  const handleRemover = async (id: number) => {
    try {
      await axios.delete(`${process.env.VITE_API_URL}/pizzas/${id}`);
      setPizzas(pizzas.filter(pizza => pizza.id !== id));
    } catch (error) {
      console.error('Erro ao remover pizza:', error);
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
            {sabores.map((sabor) => (
              <option key={sabor.nome} value={sabor.nome}>
                {sabor.nome} (R$ {sabor.preco.toFixed(2)})
              </option>
            ))}
          </select>
        </label>
        <label>
          Tamanho da Pizza:
          <select value={tamanho} onChange={(e) => setTamanho(e.target.value)}>
            <option value="Média">Média</option>
            <option value="Grande">Grande</option>
            <option value="Gigante">Gigante</option>
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
              <td>{pizza.sabor}</td>
              <td>{pizza.tamanho}</td>
              <td>R$ {pizza.preco.toFixed(2)}</td>
              <td><FaTimes className="remover" onClick={() => handleRemover(pizza.id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CadastroPizza;
