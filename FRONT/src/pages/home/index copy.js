import MenuAdmin from '@/components/MenuAdmin';
import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';

export default function Admin() {
    const router = useRouter();
    const CATEGORIA_API = "http://localhost:8080/api/categoria";
    const CONTA_API = "http://localhost:8080/api/conta";
    const TRANSACAO_API = "http://localhost:8080/api/transacoes";

    const [message, setMessage] = useState({ message: "", status: "" });
    const [errors, setErrors] = useState({});

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

    const [numParcelas, setNumParcelas] = useState(0); // Rastreia o valor das parcelas
    const [valorGastos, setValorGastos] = useState("0,00"); // Rastreia o valor das parcelas
    const [valorConta, setValorConta] = useState(0); // Armazenar o valor da conta que primordialmente nao sera usado mas futuramente terá melhorias
    const [isDataFimDisabled, setIsDataFimDisabled] = useState(false); // Controla se o campo Data Fim será desabilitado
    const [showParcelaDay, setShowParcelaDay] = useState(false); // Controla se o campo Dia da Parcela será exibido
    const [checkdiautil, setcheckdiautil] = useState(false); // Controla se o campo Dia da Parcela será exibido
    const [diaParcela, setDiaParcela] = useState(0); // Valor do dia da parcela

    const [dataFim, setDataFim] = useState('');

    const [activeModal, setActiveModal] = useState(false); // Controle do modal

    // Definir a função openModal antes de usá-la
    const openModal = () => {
        // Data de hoje
        console.log("AQUI");
        const hoje = new Date();
        setcheckdiautil(true); // Mantém o checkbox marcado
        setValorGastos("0,00");
        setValorConta("0,00");
        // Formatar a data de hoje no formato yyyy-mm-dd
        const dataInicioFormatted = hoje.toISOString().split('T')[0];
        setDataInicio(dataInicioFormatted);

        setNome(nome);
        setDescricao(descricao);

        // Adicionar 10 dias à data de hoje
        hoje.setDate(hoje.getDate() + 30);

        // Formatar a data de fim no formato yyyy-mm-dd
        const dataFimFormatted = hoje.toISOString().split('T')[0];
        setDataFim(dataFimFormatted);

        setActiveModal(true); // Abrir o modal
    };

    /* INICIO FUNÇÕES */

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

    const validateFields = () => {
        const newErrors = {};
        if (!nome.trim()) newErrors.nome = true;
        if (!descricao.trim()) newErrors.nome = true;

        if (!idConta.trim()) newErrors.nome = true;
        if (!idCategoria.trim()) newErrors.nome = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateFieldsCategoria = () => {
        const newErrors = {};
        if (!nomeCategoria.trim()) newErrors.nome = true;

        if (!descricaoCategoria.trim()) newErrors.nome = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const validateFieldsConta = () => {
        const newErrors = {};
        if (!nomeConta.trim()) newErrors.nome = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const calcularDatasParcelas = (dataInicial, numeroParcelas, diaFixo) => {
        const data = new Date(dataInicial);
        console.log(diaFixo);
    
        // Adiciona (numeroParcelas - 1) meses à data inicial
        data.setMonth(data.getMonth() + numeroParcelas - 1);
    
        const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate(); // Último dia do mês
        if (diaFixo > ultimoDia) {
            // Se o dia fixo for maior que o último dia do mês, ajusta para o último dia
            data.setDate(ultimoDia);
        } else {
            data.setDate(diaFixo);
        }
        console.log(data);
    
        // Formata a data para "yyyy-mm-dd" de acordo com o fuso horário local
        return data.toLocaleDateString('en-CA'); // Usando formato 'yyyy-mm-dd'
    };    
    

    /* FIM FUNÇÕES */

    /* HANDLECREATE INICIO */

    const handleCreateTransacao = async (e) => {
        if (!validateFields()) {
            setMessage({
                message: "Por favor, preencha todos os campos obrigatórios.",
                status: "error",
            });
            return;
        }
        e.preventDefault();
    
        try {
            let lastDataFim, diaParcelaInput;
    
            /* Caso o número de parcelas tenha sido informado */
            if (numParcelas > 0) {
                if (diaParcela <= 0) {
                    setMessage({
                        message: "Por favor, Informe o dia fixo da parcela.",
                        status: "error",
                    });
                    return;
                }
                // Caso o número de parcelas tenha sido informado, calculamos as datas com base nisso.
                lastDataFim = calcularDatasParcelas(dataInicio, numParcelas, diaParcela);
                console.log("Última data de fim calculada para parcelas:", lastDataFim);
            } else {
                /* Caso o número de parcelas não tenha sido informado, calculamos com base na data fim */
                setDiaParcela(0);  // Não precisamos do dia fixo se não há parcelas
                if (!dataFim) {
                    setMessage({
                        message: "Por favor, informe a data final.",
                        status: "error",
                    });
                    return;
                }
                
                // Calculando número de parcelas a partir da data de início e data de fim
                const numParcelasCalculado = calcularNumeroParcelas(dataInicio, dataFim, diaParcela);
                setNumParcelas(numParcelasCalculado);  // Atualizando o número de parcelas
                lastDataFim = dataFim; // Armazenando a data fim informada
            }
    
            // Dados da transação
            const transacaoData = {
                nome: nome,
                descricao: descricao,
                valor: parseFloat(valorfim),
                categoria_idcategoria: idCategoria,
                conta_idconta: idConta,
                data_inicio: dataInicio,
                data_fim: lastDataFim,
                status: 'pendente',
                numParcelas: numParcelas,
                dia_util: (checkdiautil),
                diaParcela: parseInt(diaParcela),  // Valor padrão
            };
    
            console.log("CRIAR TRANSACAO: ", valorfim);
            console.log(transacaoData.valor);
    
            const response = await Axios.post(TRANSACAO_API, transacaoData);
            console.log(response);
            if (response.status === 200) {
                setMessage({ message: "Categoria salva com sucesso!", status: "ok" });
                window.location.reload();
            } 
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.msg || "Erro desconhecido.";
                setMessage({ message: errorMessage, status: "error" });
            } else {
                setMessage({ message: "Erro ao criar Transação!" + error, status: "error" });
            }
        }
    };
    
    function calcularNumeroParcelas(dataInicio, dataFim, diaParcela) {
        const parcelas = [];
    
        let inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
    
        // Normaliza o dia da primeira parcela
        inicio.setDate(diaParcela);
    
        if (inicio < new Date(dataInicio)) {
            // Se o dia da primeira parcela for antes da data de início real, pula pro próximo mês
            inicio.setMonth(inicio.getMonth() + 1);
        }
    
        while (inicio <= fim) {
            parcelas.push(new Date(inicio));
            inicio.setMonth(inicio.getMonth() + 1); // Próxima parcela no mesmo dia do mês
        }
    
        return parcelas.length;
    }
    

    const handleCreateCategoria = async (e) => {

        e.preventDefault(); // Previne o comportamento padrão do formulário


        try {

            if (!validateFieldsCategoria()) {
                setMessage({
                    message: "Por favor, preencha todos os campos obrigatórios.",
                    status: "error",
                });
                return;
            }

            const categoriaData = {
                nome: nomeCategoria,
                descricao: descricaoCategoria,
            };

            console.log(categoriaData);

            const response = await Axios.post(CATEGORIA_API, categoriaData);

            if (response.status === 200) {
                setMessage({ message: "Categoria salva com sucesso!", status: "ok" });
                window.location.reload();
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.msg || "Erro desconhecido.";
                setMessage({ message: errorMessage, status: "error" });
            } else {
                setMessage({ message: "Erro ao criar Categoria!", status: "error" });
            }
        }
    }

    const handleCreateConta = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        try {
            if (!validateFieldsConta()) {
                setMessage({
                    message: "Por favor, preencha todos os campos obrigatórios.",
                    status: "error",
                });
                return;
            }

            // Cria os dados para enviar ao backend
            const contaData = {
                nome: nomeConta,
                saldo: parseFloat(valorConta),  // Envia o valor como número, sem formatação
            };
            console.log(contaData);
            console.log("SALDO CONTA: ", contaData.saldo);

            const response = await Axios.post(CONTA_API, contaData);
            //console.log(response);
            if (response.status === 200) {
                setMessage({ message: "Conta salva com sucesso!", status: "ok" });
                window.location.reload();
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.msg || "Erro desconhecido.";
                setMessage({ message: errorMessage, status: "error" });
            } else {
                setMessage({ message: "Erro ao criar Conta!" + error, status: "error" });
            }
        }
    };

    /* FIM HANDLECREATE */


    useEffect(() => {
        // Verifica se o token está presente no localStorage
        const token = localStorage.getItem('authToken');

        // Se o token não existir ou for inválido, redireciona para a página de login
        if (!token) {
            router.push('/'); // Redireciona para a página de login
        }

        const fetchCategories = async () => {
            try {
                const response = await Axios.get(CATEGORIA_API);
                console.log(response);
                if (response.status === 200) {
                    console.log(response.data);
                    setCategoria(response.data); // Armazena as categorias recebidas
                }
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
        };

        const fetchconta = async () => {
            try {
                const response = await Axios.get(CONTA_API);
                if (response.status === 200) {
                    setConta(response.data); // Armazena as contas recebidas
                }
            } catch (error) {
                console.error('Erro ao carregar contas:', error);
            }
        };

        fetchCategories();
        fetchconta();

        // Chama openModal após as configurações iniciais
        openModal();

    }, []); // Executa apenas uma vez ao montar o componente

    const closeModal = () => setActiveModal(false); // Fechar modal

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
                <div className="container mt-4 d-flex justify-content-center align-items-center">

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                        {/* Card 1 */}
                        <div className="p-2 col"
                            style={{
                                transition: 'background-color 0.3s ease',
                                cursor: 'pointer',
                                padding: '10px 20px',
                                borderRadius: '0',
                                textAlign: 'center',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#67cf8d'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => setActiveModal(1)}
                            title="Incluir gastos e pagamentos que devem ser realizados">
                            <div className="card h-100 bg-success text-white d-flex justify-content-center align-items-center">
                                <img src='https://i.ibb.co/TRqqCs7/DALL-E-2024-12-09-21-57-29-A-modern-and-clean-icon-representing-expenses-or-expenditures-with-a-gree.webp'
                                    style={{ height: '90px', width: '90px', borderRadius: '50%' }}
                                />
                                <h4 className="card-text">Incluir Gastos</h4>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="p-2 col"
                            style={{
                                transition: 'background-color 0.3s ease',
                                cursor: 'pointer',
                                padding: '10px 20px',
                                borderRadius: '0',
                                textAlign: 'center',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#67cf8d'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => setActiveModal(2)}
                            title="Incluir categoria de gastos">
                            <div className="card h-100 bg-success text-white d-flex justify-content-center align-items-center">
                                <img src="https://i.ibb.co/0ms6pDw/categoria.jpg"
                                    style={{ height: '90px', width: '90px', borderRadius: '50%' }}
                                />
                                <h4 className="card-text">Incluir Categoria</h4>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="p-2 col"
                            style={{
                                transition: 'background-color 0.3s ease',
                                cursor: 'pointer',
                                padding: '10px 20px',
                                borderRadius: '0',
                                textAlign: 'center',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#67cf8d'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => setActiveModal(3)}
                            title="Incluir conta pra vincular aos gastos">
                            <div className="card h-100 bg-success text-white d-flex justify-content-center align-items-center">
                                <img src="https://i.ibb.co/VBwcTJw/contacontabil.png"
                                    style={{ height: '90px', width: '90px', borderRadius: '50%' }}
                                />
                                <h4 className="card-text">Incluir Conta Contábil</h4>
                            </div>
                        </div>
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

                                <div className="modal-header bg-secondary text-white">
                                    <h5 className="modal-title">Incluir Gastos</h5>
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
                                                <label className="form-label mt-2 mb-2" htmlFor="categoria_idcategoria">
                                                    Nome <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="categoria_idcategoria"
                                                    name="categoria_idcategoria"
                                                    value={nome}
                                                    onChange={(e) => setNome(e.target.value)}
                                                />
                                                <label className="form-label mt-2 mb-2" htmlFor="categoria_idcategoria">
                                                    Categoria <span className="text-danger">*</span>
                                                </label>
                                                <select className="form-select" id="categoria_idcategoria" name="categoria_idcategoria" onChange={(e) => setIdCategoria(e.target.value)}>
                                                    <option value="">-- Selecione uma Categoria --</option>
                                                    {categoria.map((category) => (
                                                        <option key={category.idcategoria} value={category.idcategoria} >
                                                            {category.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label className="form-label mt-2 mb-2" htmlFor="conta_idconta">
                                                    Conta <span className="text-danger">*</span>
                                                </label>
                                                <select className="form-select" id="conta_idconta" name="conta_idconta" onChange={(e) => setIdConta(e.target.value)}>
                                                    <option value="">-- Selecione uma Conta --</option>
                                                    {conta.map((account) => (
                                                        <option key={account.idconta} value={account.idconta} >
                                                            {account.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label className="form-label mt-2 mb-2" htmlFor="descricao_iddescricaotransacao">
                                                    Descrição <span className="text-danger">*</span>
                                                </label>
                                                <textarea
                                                    className='form-control'
                                                    id='descricao_iddescricaotransacao'
                                                    value={descricao}
                                                    onChange={(e) => setDescricao(e.target.value)}></textarea>
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
                                                    name="data_inicio"
                                                    value={dataInicio}
                                                    onChange={(e) => setDataInicio(e.target.value)}
                                                    required
                                                />
                                                <label className="form-label mt-2" htmlFor="data_fim">Data Fim</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="data_fim"
                                                    name="data_fim"
                                                    value={dataFim}
                                                    onChange={(e) => setDataFim(e.target.value)}
                                                    disabled={isDataFimDisabled}
                                                />
                                                <label className="form-label mt-2" htmlFor="valorGastos">Valor</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="valorGastos"
                                                    name="valorGastos"
                                                    step="0.01"
                                                    value={valorGastos}
                                                    onChange={handleValorChange}
                                                />
                                                <label className="form-label mt-2" htmlFor="num_parcelas">Parcelas</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="num_parcelas"
                                                    name="num_parcelas"
                                                    min="1"
                                                    value={numParcelas}
                                                    onChange={handleParcelasChange}
                                                />
                                                {showParcelaDay && (
                                                    <div className="form-group mt-3">
                                                        <label className="form-label" htmlFor="dia_parcela">Dia da Parcela</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="dia_parcela"
                                                            name="dia_parcela"
                                                            min="1"
                                                            max="31"
                                                            value={diaParcela}
                                                            onChange={(e) => setDiaParcela(e.target.value)}
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
                                                            disabled
                                                            checked={checkdiautil}
                                                            onChange={(e) => setcheckdiautil(e.target.checked)} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" onClick={handleCreateTransacao}>
                                        Salvar
                                    </button>
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

                                <div className="modal-header bg-secondary text-white">
                                    <h5 className="modal-title">Incluir Categoria</h5>
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

                                    {/* Lado Esquerdo */}
                                    <div className="">
                                        <div className="form-group">
                                            <label className="form-label mt-2 mb-2" htmlFor="nome_categoria">
                                                Nome <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="nome_categoria"
                                                name="nome_categoria"
                                                value={nomeCategoria}
                                                onChange={(e) => setNomeCategoria(e.target.value)}
                                            />

                                            <label className="form-label mt-2 mb-2" htmlFor="descricao_iddescricaocategoria">
                                                Descrição <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                className='form-control'
                                                id='descricao_iddescricaocategoria'
                                                value={descricaoCategoria}
                                                onChange={(e) => setDescricaoCategoria(e.target.value)}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" onClick={handleCreateCategoria}>
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeModal === 3 && (
                    <div className="modal d-block fade show" style={{
                        transition: 'opacity 0.5s ease',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    }}
                        tabIndex="-1">
                        <div className="modal-dialog modal-lg">

                            <div className="modal-content">
                                {/* Cabeçalho */}

                                <div className="modal-header bg-secondary text-white">
                                    <h5 className="modal-title">Incluir Conta Contábil</h5>
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

                                    {/* Lado Esquerdo */}
                                    <div className="">
                                        <div className="form-group">
                                            <label className="form-label mt-2 mb-2" htmlFor="nome_conta">
                                                Nome <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="nome_conta"
                                                name="nome_conta"
                                                value={nomeConta}
                                                onChange={(e) => setNomeConta(e.target.value)}
                                            />

                                            <label className="form-label mt-2" htmlFor="saldoConta">Saldo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="saldoConta"
                                                name="saldoConta"
                                                step="0.01"
                                                value={valorConta}
                                                onChange={handleSaldoChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" onClick={handleCreateConta}>
                                        Salvar
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
