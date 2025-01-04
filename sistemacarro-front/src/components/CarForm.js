import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { carrosService, marcasService, modelosService } from '../api/api';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  font-family: "Roboto", serif;
  font-weight: 400;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 0.8rem;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background: #444;
  }
`;

const Label = styled.label`
  font-size: 14px;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
  background-color: ${({ type }) => (type === 'success' ? '#d4edda' : '#f8d7da')};
  color: ${({ type }) => (type === 'success' ? '#155724' : '#721c24')};
  border: 1px solid ${({ type }) => (type === 'success' ? '#c3e6cb' : '#f5c6cb')};
`;

export default function CarForm() {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        ano: '',
        preco: '',
        cor: '',
        quilometragem: '0',
        urlImagem: '',
        disponivel: true
    });

    useEffect(() => {
        loadBrandsAndModels();
    }, []);

    const loadBrandsAndModels = async () => {
        try {
            const [brandsResponse, modelsResponse] = await Promise.all([
                marcasService.getAll(),
                modelosService.getAll()
            ]);

            console.log('Marcas disponíveis:', brandsResponse.data);
            console.log('Modelos disponíveis:', modelsResponse.data);

            setBrands(brandsResponse.data);
            setModels(modelsResponse.data);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            alert('Falha ao carregar marcas e modelos. Por favor, recarregue a página.');
        }
    };

    const formatCarData = (data) => {
        const formattedData = {
            modelo: {
                id: parseInt(data.modelo)
            },
            anoFabricacao: parseInt(data.ano),
            cor: data.cor.trim(),
            preco: parseFloat(data.preco),
            quilometragem: parseInt(data.quilometragem) || 0,
            statusDisponibilidade: data.disponivel ? 'Disponível' : 'Indisponível'
        };

        if (data.urlImagem && data.urlImagem.trim()) {
            formattedData.urlImagem = data.urlImagem.trim();
        }

        console.log('Dados formatados para envio:', formattedData);
        return formattedData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (!formData.modelo || !formData.ano || !formData.cor || !formData.preco) {
                alert('Por favor, preencha todos os campos obrigatórios');
                return;
            }

            const carData = formatCarData(formData);

            console.log('Tentando criar carro com os dados:', {
                modeloSelecionado: models.find(m => m.id === parseInt(formData.modelo))?.nome,
                ...carData
            });

            const response = await carrosService.create(carData);
            console.log('Resposta do servidor:', response.data);

            setFormData({
                marca: '',
                modelo: '',
                ano: '',
                preco: '',
                cor: '',
                quilometragem: '0',
                urlImagem: '',
                disponivel: true
            });

            alert('Carro adicionado com sucesso!');
        } catch (error) {
            console.error('Erro detalhado:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });

            alert('Erro ao adicionar carro. Por favor, verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const filteredModels = formData.marca
        ? models.filter(model => model.marca.id === parseInt(formData.marca))
        : models;

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="URL imagem"
                value={formData.urlImagem}
                onChange={e => setFormData({ ...formData, urlImagem: e.target.value })}
            />
            <Select
                value={formData.marca}
                onChange={e => setFormData({ ...formData, marca: e.target.value, modelo: '' })}
                required
                disabled={loading}
            >
                <option value="">Selecione a Marca do Carro</option>
                {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                        {brand.nome}
                    </option>
                ))}
            </Select>

            <Select
                value={formData.modelo}
                onChange={e => setFormData({ ...formData, modelo: e.target.value })}
                required
                disabled={loading || !formData.marca}
            >
                <option value="">Selecione o Modelo do Carro</option>
                {filteredModels.map(model => (
                    <option key={model.id} value={model.id}>
                        {model.nome}
                    </option>
                ))}
            </Select>

            <Input
                type="number"
                placeholder="Ano de fabricação"
                value={formData.ano}
                onChange={e => setFormData({ ...formData, ano: e.target.value })}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                disabled={loading}
            />
            <Input
                type="number"
                step="0.01"
                placeholder="Preço"
                value={formData.preco}
                onChange={e => setFormData({ ...formData, preco: e.target.value })}
                required
                min="0"
                disabled={loading}
            />
            <Input
                type="text"
                placeholder="Cor"
                value={formData.cor}
                onChange={e => setFormData({ ...formData, cor: e.target.value })}
                required
                disabled={loading}
            />
            <Input
                type="number"
                placeholder="Quilometragem"
                value={formData.quilometragem}
                onChange={e => setFormData({ ...formData, quilometragem: e.target.value })}
                min="0"
                disabled={loading}
            />
            <Label>
                <input
                    type="checkbox"
                    checked={formData.disponivel}
                    onChange={e => setFormData({ ...formData, disponivel: e.target.checked })}
                    disabled={loading}
                />
                Disponível
            </Label>

            <Button type="submit" disabled={loading}>
                {loading ? 'Adicionando...' : 'Adicionar Carro'}
            </Button>
        </Form>
    );
}
