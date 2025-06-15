import MenuAdmin from '@/components/MenuAdmin';
import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

export default function Admin() {
    const router = useRouter();
    const CATEGORIA_API = "http://localhost:8080/api/categoria";
    const CONTA_API = "http://localhost:8080/api/conta";

    const [nome, setNome] = useState('');
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [nomeConta, setNomeConta] = useState('');
    const [descricao, setDescricao] = useState('');
    const [descricaoCategoria, setDescricaoCategoria] = useState('');
    const [categoria, setCategoria] = useState([]);
    const [idCategoria, setIdCategoria] = useState(0);
    const [conta, setConta] = useState([]);
    const [idConta, setIdConta] = useState(0);
    const [dataInicio, setDataInicio] = useState('');


    const [transacaoSelecionada, setTransacaoSelecionada] = useState({});
    const [searchName, setSearchName] = useState("");
    const [filteredTransacoes, setFilteredTransacoes] = useState([]); // Estado para transações filtradas
    const [searchId, setSearchId] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const TRANSACAO_API = "http://localhost:8080/api/transacoes/";
    const TRANSACAOSTATUSAPI = "http://localhost:8080/api/transacoesStatus/";
    const [activeModal, setActiveModal] = useState(false); // Controle do modal
    const [total, setTotal] = useState(0); // Estado para armazenar o total
    const [transacoes, setTransacoes] = useState([]); // Estado para armazenar as transações
    const [numParcelas, setNumParcelas] = useState(0); // Rastreia o valor das parcelas
    const [valorGastos, setValorGastos] = useState("0,00"); // Rastreia o valor das parcelas
    const [valorConta, setValorConta] = useState(0); // Armazenar o valor da conta que primordialmente nao sera usado mas futuramente terá melhorias
    const [isDataFimDisabled, setIsDataFimDisabled] = useState(false); // Controla se o campo Data Fim será desabilitado
    const [showParcelaDay, setShowParcelaDay] = useState(false); // Controla se o campo Dia da Parcela será exibido
    const [checkdiautil, setcheckdiautil] = useState(false); // Controla se o campo Dia da Parcela será exibido
    const [diaParcela, setDiaParcela] = useState(0); // Valor do dia da parcela
    const [message, setMessage] = useState({ message: "", status: "" }); //mensagem de erro ou sucesso

    const [dataFim, setDataFim] = useState('');

    /* const openModal = () => {
        // Data de hoje


        setActiveModal(true); // Abrir o modal
    }; */

    const deletarTransacao = async (id) => {
        const confirmacao = window.confirm(
            "Tem certeza de que deseja excluir esta transação?"
        );
        if (confirmacao) {
            try {
                
                const response = await Axios.delete(`${TRANSACAO_API}${id}`);
                console.log("Resposta da API:  ", response.data);
    
                window.location.reload(); // ou atualize o estado local
            } catch (error) {
                console.error("Erro ao deletar transação:", error);
                alert("Não foi possível deletar a transação. Tente novamente.");
            }
        }
    };

    const alterarStatus = async (id, novoStatus) => {
        const confirmacao = window.confirm(
            "Tem certeza de que deseja alterar o status desta transação?"
        );
        if (confirmacao) {

            const setStatusData = {
                idtransacoes: id,
                status: novoStatus === 'pendente' ? "pago" : "pendente",
            };

            console.log(setStatusData);

            const response = await Axios.put(TRANSACAOSTATUSAPI + id, setStatusData);
            console.log("Resposta da API:", response.data);

            // Atualizar o estado local após sucesso
            setTransacoes((prev) =>
                prev.map((transacao) =>
                    transacao.id === id
                        ? { ...transacao, status: novoStatus }
                        : transacao
                )
            );

            window.location.reload();
        }
    };
    const menuItemStyle = {

        cursor: 'pointer',
    
    };
    const handleRightClick = (event, id) => {
        event.preventDefault(); // Impede o menu de contexto padrão
        alert(`Botão direito pressionado na transação com ID: ${id}`);
    };
    const handleParcelasChange = (event) => {
        const value = parseInt(event.target.value, 10) || 0; // Garante que seja um número
        setNumParcelas(value);
        setIsDataFimDisabled(value > 0); // Desabilita Data Fim se parcelas > 0
        setShowParcelaDay(value > 0); // Exibe o campo Dia da Parcela se parcelas > 0

        if (value > 0) {
            setcheckdiautil(false);
        }
        else {
            setcheckdiautil(true);
        }
    };
    const handleValorChange = (e) => {
        let valor = e.target.value;

        // Remove caracteres inválidos, mas mantém a vírgula para a formatação
        valor = valor.replace(/\D/g, "");

        // Trata o caso de entrada vazia
        if (!valor) {
            setValorGastos("0,00");
            return;
        }

        console.log("Valor (sem formatação): " + valor);

        // Adiciona vírgula para centavos (dividindo por 100)
        const valorFormatado = (parseFloat(valor) / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        setValorGastos(valorFormatado);
    };

    const valorfim = valorGastos.replace(/\./g, "").replace(/,/g, ".");

    const handleSaldoChange = (e) => {
        let valor = e.target.value;

        // Remove caracteres inválidos
        valor = valor.replace(/\D/g, "");

        // Trata o caso de entrada vazia
        if (!valor) {
            setValorConta("0,00");
            return;
        }

        // Adiciona vírgula para centavos
        valor = (parseFloat(valor) / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });



        setValorConta(valor);
    };



    // Função para lidar com a busca
    const handleSearchByName = (event) => {
        const value = event.target.value;
        setSearchName(value);

        const filtered = transacoes.filter(transacao =>
            transacao.nome.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTransacoes(filtered);
    };
    const handleSearchById = (event) => {
        const value = event.target.value;
        setSearchId(value);
        const idToSearch = value ? Number(value) : null;

        const filtered = transacoes.filter(transacao => {
            // Filtra apenas se idToSearch é um número e existe nas transações
            return idToSearch !== null ? transacao.idtransacoes === idToSearch : true;
        });
        setFilteredTransacoes(filtered);
    };
    const handleSearchByStatus = (event) => {
        const value = event.target.value;
        setSearchStatus(value);

        if (!value) {
            // Se não houver filtro, mostra todas as transações e soma o total geral
            setFilteredTransacoes(transacoes);
            const totalGeral = transacoes.reduce((acc, transacao) => acc + parseFloat(transacao.valor || 0), 0);
            setTotal(totalGeral);
            return;
        }

        // Filtra as transações pelo status selecionado
        const filtered = transacoes.filter(transacao => transacao.status === value);

        // Calcula o total apenas das transações filtradas
        const totalValor = filtered.reduce((acc, transacao) => acc + parseFloat(transacao.valor || 0), 0);

        setTotal(totalValor);
        setFilteredTransacoes(filtered);
    };

    const handleOpenModal = (event, transacao, modal) => {
        event.preventDefault();
        setTransacaoSelecionada(transacao);

        setActiveModal(modal);  // Abre o modal
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        setTransacaoSelecionada(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };
    const handleUpdateParcela = async (id) => {
        try {
            
            console.log("ID: " + id + " URL: " + TRANSACAO_API);
            console.log("Dados enviados: ", transacaoSelecionada);
            const response = await Axios.put(`${TRANSACAO_API}${id}`, transacaoSelecionada);
            setMessage({ message: "Parcela alterada com sucesso!", status: "ok" });
            window.location.reload();
        } catch (error) {
            console.error('Erro ao alterar parcela:', error);
            setMessage({ message: "Erro ao alterar parcela! Favor contate o analista", status: "error" });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            router.push('/'); // Redireciona para a página de login
        }

        const calcularParcelas = (dataInicio, dataFim) => {
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
            const diff = Math.abs(fim - inicio);
            const diasPorParcela = 30; // Considerando parcelas mensais
            return Math.ceil(diff / (1000 * 60 * 60 * 24 * diasPorParcela));
        };

        const fetchTransacoes = async () => {
            try {
                const response = await Axios.get(TRANSACAO_API);
                if (response.status === 200) {
                    const transacoesRecebidas = response.data;

                    // Calcula o número de parcelas para cada transação
                    const transacoesComParcelas = transacoesRecebidas.map(transacao => {
                        if (!transacao.num_parcelas) {

                            const numParcelas = calcularParcelas(transacao.data_ini, transacao.data_fim);
                            console.log("!A " + transacao.numParcelas);
                            return { ...transacao, numParcelas }; // Adiciona numParcelas à transação

                        }
                        else {
                            const numParcelas = transacao.num_parcelas
                            console.log("B " + transacao.numParcelas);
                            return { ...transacao, numParcelas }; // Adiciona numParcelas à transação  

                        }
                        return transacao; // Retorna a transação original se já tiver numParcelas
                    });
                    console.log(transacoesComParcelas);

                    const totalValor = transacoesComParcelas
                        .filter(transacao => transacao.status === 'pendente')
                        .reduce((acc, transacao) => acc + parseFloat(transacao.valor), 0);
                    setFilteredTransacoes(transacoesComParcelas); // Inicialmente, todas as transações são filtradas
                    setTransacoes(transacoesComParcelas);
                    setTotal(totalValor); // Armazena o total
                }
            } catch (error) {
                console.error('Erro ao carregar transações:', error);
            }
        };

        fetchTransacoes();
        // Chama openModal após as configurações iniciais

    }, []); // Executa apenas uma vez ao montar o componente
    const closeModal = () => setActiveModal(false); // Fechar modal
    console.log(transacaoSelecionada.data_ini);
    return (
        <>
            <Head>
                <title>ECOGASTO</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                    rel="stylesheet"
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                />
            </Head>
            <div className="d-flex flex-column" style={{ minHeight: '100vh', paddingBottom: '50px' }}>
                <NavAdmin />
                <MenuAdmin />
                <div className="d-flex align-items-center mt-4" style={{ width: '100%', marginLeft: '2%' }}>
                    <div className="d-flex w-100 gap-3">
                        {/* Busca por transação */}
                        <div className="input-group" style={{ flexBasis: '350px' }}>
                            <input
                                type="text"
                                className="form-control"
                                style={{ maxWidth: '450px', fontSize: '0.9rem', height: '40px' }}
                                placeholder="Busca por transação"
                                value={searchName}
                                onChange={handleSearchByName}
                            />
                            <span className="input-group-text" style={{ cursor: 'pointer' }}>
                                <i className="fas fa-search" style={{ fontSize: '1rem' }}></i>
                            </span>
                        </div>

                        {/* Busca por ID */}
                        <div className="input-group" style={{ flexBasis: '150px' }}>
                            <input
                                type="text"
                                className="form-control"
                                style={{ fontSize: '0.9rem', height: '40px' }}
                                placeholder="Busca por ID"
                                value={searchId}
                                onChange={handleSearchById}
                            />
                            <span className="input-group-text" style={{ cursor: 'pointer' }}>
                                <i className="fas fa-search" style={{ fontSize: '1rem' }}></i>
                            </span>
                        </div>

                        {/* Filtro de status */}
                        <select className="form-select" style={{ flexBasis: '200px', height: '40px' }} onChange={handleSearchByStatus}>
                            <option value="">Todos os Status</option>
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                        </select>
                    </div>
                </div>
                <div className="container-fluid mt-4">

                    <div className="table-responsive">
                        <table className="table table-hover" style={menuItemStyle}>
                            <thead className="table-dark">
                                <tr>
                                    <th colSpan="2" className="border-start border-end border-white text-end">ID</th>
                                    <th className="border-start border-end border-white">Nome</th>
                                    <th className="border-start border-end border-white">Categoria</th>
                                    <th className="border-start border-end border-white">Conta</th>
                                    <th className="border-start border-end border-white">Valor</th>
                                    <th className="border-start border-end border-white">Parcelas</th>
                                    <th className="border-start border-end border-white">Valor Total</th>
                                    <th className="border-start border-end border-white">Dt. Criação</th>
                                    <th className="border-start border-end border-white">Dt. Inicial</th>
                                    <th className="border-start border-end border-white">Dt. Final</th>
                                    <th className="border-start border-end border-white">Pagamento 5 º dia útil</th>
                                    <th className="border-start border-end border-white">Dia Fixo</th>
                                    <th className="border-start border-end border-white">Situação</th>

                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransacoes.length > 0 ? (
                                    filteredTransacoes.map((transacao) => (
                                        <tr key={transacao.id} onClick={(e) => handleOpenModal(e, transacao, 1)} onContextMenu={(e) => handleOpenModal(e, transacao, 2)}>
                                            <td
                                                className="border-start border-end"
                                                style={menuItemStyle}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Impede a propagação do clique para o <tr>
                                                    deletarTransacao(transacao.idtransacoes);
                                                }}
                                            >
                                                <i
                                                    className="text-danger fa-solid fa-trash-can"
                                                    title="Deletar Registro"
                                                ></i>
                                            </td>
                                            <td className="border-start border-end ">{transacao.idtransacoes}</td>
                                            <td className="border-start border-end " title={transacao.descricao}>{transacao.nome}</td>
                                            <td className="border-start border-end ">{transacao.categoria_nome || "Não Informado"}</td>
                                            <td className="border-start border-end ">{transacao.contaNome || "Não Informado"}</td>
                                            <td className="border-start border-end ">{transacao.valor}</td>
                                            <td className="border-start border-end ">{transacao.numParcelas}                  </td>
                                            <td className="border-start border-end ">
                                              {(transacao.valor * transacao.numParcelas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="border-start border-end ">{new Date(transacao.data).toLocaleDateString()}</td>
                                            <td className="border-start border-end ">{new Date(transacao.data_ini).toLocaleDateString()}</td>
                                            <td className="border-start border-end ">{new Date(transacao.data_fim).toLocaleDateString()}</td>
                                            <td className="border-start border-end ">{transacao.dia_util ? "Sim" : "Não"}</td>
                                            <td className="border-start border-end ">{transacao.dia_util ? "X" : transacao.num_dia}</td>

                                            <td
                                                className={`border-start cursor-pointer border-end text-center ${transacao.status === 'pendente' ? 'bg-warning'  : 'bg-success'}`}
                                                style={menuItemStyle}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Impede a propagação do clique para o <tr>
                                                    alterarStatus(transacao.idtransacoes, transacao.status);
                                                }}
                                                title={transacao.status}
                                            >
                                                {transacao.status === 'pendente' ? (
                                                    <i
                                                        className="text-white fa-solid fa-circle-exclamation"
                                                        title={transacao.status}
                                                    ></i>
                                                ) : (
                                                    <i
                                                        className="text-white fas fa-check"
                                                        title={transacao.status}
                                                    ></i>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center"> {/* Ajustado para 10 colunas */}
                                            Nenhuma transação encontrada.
                                        </td>
                                    </tr>
                                )}
                                <tr className="table-success"> {/* Linha verde para o total */}
                                    <td colSpan="7" className="text-end"> {/* Coluna para o total, ocupando 9 colunas */}
                                        <strong>Totalizador:</strong> R$ {total.toFixed(2)} {/* Exibe o total formatado */}
                                    </td>
                                    <td colSpan="7"></td> {/* Coluna vazia para manter a estrutura da tabela */}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Modals */}
                {activeModal === 1 && (
                    <div className="modal d-block fade show" style={{
                        transition: 'opacity 0.5s ease',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    }}
                        tabIndex="-1">
                        <div className="modal-dialog modal-lg">

                            <div className="modal-content">
                                {/* Cabeçalho */}

                                <div className="modal-header bg-success text-white">
                                    <h5 className="modal-title">Listagem de Parcelas</h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                {/* <div className="container mt-2">
                                    {message.status === "ok" && (
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">{message.message}</div>)}
                                    {message.status === "error" && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">{message.message}</div>)}
                                </div> */}
                                {/* Corpo do modal */}
                                <div className="modal-body">

                                    <div className="row">
                                        {/* Lado Esquerdo */}
                                        <div className="col-md-6 border-end">
                                            <div className="form-group">

                                            </div>
                                        </div>

                                        {/* Lado Direito */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeModal === 2 && (
    <div className="modal d-block fade show" style={{
        transition: 'opacity 0.5s ease',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    }}
        tabIndex="-1">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                {/* Cabeçalho */}
                <div className="modal-header bg-success text-white">
                    <h5 className="modal-title">Alterar Registro</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="container mt-2">
                    {message.status === "ok" && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">{message.message}</div>)}
                    {message.status === "error" && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">{message.message}</div>)}
                </div>
                {/* Corpo do modal */}
                <div className="modal-body">
                    <div className="row">
                        {/* Lado Esquerdo */}
                        <div className="col-md-6 border-end">
                            <div className="form-group">
                                <label className="form-label mt-2 mb-2" htmlFor="idTransacaoAlt">
                                    Id Transação Selecionada
                                </label>
                                <input
                                    className="form-control"
                                    type="number"
                                    id="idTransacaoAlt"
                                    name="idtransacoes"
                                    disabled
                                    value={transacaoSelecionada.idtransacoes}
                                />
                                <label className="form-label mt-2 mb-2" htmlFor="nomeTransacaoAlt">
                                    Nome <span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="nomeTransacaoAlt"
                                    name="nome"
                                    value={transacaoSelecionada.nome || ""}
                                    onChange={handleChange}
                                />
                                <label className="form-label mt-2 mb-2" htmlFor="descricaoTransacaoAlt">
                                    Descrição <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    className='form-control'
                                    id='descricaoTransacaoAlt'
                                    name="descricao"
                                    value={transacaoSelecionada.descricao || ""}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                        
                        {/* Lado Direito */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label mt-2" htmlFor="data_inicio">Data Início</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="data_inicio"
                                    name="data_ini"
                                    value={transacaoSelecionada.data_ini
                                        ? new Date(transacaoSelecionada.data_ini).toISOString().split('T')[0]
                                        : ""}
                                    onChange={handleChange}
                                    required
                                />
                                <label className="form-label mt-2" htmlFor="data_fim">Data Fim</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="data_fim"
                                    name="data_fim"
                                    value={transacaoSelecionada.data_fim
                                        ? new Date(transacaoSelecionada.data_fim).toISOString().split('T')[0]
                                        : ""}
                                    onChange={handleChange}
                                    disabled={isDataFimDisabled}
                                />
                                <label className="form-label mt-2" htmlFor="valorGastos">Valor</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="valorGastos"
                                    name="valor"
                                    step="0.01"
                                    value={transacaoSelecionada.valor || ""}
                                    onChange={handleChange}
                                />
                                <label className="form-label mt-2" htmlFor="num_parcelas">Parcelas</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="num_parcelas"
                                    name="num_parcelas"
                                    min="1"
                                    value={transacaoSelecionada.num_parcelas || ""}
                                    onChange={handleChange}
                                />
                                {showParcelaDay && (
                                    <div className="form-group mt-3">
                                        <label className="form-label" htmlFor="dia_parcela">Dia da Parcela</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="dia_parcela"
                                            name="num_dia"
                                            min="1"
                                            max="31"
                                            value={transacaoSelecionada.num_dia || ""}
                                            onChange={handleChange}
                                            placeholder="Dia fixo da parcela"
                                        />
                                    </div>
                                )}
                                {!showParcelaDay && (
                                    <div className="form-check form-switch mt-3">
                                        <label className="form-check-label" htmlFor="diautil">Quinto dia Útil</label>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="diautil"
                                            name="dia_util"
                                            checked={transacaoSelecionada.dia_util || false}
                                            onChange={handleChange} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => handleUpdateParcela(transacaoSelecionada.idtransacoes)}>
                        Atualizar
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

            </div>
        </>
    );
}
