import MenuAdmin from '@/components/MenuAdmin';
import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';
import GraficoGastosMensais from '@/components/GraficoGastosMensais';

export default function Admin() {
    const router = useRouter();
    const CATEGORIA_API = "http://localhost:8080/api/categoria";
    const CONTA_API = "http://localhost:8080/api/conta";
    const METAS_API = "http://localhost:8080/api/metas";

    const [message, setMessage] = useState({ message: "", status: "" });
    const [errors, setErrors] = useState({});
    const [nome, setNome] = useState('');
    const [metas, setMetas] = useState([]);
    const [descricao, setDescricao] = useState('');

    const [categoria, setCategoria] = useState([]);
    const [idCategoria, setIdCategoria] = useState(0);

    const [dataLimite, setdataLimite] = useState('');
    const [activeModal, setActiveModal] = useState(false);
    const [valorAlvo, setValorAlvo] = useState(0);
    const [valorAtual, setValorAtual] = useState(0);

    const openModal = () => {

        setActiveModal(true);
    };

    const validateFields = () => {
        const newErrors = {};
        if (!nome.trim()) newErrors.nome = true;


        if (!idCategoria) newErrors.nome = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleCreateMeta = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            setMessage({ message: "Por favor, preencha todos os campos obrigatórios.", status: "error" });
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Dados que você quer enviar para criar a meta
            const metaData = {
                nome,
                idCategoria,
                descricao,
                dataLimite,
                valorAlvo,
                valorAtual,
            };

            // Enviando para a rota do backend que cria a meta (exemplo /api/metas)
            const response = await Axios.post(METAS_API, metaData, config);



            // Se deu certo, avisa sucesso e limpa campos ou fecha modal
            setMessage({ message: "Meta criada com sucesso!", status: "ok" });
            // Você pode limpar campos aqui, ex:
            setNome('');
            setIdCategoria('');
            setDescricao('');
            setdataLimite('');
            setValorAlvo(0);
            setValorAtual(0);
            window.location.reload();

        } catch (error) {
            const errorMessage = error.response?.data?.msg || "Erro ao criar Meta!";
            setMessage({ message: errorMessage, status: "error" });
        }
    };


    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) router.push('/');

        const fetchMetas = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const response = await Axios.get(METAS_API, config);
                console.log("Response Metas: ", response);
                setMetas(response.data);
            } catch (error) {
                setMessage('Erro ao carregar metas');
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await Axios.get(CATEGORIA_API);
                if (response.status === 200) setCategoria(response.data);
            } catch { }
        };

        fetchCategories();


        fetchMetas();
        openModal();
    }, []);


    const closeModal = () => setActiveModal(false);

    return (
        <>
            <Head>
                <title>ECOGASTO</title>
                <meta name="description" content="Administração - Ecogasto" />
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
                <div className="container mt-4">

                    <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                            <div className="card h-100 shadow">
                                <div className="card-body">

                                    <GraficoGastosMensais />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="card h-100 shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Maiores gastos</h5>
                                    <ul>
                                        <li>Aluguel: R$ 1.200,00</li>
                                        <li>Mercado: R$ 850,00</li>
                                        <li>Transporte: R$ 300,00</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="card h-100 shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Metas de valores a bater</h5>
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        <ol className="list-group list-group-numbered">
                                            {metas.length === 0 ? (
                                                <li className="list-group-item">Nenhuma meta encontrada.</li>
                                            ) : (
                                                metas.map(meta => (
                                                    <li key={meta.idmeta} className="list-group-item border border-success mt-2">
                                                        <div><strong>Nome:</strong> {meta.nome}</div>
                                                        <div>
                                                            <strong>Valor:</strong> R$ {(Number(meta.valor_alvo) || 0).toFixed(2)} |
                                                            <strong> Data Limite:</strong> {new Date(meta.data_limite).toLocaleDateString()}
                                                        </div>
                                                    </li>
                                                ))

                                            )}
                                        </ol>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-success mt-3" onClick={() => setActiveModal(1)}>
                                            Incluir Metas
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="card h-100 shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Progresso das metas</h5>

                                    {metas.length === 0 ? (
                                        <p>Nenhuma meta cadastrada.</p>
                                    ) : (
                                        metas.map((meta, index) => {
                                            const valorAtual = Number(meta.valor_atual || 0);
                                            const valorAlvo = Number(meta.valor_alvo || 1); // evitar divisão por zero
                                            const progresso = Math.min(100, ((valorAtual / valorAlvo) * 100).toFixed(2));

                                            // Cor condicional
                                            let progressClass = "bg-danger";
                                            if (progresso >= 70) progressClass = "bg-success";
                                            else if (progresso >= 40) progressClass = "bg-warning";

                                            return (
                                                <div key={meta.idmeta} className="mb-4 p-2 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
                                                    <strong>{meta.nome}</strong>
                                                    <p className="mb-1">Progresso: {progresso}%</p>
                                                    <div className="progress mb-2" style={{ height: '20px' }}>
                                                        <div
                                                            className={`progress-bar ${progressClass}`}
                                                            role="progressbar"
                                                            style={{ width: `${progresso}%` }}
                                                            aria-valuenow={progresso}
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        >
                                                            {progresso}%
                                                        </div>
                                                    </div>
                                                    <label htmlFor={`range-${index}`} className="form-label">
                                                        Atualizar valor atual: R$ {valorAtual.toFixed(2)}
                                                    </label>
                                                    <input
                                                        type="range"
                                                        className="form-range"
                                                        id={`range-${index}`}
                                                        min="0"
                                                        max={valorAlvo}
                                                        step="1"
                                                        value={valorAtual}
                                                        onChange={(e) => {
                                                            const novoValor = Number(e.target.value);
                                                            const novasMetas = [...metas];
                                                            novasMetas[index].valor_atual = novoValor;
                                                            setMetas(novasMetas);
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
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
                                <h5 className="modal-title">Incluir Metas</h5>
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

                                            {/* <label className="form-label mt-2 mb-2" htmlFor="descricao_iddescricaotransacao">
                                                Descrição <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                className='form-control'
                                                id='descricao_iddescricaotransacao'
                                                value={descricao}
                                                onChange={(e) => setDescricao(e.target.value)}></textarea> */}
                                        </div>
                                    </div>

                                    {/* Lado Direito */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label mt-2" htmlFor="dataLimite">Data Limite</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="dataLimite"
                                                name="dataLimite"
                                                value={dataLimite}
                                                onChange={(e) => setdataLimite(e.target.value)}

                                            />

                                            <label className="form-label mt-2" htmlFor="valorAlvo">Valor Alvo</label>
                                            <div className="d-flex align-items-center gap-3">
                                                <input
                                                    type="range"
                                                    className="form-range flex-grow-1"
                                                    id="valorAlvo"
                                                    name="valorAlvo"
                                                    min="0"
                                                    max="350000"
                                                    step="1"
                                                    value={valorAlvo}
                                                    onChange={(e) => setValorAlvo(Number(e.target.value))}
                                                />
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    style={{ width: '100px' }}
                                                    min="0"
                                                    max="350000"
                                                    step="1"
                                                    value={valorAlvo}
                                                    onChange={(e) => {
                                                        let val = Number(e.target.value);
                                                        if (val < 0) val = 0;
                                                        if (val > 350000) val = 350000;
                                                        setValorAlvo(val);
                                                    }}
                                                />
                                            </div>

                                            <label className="form-label mt-2" htmlFor="valorAtual">Valor Atual</label>
                                            <div className="d-flex align-items-center gap-3">
                                                <input
                                                    type="range"
                                                    className="form-range flex-grow-1"
                                                    id="valorAtual"
                                                    name="valorAtual"
                                                    min="0"
                                                    max="350000"
                                                    step="1"
                                                    value={valorAtual}
                                                    onChange={(e) => setValorAtual(Number(e.target.value))}
                                                />
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    style={{ width: '100px' }}
                                                    min="0"
                                                    max="350000"
                                                    step="1"
                                                    value={valorAtual}
                                                    onChange={(e) => {
                                                        let val = Number(e.target.value);
                                                        if (val < 0) val = 0;
                                                        if (val > 350000) val = 350000;
                                                        setValorAtual(val);
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={handleCreateMeta}>
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
