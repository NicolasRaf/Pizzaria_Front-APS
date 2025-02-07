import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface Pizza {
    id: number;
    flavor: string;
    size: string;
    price: number;
}

interface Pedido {
    pizzaId: number;
    flavor: string;
    size: string;
    quantity: number;
}

interface ApiPizza {
    id: number;
    flavor: string;
    size: string;
    price: number;
}

interface CustomerOrderRequestDTO {
    customerId: number;
    orders: { pizzaId: number; quantity: number }[];
}

const CadastroPedido: React.FC = () => {
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const [sabores, setSabores] = useState<string[]>([]);
    const [sabor, setSabor] = useState("");
    const [tamanho, setTamanho] = useState("");
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const customerId = queryParams.get("customerId");
    
    useEffect(() => {
        if (!import.meta.env.VITE_API_URL) {
            alert("Erro: a variável de ambiente VITE_API_URL não está definida");
            return;
        }

        const fetchPizzas = async () => {
            try {
                const response = await axios.get<ApiPizza[]>(`${import.meta.env.VITE_API_URL}/pizzas`);
                const pizzasData: Pizza[] = response.data.map((pizza) => ({
                    id: pizza.id,
                    flavor: pizza.flavor,
                    size: pizza.size,
                    price: pizza.price,
                }));
                setPizzas(pizzasData);
                const uniqueFlavors = [...new Set(response.data.map((pizza) => pizza.flavor))];
                setSabores(uniqueFlavors);
            } catch (error) {
                alert(`Erro ao buscar pizzas na API: ${error}`);
            }
        };

        fetchPizzas();
    }, []);

    const adicionarPedido = () => {
        const pizzaSelecionada = pizzas.find((p) => p.flavor === sabor && p.size === tamanho);
        if (pizzaSelecionada) {
            const pedidoExistente = pedidos.find((p) => p.pizzaId === pizzaSelecionada.id);
            if (pedidoExistente) {
                const novosPedidos = pedidos.map((pedido) =>
                    pedido.pizzaId === pizzaSelecionada.id
                        ? { ...pedido, quantity: pedido.quantity + 1 }
                        : pedido
                );
                setPedidos(novosPedidos);
            } else {
                const novoPedido: Pedido = {
                    pizzaId: pizzaSelecionada.id,
                    flavor: pizzaSelecionada.flavor,
                    size: pizzaSelecionada.size,
                    quantity: 1,
                };
                setPedidos([...pedidos, novoPedido]);
            }
            setSabor("");
            setTamanho("");
        } else {
            alert("Pizza não encontrada");
        }
    };

    const cadastrarPedido = async () => {
        const orderData: CustomerOrderRequestDTO = {
            customerId: Number(customerId),
            orders: pedidos.map((pedido) => ({
                pizzaId: pedido.pizzaId,
                quantity: pedido.quantity,
            })),
        };

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/orders/create`, orderData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            alert("Pedido cadastrado com sucesso!");
            setPedidos([]);
            navigate('/cadastro-cliente');
        } catch (error) {
            alert(`Erro ao cadastrar pedido: ${error}`);
        }
    };

    const removerPedido = (pizzaId: number) => {
        setPedidos(pedidos.filter((pedido) => pedido.pizzaId !== pizzaId));
    };

    const totalPedido = pedidos.reduce((total, pedido) => {
        const pizzaSelecionada = pizzas.find(p => p.id === pedido.pizzaId);
        return total + (pizzaSelecionada ? pizzaSelecionada.price * pedido.quantity : 0);
    }, 0);

    return (
        <div className="pedido-container">
            <h2>Realizar Pedido</h2>
            <form>
                <label>
                    Sabor da Pizza:
                    <select value={sabor} onChange={(e) => setSabor(e.target.value)} required>
                        <option value="">Selecione um sabor</option>
                        {sabores.map((flavor) => (
                            <option key={flavor} value={flavor}>{flavor}</option>
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
                <button type="button" onClick={adicionarPedido}>Adicionar Pedido</button>
            </form>

            <h3>Pedidos Realizados</h3>
            <table className="pedido-tabela">
                <thead>
                    <tr>
                        <th>Sabor</th>
                        <th>Tamanho</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => {
                        const pizzaSelecionada = pizzas.find(p => p.id === pedido.pizzaId);
                        return (
                            <tr key={pedido.pizzaId} className="pedido-item">
                                <td>{pedido.flavor}</td>
                                <td>{pedido.size === "MEDIUM" ? "Média" : pedido.size === "LARGE" ? "Grande" : "Gigante"}</td>
                                <td>{pedido.quantity}</td>
                                <td>R$ {(pizzaSelecionada?.price || 0) * pedido.quantity}</td>
                                <td><FaTimes className="remover" onClick={() => removerPedido(pedido.pizzaId)} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <h3 className="total-pedido">Total do Pedido: R$ {totalPedido.toFixed(2)}</h3>

            <button className="cadastrar-pedido" onClick={cadastrarPedido}>Cadastrar Pedido</button>
        </div>
    );
};

export default CadastroPedido;
