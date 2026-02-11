import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function Lessons() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`/api/modules/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao buscar aulas');
                return res.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Erro ao carregar módulo.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={styles.centered}>Carregando aulas...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    const { module, lessons } = data;

    return (
        <div style={styles.container}>
            <Link to="/modules" style={styles.backLink}>← Voltar</Link>

            <div style={styles.header}>
                <h1 style={styles.title}>{module.title}</h1>
                <p style={styles.subtitle}>{module.description}</p>
            </div>

            <div style={styles.list}>
                {lessons.length > 0 ? (
                    lessons.map((lesson, index) => (
                        <Link key={lesson.id} to={`/lessons/${lesson.id}`} style={styles.lessonCard}>
                            <div style={styles.lessonOrder}>{index + 1}</div>
                            <div style={styles.lessonContent}>
                                <h3>{lesson.title}</h3>
                                <span>{lesson.duration ? lesson.duration : 'Vídeo Aula'}</span>
                            </div>
                            <div style={styles.arrow}>→</div>
                        </Link>
                    ))
                ) : (
                    <p>Nenhuma aula disponível neste módulo ainda.</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '40px',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '10px',
        color: '#333',
    },
    subtitle: {
        color: '#666',
        fontSize: '1.1rem',
    },
    backLink: {
        display: 'inline-block',
        marginBottom: '20px',
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    lessonCard: {
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        textDecoration: 'none',
        color: '#333',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
    },
    lessonOrder: {
        width: '40px',
        height: '40px',
        background: '#f0f4f8',
        color: '#667eea',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '20px',
    },
    lessonContent: {
        flex: 1,
    },
    arrow: {
        color: '#ccc',
        fontSize: '1.5rem',
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

export default Lessons;
