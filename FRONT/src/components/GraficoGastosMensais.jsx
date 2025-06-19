import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const CATEGORIA_API = "http://localhost:8080/api/categoria";

const GraficoGastosMensais = () => {
    const [dados, setDados] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [tipo, setTipo] = useState('');
    const [tipoGrafico, setTipoGrafico] = useState('Bar');
    const [idCategoria, setIdCategoria] = useState('');
    const METAS_API = "http://localhost:8080/api/metas";
    const buscarCategorias = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(CATEGORIA_API, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategoria(response.data);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const buscarDados = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {},
            };

            if (dataInicio) config.params.dataInicio = dataInicio;
            if (dataFim) config.params.dataFim = dataFim;
            if (tipo) config.params.tipo = tipo;
            if (idCategoria) config.params.idCategoria = idCategoria;

            const response = await axios.get(`${METAS_API}/grafico`, config);
            setDados(response.data);
        } catch (error) {
            console.error('Erro ao buscar dados do gráfico:', error);
            setDados([]);
        }
    };

    useEffect(() => {
        buscarCategorias();
    }, []);

    useEffect(() => {
        buscarDados();
    }, [dataInicio, dataFim, tipo, idCategoria]);

    const totalGeral = dados.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);

    const dadosGrafico = {
        labels: dados.map((item) => `${item.mes} - ${item.categoria || ''}`),
        datasets: [
            {
                label: 'Total (R$)',
                data: dados.map((item) => item.total),
                backgroundColor:
                    tipoGrafico === 'Bar'
                        ? '#5B0E2D'
                        : ['#5B0E2D', '#6A7B4F', '#C1A35F', '#F4EDE4', '#2C2C2C'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Gráfico de Gastos Mensais</h2>

            <div className="mb-4">
                <div className="row mb-3">
                    <div className="col-6">
                        <label className="form-label">Data Início</label>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label">Data Fim</label>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-6" style={{ minWidth: '200px' }}>
                        <label className="form-label">Categoria</label>
                        <select
                            className="form-select"
                            value={idCategoria}
                            onChange={(e) => setIdCategoria(e.target.value)}
                        >
                            <option value="">-- Todas --</option>
                            {categoria.map((cat) => (
                                <option key={cat.idcategoria} value={cat.idcategoria}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-6">
                            <label className="form-label">Tipo de Gráfico</label>
                            <select
                                value={tipoGrafico}
                                onChange={(e) => setTipoGrafico(e.target.value)}
                                className="form-select"
                            >
                                <option value="Bar">Barras</option>
                                <option value="Pie">Pizza</option>
                            </select>
                    </div>
                </div>
            </div>

            {tipoGrafico === 'Bar' ? (
                <Bar data={dadosGrafico} />
            ) : (
                <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
                    <Pie data={dadosGrafico} />
                </div>
            )}

            <div className="text-center mt-4">
                <span className="text-green-600 font-semibold text-lg">
                    Total no período: R$ {totalGeral.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default GraficoGastosMensais;
