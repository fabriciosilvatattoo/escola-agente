import { useEffect, useState } from 'react';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        fetch('/api/feed')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Erro ao carregar feed');
                setLoading(false);
            });
    };

    const handleCreatePost = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: newPost })
        })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao criar post');
                return res.json();
            })
            .then(post => {
                setPosts([post, ...posts]);
                setNewPost('');
            })
            .catch(err => alert('Erro ao postar'));
    };

    if (loading) return <div style={styles.centered}>Carregando feed...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Comunidade</h1>

            <div style={styles.createPost}>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="No que você está pensando?"
                    style={styles.textarea}
                />
                <button onClick={handleCreatePost} disabled={!newPost} style={styles.postBtn}>Publicar</button>
            </div>

            <div style={styles.feed}>
                {posts.map(post => (
                    <div key={post.id} style={styles.post}>
                        <div style={styles.postHeader}>
                            <div style={styles.avatar}>{post.author_name[0]}</div>
                            <div>
                                <strong style={styles.author}>{post.author_name}</strong>
                                <span style={styles.date}>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <p style={styles.content}>{post.content}</p>
                        <div style={styles.actions}>
                            <button style={styles.likeBtn}>❤️ {post.likes_count}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '30px',
        color: '#333',
    },
    createPost: {
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
        marginBottom: '40px',
    },
    textarea: {
        width: '100%',
        minHeight: '100px',
        border: '1px solid #eee',
        borderRadius: '10px',
        padding: '15px',
        fontSize: '1rem',
        resize: 'vertical',
        outline: 'none',
        marginBottom: '15px',
    },
    postBtn: {
        background: '#667eea',
        color: 'white',
        border: 'none',
        padding: '10px 25px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        float: 'right',
    },
    feed: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    post: {
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    },
    postHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '15px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        background: '#667eea',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    author: {
        display: 'block',
        color: '#333',
    },
    date: {
        fontSize: '0.8rem',
        color: '#999',
    },
    content: {
        lineHeight: '1.6',
        color: '#444',
        marginBottom: '15px',
    },
    actions: {
        borderTop: '1px solid #eee',
        paddingTop: '15px',
    },
    likeBtn: {
        background: 'transparent',
        border: 'none',
        color: '#e53e3e',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    centered: {
        textAlign: 'center',
        padding: '50px',
        color: '#666',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: '20px',
    }
};

export default Feed;
