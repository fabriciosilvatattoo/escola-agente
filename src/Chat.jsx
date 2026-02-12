import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import './App.css';

export default function Chat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Olá, ${user?.name?.split(' ')[0] || 'Aluno'}! Sou a IA da Andreza Tattoo Academy. 🧠\nPosso ajudar com dúvidas sobre as aulas, técnicas de tatuagem ou materiais. O que você quer aprender hoje?` }
    ]);
    const [input, setInput] = useState('');
    const [streaming, setStreaming] = useState(false);
    const chatEndRef = useRef(null);

    // Scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streaming]);

    const sendMessage = async () => {
        if (!input.trim() || streaming) return;

        const userMsg = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setStreaming(true);

        // Mock response
        setMessages(prev => [...prev, { role: 'assistant', content: '...' }]); // Placeholder

        // Simula delay de rede e streaming
        setTimeout(() => {
            const mockResponse = "Essa é uma resposta simulada do Tutor IA. Em produção, isso conectaria ao GLM-4.7 para analisar sua dúvida sobre tatuagem com base no conteúdo do curso. 🎨";
            let i = 0;
            const interval = setInterval(() => {
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = { role: 'assistant', content: mockResponse.slice(0, i + 1) };
                    return newMsgs;
                });
                i++;
                if (i === mockResponse.length) {
                    clearInterval(interval);
                    setStreaming(false);
                }
            }, 30);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={styles.container} className="animate-fade-in">
            <div style={styles.header}>
                <div style={styles.headerIcon}>
                    <Sparkles size={24} color="#fff" />
                </div>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Tutor IA</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tire dúvidas 24/7 sobre o conteúdo</p>
                </div>
            </div>

            <div className="glass-panel" style={styles.chatWindow}>
                <div style={styles.messagesArea}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: '20px'
                        }}>
                            <div style={msg.role === 'user' ? styles.userBubble : styles.botBubble}>
                                <div style={styles.msgHeader}>
                                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8 }}>
                                        {msg.role === 'assistant' ? 'NEXUS AI' : 'Você'}
                                    </span>
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div style={styles.inputArea}>
                    <div style={styles.inputWrapper}>
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite sua dúvida aqui..."
                            style={styles.input}
                            rows={1}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || streaming}
                            style={{
                                ...styles.sendBtn,
                                opacity: !input.trim() ? 0.5 : 1,
                                cursor: !input.trim() ? 'default' : 'pointer'
                            }}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' },

    header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },

    headerIcon: {
        width: '48px', height: '48px', borderRadius: '16px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
    },

    chatWindow: {
        flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        border: '1px solid var(--glass-border)'
    },

    messagesArea: {
        flex: 1, overflowY: 'auto', padding: '30px',
        display: 'flex', flexDirection: 'column'
    },

    userBubble: {
        background: 'rgba(139, 92, 246, 0.2)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '20px 20px 4px 20px',
        padding: '16px 20px',
        maxWidth: '80%',
        color: 'var(--text-primary)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },

    botBubble: {
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid var(--border)',
        borderRadius: '20px 20px 20px 4px',
        padding: '16px 20px',
        maxWidth: '80%',
        color: 'var(--text-secondary)',
        backdropFilter: 'blur(10px)'
    },

    msgHeader: {
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px',
        color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: '8px'
    },

    inputArea: {
        padding: '20px',
        borderTop: '1px solid var(--border)',
        background: 'rgba(15, 23, 42, 0.4)'
    },

    inputWrapper: {
        position: 'relative', display: 'flex', alignItems: 'center',
        background: 'rgba(2, 6, 23, 0.6)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '8px'
    },

    input: {
        flex: 1, background: 'transparent', border: 'none', color: '#fff',
        fontSize: '1rem', padding: '12px 16px', resize: 'none', outline: 'none',
        fontFamily: 'var(--font-sans)', maxHeight: '100px'
    },

    sendBtn: {
        width: '44px', height: '44px', borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s'
    }
};
