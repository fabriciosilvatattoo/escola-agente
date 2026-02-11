import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function LessonPlayer() {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`/api/lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao buscar aula');
                return res.json();
            })
            .then(data => {
                setLesson(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Erro ao carregar aula.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={styles.centered}>Carregando aula...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            <Link to={`/modules/${lesson.module_id}`} style={styles.backLink}>← Voltar para o Módulo</Link>

            <div style={styles.videoContainer}>
                {lesson.video_url && (
                    <iframe
                        width="100%"
                        height="500"
                        src={lesson.video_url}
                        title={lesson.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={styles.iframe}
                    ></iframe>
                )}
            </div>

            <div style={styles.content}>
                <h1 style={styles.title}>{lesson.title}</h1>
                <div style={styles.text}>
                    {lesson.content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            </div>

            <div style={styles.actions}>
                <button style={styles.completeBtn}>Marcar como Concluída ✅</button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
    },
    backLink: {
        display: 'inline-block',
        marginBottom: '20px',
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    videoContainer: {
        background: '#000',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        marginBottom: '30px',
    },
    iframe: {
        display: 'block',
    },
    content: {
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    },
    title: {
        marginTop: 0,
        marginBottom: '20px',
        color: '#333',
    },
    text: {
        lineHeight: '1.8',
        color: '#555',
        fontSize: '1.1rem',
    },
    actions: {
        marginTop: '30px',
        textAlign: 'right',
    },
    completeBtn: {
        background: '#38a169',
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.2s',
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

export default LessonPlayer;
