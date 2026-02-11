import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, GraduationCap } from 'lucide-react';
import './App.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/modules');
            } else {
                setError(data.error || 'Erro ao fazer login');
            }
        } catch (err) {
            setError('Erro de conexão');
        }
    };

    return (
        <div className="login-page">
            <div className="glass-panel login-card">
                <div className="login-header">
                    <div className="logo-icon">
                        <GraduationCap size={32} color="white" />
                    </div>
                    <h1>Bem-vindo de volta</h1>
                    <p>Acesse sua conta para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" className="btn-primary w-100">
                        <LogIn size={18} /> Entrar
                    </button>
                </form>

                <p className="login-footer">
                    Não tem conta? <Link to="/register">Criar conta gratuita</Link>
                </p>
            </div>
        </div>
    );
}
// Estilos locais para simplificar
// ... (Adicionando no App.css logo abaixo)
export default Login;
