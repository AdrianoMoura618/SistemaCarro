import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { carrosService } from '../api/api';

const BarraPesquisa = styled.input`
  width: 98%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
`;

const FiltroSelect = styled.select`
  padding: 0.5rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  border-radius: 6px;
`;

const GradeCarros = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const CartaoCarro = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const Titulo = styled.h3`
  color: #ab0201;
`;

const Imagem = styled.img`
  width: 100%;
  height: 40%;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`;

const ModalConteudo = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 6px;
  width: 400px;
  position: relative;
`;

const BotaoFechar = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #ab0201;
  cursor: pointer;
`;

const ModalFormulario = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const Label = styled.label`
  font-size: 14px;
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

const Icone = styled.i`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 1.2rem;
  color: #ab0201;
  cursor: pointer;
`;
export default function ListaCarros() {
    const [carros, setCarros] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [filtroAno, setFiltroAno] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');
    const [filtroModelo, setFiltroModelo] = useState('');
    const [filtroDisponibilidade, setFiltroDisponibilidade] = useState('todos');
    const [carroSelecionado, setCarroSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);

    useEffect(() => {
        async function buscarCarros() {
            try {
                const resposta = await carrosService.getAll();
                console.log('Estrutura completa dos carros:', resposta.data);
                setCarros(resposta.data || []);
            } catch (erro) {
                console.error('Erro ao buscar carros:', erro);
                setCarros([]);
            }
        }

        buscarCarros();
    }, []);

    const carrosFiltrados = carros
        .filter((carro) => {
            const correspondePesquisa = pesquisa
                ? carro.modelo?.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                carro.modelo?.marca?.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                carro.anoFabricacao.toString().includes(pesquisa)
                : true;

            const correspondeAno = filtroAno ? carro.anoFabricacao.toString() === filtroAno : true;
            const correspondeMarca = filtroMarca ? carro.modelo?.marca?.nome === filtroMarca : true;
            const correspondeModelo = filtroModelo ? carro.modelo?.nome === filtroModelo : true;
            const correspondeDisponibilidade =
                filtroDisponibilidade === 'todos' ||
                filtroDisponibilidade === carro.statusDisponibilidade;

            return (
                correspondePesquisa &&
                correspondeAno &&
                correspondeMarca &&
                correspondeModelo &&
                correspondeDisponibilidade
            );
        })
        .sort((a, b) => {
            if (a.modelo?.nome < b.modelo?.nome) return -1;
            if (a.modelo?.nome > b.modelo?.nome) return 1;
            return 0;
        });

    const abrirModal = (carro) => {
        setCarroSelecionado(carro);
        setModoEdicao(false);
        setMostrarModal(true);
    };

    const fecharModal = () => {
        setMostrarModal(false);
        setCarroSelecionado(null);
    };

    const editarCarro = () => {
        setModoEdicao(true);
    };

    const atualizarCarro = async () => {
        try {
            await carrosService.update(carroSelecionado.id, carroSelecionado);

            setCarros((carrosAnteriores) =>
                carrosAnteriores.map((carro) =>
                    carro.id === carroSelecionado.id ? carroSelecionado : carro
                )
            );

            setModoEdicao(false);
            setMostrarModal(false);
            alert('Carro atualizado com sucesso!');
        } catch (erro) {
            console.error('Erro ao atualizar carro:', erro);
            alert('Não foi possível atualizar o carro. Tente novamente mais tarde.');
        }
    };


    return (
        <>
            <BarraPesquisa
                placeholder="Buscar carros por modelo, ano ou marca..."
                value={pesquisa}
                onChange={e => setPesquisa(e.target.value)}
            />

            <FiltroSelect value={filtroAno} onChange={e => setFiltroAno(e.target.value)}>
                <option value="">Filtrar por Ano</option>
                {[...new Set(carros.map(carro => carro.anoFabricacao))]
                    .sort((a, b) => a - b)
                    .map(ano => (
                        <option key={ano} value={ano}>
                            {ano}
                        </option>
                    ))}

            </FiltroSelect>

            <FiltroSelect value={filtroMarca} onChange={e => setFiltroMarca(e.target.value)}>
                <option value="">Filtrar por Marca</option>
                {carros.length > 0 ? (
                    [...new Set(carros.map(carro => carro.modelo?.marca?.nome).filter(Boolean))]
                        .sort()
                        .map(marca => (
                            <option key={marca} value={marca}>
                                {marca}
                            </option>
                        ))
                ) : (
                    <option disabled>Carregando marcas...</option>
                )}
            </FiltroSelect>

            <FiltroSelect value={filtroModelo} onChange={e => setFiltroModelo(e.target.value)}>
                <option value="">Filtrar por Modelo</option>
                {carros.length > 0 ? (
                    [...new Set(carros.map(carro => carro.modelo?.nome).filter(Boolean))]
                        .sort()
                        .map(modelo => (
                            <option key={modelo} value={modelo}>
                                {modelo}
                            </option>
                        ))
                ) : (
                    <option disabled>Carregando modelos...</option>
                )}
            </FiltroSelect>

            <FiltroSelect value={filtroDisponibilidade} onChange={(e) => setFiltroDisponibilidade(e.target.value)}>
                <option value="todos">Todos os carros</option>
                <option value="Disponível">Disponíveis</option>
                <option value="Indisponível">Indisponíveis</option>
            </FiltroSelect>

            <GradeCarros>
                {carrosFiltrados.length > 0 ? (
                    carrosFiltrados.map(carro => (
                        <CartaoCarro key={carro.id} onClick={() => abrirModal(carro)}>
                            {console.log('Dados do carro:', carro)}
                            <Imagem src={carro.urlImagem} />
                            <Titulo>{carro.modelo?.nome || 'N/A'}</Titulo>
                            <p>{carro.modelo?.marca?.nome || 'N/A'}</p>
                            <p><b>Ano:</b> {carro.anoFabricacao || 'N/A'}</p>
                            <p><b>Preço:</b> R$ {carro.preco || 'N/A'},00</p>
                            <p><b>Cor:</b> {carro.cor || 'N/A'}</p>
                            <p><b>Quilometragem:</b> {carro.quilometragem || 'N/A'}</p>
                            <p><b>Disponibilidade:</b> {carro.statusDisponibilidade || 'N/A'}</p>
                        </CartaoCarro>
                    ))
                ) : (
                    <p>Não há carros disponíveis</p>
                )}
            </GradeCarros>

            <Modal show={mostrarModal}>
                <ModalConteudo>
                    <BotaoFechar onClick={fecharModal}>x</BotaoFechar>
                    <h2>{modoEdicao ? 'Editar Carro' : 'Detalhes do Carro'}</h2>
                    {!modoEdicao ? (
                        <>
                            <Imagem src={carroSelecionado?.urlImagem} />
                            <Titulo>{carroSelecionado?.modelo?.nome || 'N/A'}</Titulo>
                            <p>{carroSelecionado?.modelo?.marca?.nome || 'N/A'}</p>
                            <p><b>Ano:</b> {carroSelecionado?.anoFabricacao || 'N/A'}</p>
                            <p><b>Preço:</b> R$ {carroSelecionado?.preco || 'N/A'},00</p>
                            <p><b>Cor:</b> {carroSelecionado?.cor || 'N/A'}</p>
                            <p><b>Quilometragem:</b> {carroSelecionado?.quilometragem || 'N/A'}</p>
                            <p><b>Disponibilidade:</b> {carroSelecionado?.statusDisponibilidade || 'N/A'}</p>
                            <Icone><i class="fi fi-rr-edit" onClick={editarCarro}></i></Icone>
                        </>
                    ) : (
                        <ModalFormulario>
                            <Label>Preço:</Label>
                            <Input
                                value={carroSelecionado?.preco || ''}
                                onChange={(e) => setCarroSelecionado({ ...carroSelecionado, preco: e.target.value })}
                                placeholder="Preço"
                            />
                            <Label>Ano de Fabricação:</Label>
                            <Input
                                value={carroSelecionado?.anoFabricacao || ''}
                                onChange={(e) => setCarroSelecionado({ ...carroSelecionado, anoFabricacao: e.target.value })}
                                placeholder="Ano"
                            />
                            <Label>Cor:</Label>
                            <Input
                                value={carroSelecionado?.cor || ''}
                                onChange={(e) => setCarroSelecionado({ ...carroSelecionado, cor: e.target.value })}
                                placeholder="Cor"
                            />
                            <Label>Quilometragem:</Label>
                            <Input
                                value={carroSelecionado?.quilometragem || ''}
                                onChange={(e) => setCarroSelecionado({ ...carroSelecionado, quilometragem: e.target.value })}
                                placeholder="Quilometragem"
                            />
                            <Label>Status de Disponibilidade:</Label>
                            <FiltroSelect
                                value={carroSelecionado?.statusDisponibilidade || ''}
                                onChange={(e) =>
                                    setCarroSelecionado({
                                        ...carroSelecionado,
                                        statusDisponibilidade: e.target.value,
                                    })
                                }
                            >
                                <option value="Disponível">Disponível</option>
                                <option value="Indisponível">Indisponível</option>
                            </FiltroSelect>

                            <Button onClick={atualizarCarro}>Salvar</Button>
                        </ModalFormulario>
                    )}
                </ModalConteudo>
            </Modal>
        </>
    );
}

