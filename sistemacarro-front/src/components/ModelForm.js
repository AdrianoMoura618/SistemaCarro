import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { modelosService, marcasService } from '../api/api';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  &:hover { background: #444; }
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 0.875rem;
`;

export default function ModelForm() {
    const [formData, setFormData] = useState({
        nome: '',
        id_marca: ''
    });
    const [marcas, setMarcas] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const carregarMarcas = async () => {
            try {
                const response = await marcasService.getAll();
                setMarcas(response.data);
            } catch (erro) {
                console.error('Erro ao carregar marcas:', erro);
                setError('Erro ao carregar marcas');
            }
        };

        carregarMarcas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Garantindo que o id_marca seja um número e que todos os campos necessários existam
            const modeloData = {
                nome: formData.nome.trim(),
                marca: {
                    id: parseInt(formData.id_marca, 10)
                }
            };

            console.log('Tentando criar modelo com dados:', modeloData);

            const response = await modelosService.create(modeloData);
            console.log('Resposta do servidor:', response.data);

            setSuccess('Modelo adicionado com sucesso!');
            setFormData({
                nome: '',
                id_marca: ''
            });
        } catch (erro) {
            console.error('Erro ao criar modelo:', {
                status: erro.response?.status,
                data: erro.response?.data,
                message: erro.message
            });

            // Melhorando a mensagem de erro para o usuário
            let mensagemErro = 'Erro ao adicionar modelo.';
            if (erro.response?.data?.message) {
                mensagemErro += ` Detalhe: ${erro.response.data.message}`;
            }
            setError(mensagemErro);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                name="nome"
                placeholder="Nome do Modelo"
                value={formData.nome}
                onChange={handleChange}
                disabled={loading}
            />

            <Select
                name="id_marca"
                value={formData.id_marca}
                onChange={handleChange}
                disabled={loading}
            >
                <option value="">Selecione uma marca</option>
                {marcas.map(marca => (
                    <option key={marca.id} value={marca.id}>
                        {marca.nome}
                    </option>
                ))}
            </Select>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <Button type="submit" disabled={loading}>
                {loading ? 'Adicionando...' : 'Adicionar Modelo'}
            </Button>
        </Form>
    );
}