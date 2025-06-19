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
    const TRANSACAO_API = "http://localhost:8080/api/transacoes/";
    const PARCELA_API = "http://localhost:8080/api/parcelas/";
    const PARCELASTATUSAPI = "http://localhost:8080/api/parcelasStatus/";
    const TRANSACAOSTATUSAPI = "http://localhost:8080/api/transacoesStatus/";

    const [transacoes, setTransacoes] = useState([]);
    const [filteredTransacoes, setFilteredTransacoes] = useState([]);
    const [transacaoSelecionada, setTransacaoSelecionada] = useState({});
    const [searchName, setSearchName] = useState("");
    const [searchId, setSearchId] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [total, setTotal] = useState(0);
    const [totalParcela, setTotalParcela] = useState(0);
    const [totalParcelaFaltante, setTotalParcelaFaltante] = useState(0);
    const [activeModal, setActiveModal] = useState(false);
    const [isDataFimDisabled, setIsDataFimDisabled] = useState(false);
    const [showParcelaDay, setShowParcelaDay] = useState(false);
    const [message, setMessage] = useState({ message: "", status: "" });
    const [parcelas, setParcelas] = useState([]);
    const [loadingParcelas, setLoadingParcelas] = useState(false);
    const [imagemSelecionada, setImagemSelecionada] = useState(null);
    const [file, setFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const [userId, setUserId] = useState(null);

    const closeModal = () => {
        setActiveModal(false);
        window.location.reload();
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage({ message: "Selecione um arquivo primeiro!", status: "erro" });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);
        formData.append("transacaoId", transacaoSelecionada.idtransacoes);

        try {
            const response = await Axios.post(
                `http://localhost:8080/api/upload?userId=${userId}&transacaoId=${transacaoSelecionada.idtransacoes}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200) {
                const { filename } = response.data;
                const path = `/imagensitem/user-${userId}/transacao-${transacaoSelecionada.idtransacoes}/${filename}`;
                setUploadedImage(`http://localhost:8080${path}`);
                setMessage({ message: "Upload realizado com sucesso!", status: "ok" });
                window.location.reload();
            }
        } catch (error) {
            setMessage({ message: "Erro ao enviar imagem, favor contatar um analista!", status: "erro" });
        }
    };

    const handleUpdateParcela = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            

            const response = await Axios.put(`${TRANSACAO_API}${id}`, transacaoSelecionada, config);

            setMessage({ message: "Parcela alterada com sucesso!", status: "ok" });
            window.location.reload();
        } catch (error) {
            console.error('Erro ao alterar parcela:', error);
            setMessage({ message: "Erro ao alterar parcela! Favor contate o analista", status: "error" });
        }
    };


    const fetchParcelasByTransacaoId = async (id) => {
        try {
            setLoadingParcelas(true);
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await Axios.get(`${PARCELA_API}${id}`, config);
            if (response.status === 200) {
                const parcelasData = response.data;
                setParcelas(parcelasData);

                const totalPagas = parcelasData
                    .filter(parcela => parcela.status === 'Pago')
                    .reduce((acc, parcela) => acc + parseFloat(parcela.valor), 0);

                const totalFaltando = parcelasData
                    .filter(parcela => parcela.status !== 'Pago')
                    .reduce((acc, parcela) => acc + parseFloat(parcela.valor), 0);

                setTotalParcela(totalPagas);
                setTotalParcelaFaltante(totalFaltando);
            }
        } catch (error) {
            setParcelas([]);
            setMessage({ message: "Erro ao buscar parcela, favor contatar um analista!", status: "erro" });
        } finally {
            setLoadingParcelas(false);
        }
    };
    const alterarStatus = async (id, statusAtual) => {
        const confirmacao = window.confirm("Tem certeza de que deseja alterar o status desta transação?");
        if (!confirmacao) return;
        const novoStatus = statusAtual === 'pendente' ? 'Pago' : 'Pendente';
        const setStatusData = { idtransacoes: id, status: novoStatus };
        try {
            const token = localStorage.getItem('authToken');  // Pega o token
            const config = { headers: { Authorization: `Bearer ${token}` } };  // Configuração para a requisição
            await Axios.put(`${TRANSACAOSTATUSAPI}${id}`, setStatusData, config);  // Envia o token na requisição
            window.location.reload();
        } catch {
            setMessage({ message: "Erro ao alterar status favor contatar um analista!", status: "erro" });
        }
    };
    const alterarStatusParcela = async (id, statusAtual) => {
        const confirmacao = window.confirm("Tem certeza de que deseja alterar o status desta parcela?");
        if (!confirmacao) return;

        const novoStatus = statusAtual === 'Pendente' ? 'Pago' : 'Pendente';
        const setStatusData = { id: id, status: novoStatus };

        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await Axios.put(`${PARCELASTATUSAPI}${id}`, setStatusData, config);

            const novasParcelas = parcelas.map(parcela =>
                parcela.id === id ? { ...parcela, status: novoStatus } : parcela
            );

            setParcelas(novasParcelas);

            const totalPagas = novasParcelas
                .filter(parcela => parcela.status === 'Pago')
                .reduce((acc, parcela) => acc + parseFloat(parcela.valor), 0);

            const totalFaltando = novasParcelas
                .filter(parcela => parcela.status !== 'Pago')
                .reduce((acc, parcela) => acc + parseFloat(parcela.valor), 0);

            setTotalParcela(totalPagas);
            setTotalParcelaFaltante(totalFaltando);

            setMessage({ message: "Status alterado com sucesso!", status: "ok" });
        } catch (error) {
            setMessage({ message: "Erro ao alterar status, favor contatar um analista!", status: "erro" });
        }
    };

    const handleSearchByName = (event) => {
        const value = event.target.value;
        setSearchName(value);
        const filtered = transacoes.filter(t => t.nome.toLowerCase().includes(value.toLowerCase()));
        setFilteredTransacoes(filtered);
    };

    const handleSearchById = (event) => {
        const value = event.target.value;
        setSearchId(value);
        const idToSearch = value ? Number(value) : null;
        const filtered = transacoes.filter(t => idToSearch !== null ? t.idtransacoes === idToSearch : true);
        setFilteredTransacoes(filtered);
    };

    const handleSearchByStatus = (event) => {
        const value = event.target.value;
        setSearchStatus(value);
        if (!value) {
            setFilteredTransacoes(transacoes);
            const totalGeral = transacoes.reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);
            setTotal(totalGeral);
            return;
        }
        const filtered = transacoes.filter(t => t.status === value);
        const totalValor = filtered.reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);
        setTotal(totalValor);
        setFilteredTransacoes(filtered);
    };

    const handleOpenModal = async (event, transacao, modal) => {
        event.preventDefault();
        setTransacaoSelecionada(transacao);
        setActiveModal(modal);
        if (modal === 1 && transacao.idtransacoes) {
            await fetchParcelasByTransacaoId(transacao.idtransacoes);
            if (transacao.imagem != null) {
                const imagemUrl = `http://localhost:8080/imagensitem/user-${userId}/transacao-${transacao.idtransacoes}/${transacao.imagem}`;
                setUploadedImage(imagemUrl);
            } else {
                setUploadedImage(null);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTransacaoSelecionada(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (typeof window !== 'undefined') {
            const storedId = localStorage.getItem('userId');
            setUserId(storedId);
        }
        if (!token) {
            router.push('/');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const fetchTransacoes = async () => {
            try {
                const response = await Axios.get(TRANSACAO_API, config);
                if (response.status === 200) {
                    const transacoesRecebidas = response.data;
                    const transacoesComParcelas = transacoesRecebidas.map(t => ({
                        ...t,
                        numParcelas: t.num_parcelas
                    }));
                    const totalValor = transacoesComParcelas
                        .filter(t => t.status === 'pendente')
                        .reduce((acc, t) => acc + parseFloat(t.valor), 0);
                    setFilteredTransacoes(transacoesComParcelas);
                    setTransacoes(transacoesComParcelas);
                    setTotal(totalValor);
                }
            } catch (error) {
                setMessage({ message: "Erro ao buscar transações, favor contatar um analista!", status: "erro" });
            }
        };
        fetchTransacoes();
    }, []);

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
                <div className="d-flex align-items-center mt-4" style={{ width: '95%', marginLeft: '2%' }}>
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
                        <table className="table table-hover">
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
                                                className={`border-start cursor-pointer border-end text-center ${transacao.status === 'pendente' ? 'bg-warning' : 'bg-success'}`}

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
                                        <strong>Totalizador Mensal  atual {dataFormatada} :</strong> R$ {total.toFixed(2)} {/* Exibe o total formatado */}
                                    </td>
                                    <td colSpan="7"></td> {/* Coluna vazia para manter a estrutura da tabela */}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Modals */}
                {activeModal === 1 && (
                    <div
                        className="modal d-block fade show"
                        style={{
                            transition: 'opacity 0.5s ease',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        }}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                {/* Cabeçalho */}
                                <div className="modal-header bg-success text-white">
                                    <h5 className="modal-title">Listagem de Parcelas</h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                <div className="container">
                                    {message.status === "ok" && (
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">{message.message}</div>)}
                                    {message.status === "error" && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">{message.message}</div>)}
                                </div>
                                {/* Corpo do modal com layout dividido */}
                                <div className="modal-body row">
                                    {/* Coluna da Imagem */}
                                    {/* Lado Esquerdo */}
                                    <div className="col-md-4 border-end">
                                        <h6>Anexar Imagem</h6>
                                        <form onSubmit={handleUpload}>
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-2" />
                                            <button type="submit" className="btn btn-success">Enviar Imagem</button>
                                        </form>
                                        {uploadedImage && (
                                            <div className="mt-3">
                                                <img src={uploadedImage} alt="Imagem enviada" className="img-fluid mt-2 rounded" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Coluna da Tabela */}
                                    <div className="col-md-8 d-flex flex-column" style={{ maxHeight: '550px', overflow: 'hidden' }}>
                                        <div style={{ overflowY: 'auto', flex: 1 }}>
                                            <div className="table-responsive">
                                                {Array.isArray(parcelas) && parcelas.length > 0 ? (
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered table-striped">
                                                            <thead className="table-success">
                                                                <tr>
                                                                    <th>ID Parcela</th>
                                                                    <th>Sequencia</th>
                                                                    <th>Valor</th>
                                                                    <th>Data de Vencimento</th>
                                                                    <th>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {parcelas.map((parcela) => (
                                                                    <tr key={parcela.id || parcela.idparcela}>
                                                                        <td>{parcela.id || parcela.idparcela}</td>
                                                                        <td>{parcela.num_seq}</td>
                                                                        <td>{parseFloat(parcela.valor).toLocaleString('pt-BR', {
                                                                            style: 'currency',
                                                                            currency: 'BRL',
                                                                        })}</td>
                                                                        <td>{new Date(parcela.data_vencimento).toLocaleDateString('pt-BR')}</td>
                                                                        <td className={`text-center ${parcela.status === 'Pendente' ? 'bg-warning' : 'bg-success'}`} onClick={(e) => {
                                                                            e.stopPropagation(); // Impede a propagação do clique para o <tr>
                                                                            alterarStatusParcela(parcela.id, parcela.status);
                                                                        }}>
                                                                            {parcela.status === 'Pendente' ? (
                                                                                <i className="text-white fa-solid fa-circle-exclamation" title={parcela.status}></i>
                                                                            ) : (
                                                                                <i className="text-white fas fa-check" title={parcela.status}></i>
                                                                            )}
                                                                        </td>
                                                                    </tr>

                                                                ))}
                                                                <tr className="table-success"> {/* Linha verde para o total */}
                                                                    <td colSpan="2" className="text-end"> {/* Coluna para o total, ocupando 9 colunas */}
                                                                        <strong>Totalizador:</strong>
                                                                    </td>

                                                                    <td colSpan="1" className=""> {/* Coluna para o total, ocupando 9 colunas */}
                                                                        R$ {totalParcela.toFixed(2)} {/* Exibe o total formatado */}
                                                                    </td>
                                                                    <td colSpan="2" className=""> {/* Coluna para o total, ocupando 9 colunas */}
                                                                        <strong>Faltante:</strong> R$ {totalParcelaFaltante.toFixed(2)} {/* Exibe o total formatado */}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p>Nenhuma parcela encontrada.</p>
                                                )}
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
                        <div className="modal-dialog modal-xl">
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

            </div >
        </>
    );
}
