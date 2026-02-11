import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogIn, GraduationCap } from 'lucide-react';
import './App.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                login(data.token, data.user);
            } else {
                setError(data.error || 'Email ou senha incorretos');
            }
        } catch {
            setError('Erro de conexão com o servidor');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="glass-panel login-card">
                <div className="login-header">
                    <div className="logo-icon"><GraduationCap size={32} color="white" /></div>
                    <h1>Bem-vindo de volta</h1>
                    <p>Acesse sua conta para continuar</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="seu@email.com" value={email}
                            onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Senha</label>
                        <input type="password" placeholder="••••••••" value={password}
                            onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                    <button type="submit" className="btn-primary w-100" disabled={submitting}>
                        <LogIn size={18} /> {submitting ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <p className="login-footer">
                    Não tem conta? <Link to="/register">Criar conta gratuita</Link>
                </p>
            </div>
        </div>
    );
}
