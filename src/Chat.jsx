import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Send, Bot, User } from 'lucide-react';

export default function Chat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Olá${user?.name ? ', ' + user.name.split(' ')[0] : ''}! Sou o tutor IA da NEXUS Academy. Pode me perguntar qualquer coisa sobre tatuagem, técnicas, materiais ou sobre o curso. 🎨` }
    ]);
    const [input, setInput] = useState('');
    const [streaming, setStreaming] = useState(false);
    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streaming]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || streaming) return;

        const userMsg = { role: 'user', content: text };
        const updated = [...messages, userMsg];
        setMessages(updated);
        setInput('');
        setStreaming(true);

        // Adiciona mensagem vazia do assistant que vai preencher via streaming
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        try {
            const res = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ message: text, history: updated.slice(1) }),
            });

            if (!res.ok) throw new Error('Erro na resposta');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;
                        try {
                            const parsed = JSON.parse(data);
                            const delta = parsed.choices?.[0]?.delta?.content || '';
                            accumulated += delta;
                            // Atualiza última mensagem
                            setMessages(prev => {
                                const copy = [...prev];
                                copy[copy.length - 1] = { role: 'assistant', content: accumulated };
                                return copy;
                            });
                        } catch { }
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: 'Desculpe, tive um problema. Tente novamente.' };
                return copy;
            });
        } finally {
            setStreaming(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Bot size={24} style={{ color: '#8b5cf6' }} />
                <div>
                    <h2 style={styles.headerTitle}>Tutor IA</h2>
                    <span style={styles.headerSub}>Powered by GLM-4.7</span>
                </div>
            </div>

            <div style={styles.chatArea}>
                {messages.map((msg, i) => (
                    <div key={i} style={msg.role === 'user' ? styles.userRow : styles.assistantRow}>
                        <div style={msg.role === 'user' ? styles.userAvatar : styles.botAvatar}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div style={msg.role === 'user' ? styles.userBubble : styles.botBubble}>
                            <span style={styles.msgText}>{msg.content}{streaming && i === messages.length - 1 && msg.role === 'assistant' ? '▍' : ''}</span>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div style={styles.inputBar}>
                <textarea
                    ref={textareaRef}
                    style={styles.textarea}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte algo ao tutor..."
                    rows={1}
                    disabled={streaming}
                />
                <button onClick={sendMessage} disabled={streaming || !input.trim()} style={styles.sendBtn}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', maxWidth: '900px', margin: '0 auto' },
    header: {
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        padding: '16px 20px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)',
    },
    headerTitle: { fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 },
    headerSub: { fontSize: '0.75rem', color: '#64748b' },
    chatArea: {
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px',
        padding: '20px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)',
        marginBottom: '16px',
    },
    userRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'flex-start' },
    assistantRow: { display: 'flex', justifyContent: 'flex-start', gap: '10px', alignItems: 'flex-start' },
    userAvatar: {
        width: '32px', height: '32px', borderRadius: '8px', background: '#8b5cf6', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', order: 1,
    },
    botAvatar: {
        width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-hover)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6',
    },
    userBubble: {
        background: 'rgba(139,92,246,0.15)', padding: '12px 16px', borderRadius: '14px 14px 2px 14px',
        maxWidth: '75%', color: '#e2e8f0',
    },
    botBubble: {
        background: 'var(--bg-hover)', padding: '12px 16px', borderRadius: '14px 14px 14px 2px',
        maxWidth: '75%', color: '#e2e8f0',
    },
    msgText: { lineHeight: '1.65', whiteSpace: 'pre-wrap', fontSize: '0.95rem' },
    inputBar: {
        display: 'flex', gap: '10px', alignItems: 'flex-end',
        padding: '12px 16px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)',
    },
    textarea: {
        flex: 1, padding: '12px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
        borderRadius: '10px', color: '#fff', fontSize: '0.95rem', resize: 'none', fontFamily: 'var(--font-sans)',
        maxHeight: '120px', outline: 'none',
    },
    sendBtn: {
        width: '44px', height: '44px', borderRadius: '10px', border: 'none',
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.15s',
    },
};
