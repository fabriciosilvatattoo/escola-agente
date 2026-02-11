import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Send, Heart, MessageCircle } from 'lucide-react';

export default function Feed() {
    const { user, token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchPosts(); }, []);

    const fetchPosts = () => {
        fetch('/api/feed')
            .then(res => res.json())
            .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    const handlePost = async () => {
        if (!newPost.trim()) return;
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ content: newPost }),
            });
            if (!res.ok) throw new Error();
            const post = await res.json();
            setPosts([post, ...posts]);
            setNewPost('');
        } catch {
            alert('Faça login para postar');
        }
    };

    if (loading) return <div style={styles.loading}>Carregando comunidade...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.pageTitle}>Comunidade</h1>
            <p style={styles.pageSub}>Compartilhe experiências com outros alunos</p>

            <div style={styles.composer}>
                <div style={styles.composerTop}>
                    <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                    <textarea
                        style={styles.textarea} value={newPost}
                        onChange={e => setNewPost(e.target.value)}
                        placeholder="Compartilhe algo com a comunidade..."
                        rows={2}
                    />
                </div>
                <div style={styles.composerBottom}>
                    <button onClick={handlePost} disabled={!newPost.trim()} style={styles.postBtn}>
                        <Send size={16} /> Publicar
                    </button>
                </div>
            </div>

            <div style={styles.feed}>
                {posts.length === 0 && (
                    <div style={styles.empty}>
                        <MessageCircle size={40} style={{ color: '#64748b', marginBottom: '12px' }} />
                        <p>Nenhuma publicação ainda. Seja o primeiro!</p>
                    </div>
                )}
                {posts.map(post => (
                    <div key={post.id} style={styles.post}>
                        <div style={styles.postHeader}>
                            <div style={styles.postAvatar}>{post.author_name?.[0]?.toUpperCase() || '?'}</div>
                            <div>
                                <div style={styles.authorName}>{post.author_name || 'Anônimo'}</div>
                                <div style={styles.postDate}>{new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            </div>
                        </div>
                        <p style={styles.postContent}>{post.content}</p>
                        <div style={styles.postActions}>
                            <button style={styles.likeBtn}><Heart size={16} /> {post.likes_count || 0}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '640px', margin: '0 auto' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#64748b' },
    pageTitle: {
        fontSize: '2rem', fontWeight: 700, marginBottom: '6px',
        background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    pageSub: { color: '#64748b', marginBottom: '32px', fontSize: '1rem' },
    composer: {
        background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)',
        padding: '20px', marginBottom: '32px',
    },
    composerTop: { display: 'flex', gap: '12px', marginBottom: '12px' },
    avatar: {
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '1rem',
    },
    textarea: {
        flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '0.95rem',
        resize: 'none', fontFamily: 'var(--font-sans)', outline: 'none',
    },
    composerBottom: { display: 'flex', justifyContent: 'flex-end' },
    postBtn: {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: '#fff',
        border: 'none', padding: '10px 20px', borderRadius: '10px',
        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
    },
    feed: { display: 'flex', flexDirection: 'column', gap: '16px' },
    empty: { textAlign: 'center', padding: '60px 20px', color: '#64748b' },
    post: {
        background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)',
        padding: '20px',
    },
    postHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' },
    postAvatar: {
        width: '36px', height: '36px', borderRadius: '10px',
        background: 'var(--bg-hover)', color: '#8b5cf6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.9rem',
    },
    authorName: { color: '#fff', fontWeight: 600, fontSize: '0.9rem' },
    postDate: { color: '#64748b', fontSize: '0.75rem' },
    postContent: { color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '14px' },
    postActions: { borderTop: '1px solid var(--border)', paddingTop: '12px' },
    likeBtn: {
        background: 'transparent', border: 'none', color: '#ef4444',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
    },
};
