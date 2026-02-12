import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Send, Heart, MessageCircle, MoreHorizontal, User } from 'lucide-react';
import './App.css';

export default function Feed() {
    const { user, token } = useAuth();

    // Mock posts para preview
    const mockPosts = [
        {
            id: 1,
            author_name: 'Andreza Souza',
            role: 'Instrutora',
            content: 'Pessoal, acabei de liberar o módulo de Colorimetria! Quero ver os exercícios de vocês. 🎨',
            likes_count: 24,
            created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 2,
            author_name: 'Carlos Silva',
            role: 'Aluno',
            content: 'Alguém tem dica de qual agulha usar pra traço fino em pele madura?',
            likes_count: 5,
            created_at: new Date(Date.now() - 86400000).toISOString()
        }
    ];

    const [posts, setPosts] = useState(mockPosts);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(false);

    // useEffect(() => { fetchPosts(); }, []);

    // const fetchPosts = () => {
    //     setLoading(true);
    //     fetch('/api/feed')
    //         .then(res => res.json())
    //         .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
    //         .catch(() => setLoading(false));
    // };

    const handlePost = async () => {
        if (!newPost.trim()) return;

        // Mock post local
        const post = {
            id: Date.now(),
            author_name: user?.name || 'Eu',
            role: 'Aluno',
            content: newPost,
            likes_count: 0,
            created_at: new Date().toISOString()
        };

        setPosts([post, ...posts]);
        setNewPost('');

        /* 
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ content: newPost }),
            });
            ...
        } 
        */
    };

    if (loading) return <div className="loader">Carregando comunidade...</div>;

    return (
        <div style={styles.container} className="animate-fade-in">
            <div style={styles.header}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '8px' }}>Comunidade</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Troque experiências com outros tatuadores.</p>
            </div>

            <div className="glass-panel" style={styles.composer}>
                <div style={styles.composerHeader}>
                    <div style={styles.avatar}>
                        {user?.name ? user.name[0].toUpperCase() : <User size={20} />}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Criar publicação</span>
                </div>

                <textarea
                    style={styles.textarea}
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    placeholder="No que você está pensando hoje?"
                    rows={3}
                />

                <div style={styles.composerFooter}>
                    <button
                        onClick={handlePost}
                        disabled={!newPost.trim()}
                        className="btn-primary"
                        style={{ opacity: !newPost.trim() ? 0.6 : 1, padding: '8px 20px', fontSize: '0.9rem' }}
                    >
                        <Send size={16} /> Publicar
                    </button>
                </div>
            </div>

            <div style={styles.feed}>
                {posts.length === 0 && (
                    <div style={styles.empty}>
                        <MessageCircle size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>Nenhuma publicação ainda. Seja o primeiro!</p>
                    </div>
                )}

                {posts.map(post => (
                    <div key={post.id} className="glass-card" style={styles.post}>
                        <div style={styles.postHeader}>
                            <div style={post.role === 'Instrutora' ? styles.avatarAdmin : styles.avatarUser}>
                                {post.author_name[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={styles.authorName}>{post.author_name}</span>
                                    {post.role === 'Instrutora' && (
                                        <span style={styles.badge}>Instrutora</span>
                                    )}
                                </div>
                                <div style={styles.postDate}>
                                    {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <button style={styles.moreBtn}><MoreHorizontal size={20} /></button>
                        </div>

                        <p style={styles.postContent}>{post.content}</p>

                        <div style={styles.postActions}>
                            <button style={styles.actionBtn}>
                                <Heart size={18} />
                                <span>{post.likes_count || 0}</span>
                            </button>
                            <button style={styles.actionBtn}>
                                <MessageCircle size={18} />
                                <span>Comentar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '700px', margin: '0 auto', paddingBottom: '60px' },
    header: { marginBottom: '32px', textAlign: 'center' },

    composer: {
        padding: '24px', marginBottom: '32px', border: '1px solid var(--glass-border)'
    },
    composerHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },

    avatar: {
        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)'
    },

    textarea: {
        width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '1rem',
        resize: 'none', fontFamily: 'var(--font-sans)', outline: 'none',
        marginBottom: '16px', minHeight: '100px'
    },

    composerFooter: { display: 'flex', justifyContent: 'flex-end' },

    feed: { display: 'flex', flexDirection: 'column', gap: '20px' },
    empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' },

    post: { padding: '24px' },

    postHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },

    avatarUser: {
        width: '42px', height: '42px', borderRadius: '12px',
        background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '1rem', border: '1px solid var(--border)'
    },

    avatarAdmin: {
        width: '42px', height: '42px', borderRadius: '12px',
        background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.4)'
    },

    authorName: { color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' },

    badge: {
        background: 'rgba(219, 39, 119, 0.2)', color: '#fbcfe8',
        fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px',
        fontWeight: 600, textTransform: 'uppercase'
    },

    postDate: { color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' },

    moreBtn: {
        background: 'transparent', border: 'none', color: 'var(--text-muted)',
        cursor: 'pointer', padding: '8px', borderRadius: '8px',
        transition: 'background 0.2s'
    },

    postContent: {
        color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '1rem', marginBottom: '20px',
        whiteSpace: 'pre-wrap'
    },

    postActions: {
        borderTop: '1px solid var(--border)', paddingTop: '16px',
        display: 'flex', gap: '24px'
    },

    actionBtn: {
        background: 'transparent', border: 'none', color: 'var(--text-secondary)',
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', fontFamily: 'var(--font-sans)',
        transition: 'color 0.2s'
    }
};
