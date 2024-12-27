import React, { useState } from 'react';
import styled from 'styled-components';
import { marcasService } from '../api/api';

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

const Button = styled.button`
  padding: 0.5rem;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background: #444;
  }
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

export default function BrandForm() {
    const [nome, setNome] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!nome.trim()) {
            setError('Por favor, insira um nome para a marca');
            return;
        }

        setLoading(true);
        try {
            await marcasService.create({ nome: nome.trim() });
            setSuccess('Marca adicionada com sucesso!');
            setNome(''); // Limpa o campo de entrada
        } catch (erro) {
            console.error('Erro ao adicionar a marca:', erro);
            setError(erro.response?.data?.message || 'Erro ao adicionar a marca. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                placeholder="Nome da Marca"
                value={nome}
                onChange={(e) => {
                    setNome(e.target.value);
                    setError('');
                    setSuccess('');
                }}
                disabled={loading}
            />

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <Button type="submit" disabled={loading}>
                {loading ? 'Adicionando...' : 'Adicionar Marca'}
            </Button>
        </Form>
    );
}