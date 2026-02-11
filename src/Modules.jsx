import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Modules() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/modules', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao buscar módulos');
                return res.json();
            })
            .then(data => {
                setModules(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Não foi possível carregar os módulos.');
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={styles.centered}>Carregando módulos...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Meus Módulos</h1>

            <div style={styles.grid}>
                {modules.length > 0 ? (
                    modules.map(mod => (
                        <div key={mod.id} style={styles.card}>
                            <div style={{ ...styles.cover, backgroundImage: `url(${mod.cover_image})` }}></div>
                            <div style={styles.content}>
                                <h3 style={styles.cardTitle}>{mod.title}</h3>
                                <p style={styles.desc}>{mod.description}</p>
                                <Link to={`/modules/${mod.id}`} style={styles.btn}>
                                    Continuar Curso →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum módulo encontrado.</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '30px',
        color: '#333',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
    },
    card: {
        background: 'white',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s',
    },
    cover: {
        height: '180px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#eee',
    },
    content: {
        padding: '20px',
    },
    cardTitle: {
        margin: '0 0 10px 0',
        fontSize: '1.25rem',
    },
    desc: {
        color: '#666',
        lineHeight: '1.5',
        marginBottom: '20px',
    },
    btn: {
        display: 'inline-block',
        background: '#667eea',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background 0.2s',
    },
    centered: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2rem',
        color: '#666',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: '20px',
    }
};

export default Modules;
