import Head from 'next/head';
import { useState } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';

export default function Home() {
    const API_URL = "http://localhost:8080/api/user/login/";
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ message: "", status: "" });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ message: "", status: "" });

        if (!username || !password) {
            setMessage({ message: "Por favor, preencha todos os campos", status: "error" });
            return;
        }

        try {
            const response = await Axios.get(API_URL + username + "/" + password);

            if (response.status === 200) {
                const { token, userId } = response.data;  // Agora, o backend deve retornar o userId
                localStorage.setItem('authToken', token);
                localStorage.setItem('userId', userId);  // Armazenando o userId
                console.log(userId, " | ", token);
                setMessage({ message: "Login bem-sucedido!", status: "ok" });
                router.push('/home');
            }
        } catch (err) {
            const errorMessage =
                (err.response && err.response.data.msg) || "Erro ao conectar com o servidor. Tente novamente.";
            setMessage({ message: errorMessage, status: "error" });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Head>
                <title>Login</title>
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                    rel="stylesheet"
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                />
            </Head>
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '100vh', background: '#67cf8d' }}
            >
                <div
                    className="card p-4"
                    style={{
                        width: '600px',
                        borderRadius: '15px',
                        background: '#000000',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="container mt-2">
                            {message.status === "ok" && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    {message.message}
                                </div>
                            )}
                            {message.status === "error" && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {message.message}
                                </div>
                            )}
                        </div>

                        <div className="mb-3 text-center">
                            <img
                                src="https://i.ibb.co/CJPQcsX/LOGOECOGASTO.png"
                                alt="Logo"
                                style={{ width: '120px', height: '120px' }}
                            />
                        </div>

                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-user"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-lock"></i>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={togglePasswordVisibility}
                                    style={{ zIndex: 2 }}
                                >
                                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-check mb-3">
                            <input type="checkbox" className="form-check-input" id="rememberMe" />
                            <label className="form-check-label text-white" htmlFor="rememberMe">
                                Remember-me
                            </label>
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-success w-75">
                                Acessar
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <p>
                                <a
                                    href="/user/createuser"
                                    className="text-white text-decoration-none link-primary"
                                >
                                    Não possui uma conta? Acesse aqui para se cadastrar
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
