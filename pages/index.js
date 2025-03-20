import React, { useState } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaEdit, FaTimes } from 'react-icons/fa'; // Ícones de edição e exclusão
import styles from '../styles/home.module.css';

// Registre os componentes necessários do Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); // Estado para edição

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação dos campos
    if (!productName || quantity <= 0 || price <= 0) {
      setError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    setError('');

    const newProduct = {
      name: productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      totalPrice: parseFloat(price) * parseInt(quantity), // Calcula o preço total
    };

    if (editingIndex !== null) {
      // Edita o produto existente
      const updatedProducts = [...products];
      updatedProducts[editingIndex] = newProduct;
      setProducts(updatedProducts);
      setEditingIndex(null);
    } else {
      // Adiciona um novo produto
      setProducts([...products, newProduct]);
    }

    // Limpa os campos
    setProductName('');
    setQuantity('');
    setPrice('');
  };

  const handleEdit = (index) => {
    // Preenche os campos com os dados do produto selecionado
    const product = products[index];
    setProductName(product.name);
    setQuantity(product.quantity);
    setPrice(product.price);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    // Remove o produto da lista
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const calculateAveragePrice = () => {
    if (products.length === 0) return 0;
    const total = products.reduce((sum, product) => sum + product.price, 0);
    return (total / products.length).toFixed(2);
  };

  const calculateTotalProducts = () => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  };

  const calculateTotalValue = () => {
    return products.reduce((sum, product) => sum + product.totalPrice, 0).toFixed(2);
  };

  const chartData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: 'Quantidade',
        data: products.map((product) => product.quantity),
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Preço Total',
        data: products.map((product) => product.totalPrice),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Produtos',
      },
    },
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro de Produtos</h1>

      {/* Formulário de cadastro de produtos */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="NOME DO PRODUTO"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="QUANTIDADE"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="PREÇO UNITÁRIO"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">
          {editingIndex !== null ? 'Editar Produto' : 'Cadastrar'}
        </button>
      </form>

      {/* Listagem de produtos cadastrados */}
      <h2 className={styles.subtitle}>Produtos Cadastrados</h2>
      <ul className={styles.productList}>
        {products.map((product, index) => (
          <li key={index} className={styles.productItem}>
            <span>{product.name}</span>
            <span>Quantidade: {product.quantity}</span>
            <span>Preço Unitário: R$ {product.price.toFixed(2)}</span>
            <span>Preço Total: R$ {product.totalPrice.toFixed(2)}</span>
            <div className={styles.actions}>
              <FaEdit className={styles.editIcon} onClick={() => handleEdit(index)} />
              <FaTimes className={styles.deleteIcon} onClick={() => handleDelete(index)} />
            </div>
          </li>
        ))}
      </ul>

      {/* Gráfico de produtos */}
      <h2 className={styles.subtitle}>Gráfico de Produtos</h2>
      <div className={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Preço médio, total de produtos e valor total */}
      <h2 className={styles.subtitle}>
        Preço Médio: R$ {calculateAveragePrice()} | Total de Produtos: {calculateTotalProducts()} | Valor Total: R$ {calculateTotalValue()}
      </h2>
    </div>
  );
};

export default Home;
