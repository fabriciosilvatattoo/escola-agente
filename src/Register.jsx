import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserPlus, GraduationCap } from 'lucide-react';
import './App.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                // Auto-login após cadastro
                login(data.token, data.user);
            } else {
                setError(data.error || 'Erro ao cadastrar');
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
                    <h1>Crie sua conta</h1>
                    <p>Comece sua jornada de aprendizado</p>
                </div>
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Nome completo</label>
                        <input type="text" placeholder="Seu nome" value={name}
                            onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="seu@email.com" value={email}
                            onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Senha</label>
                        <input type="password" placeholder="Mínimo 6 caracteres" value={password}
                            onChange={e => setPassword(e.target.value)} required minLength={6} />
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                    <button type="submit" className="btn-primary w-100" disabled={submitting}>
                        <UserPlus size={18} /> {submitting ? 'Criando...' : 'Criar conta'}
                    </button>
                </form>
                <p className="login-footer">
                    Já tem conta? <Link to="/login">Fazer login</Link>
                </p>
            </div>
        </div>
    );
}
