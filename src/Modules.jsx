import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle } from 'lucide-react';
import './App.css';

function Modules() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/modules')
            .then(res => res.json())
            .then(data => {
                setModules(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    if (loading) return <div className="loader">Carregando seus cursos...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Meus Cursos</h1>
                <p style={styles.subtitle}>Continue de onde parou e avance sua carreira</p>
            </header>

            <div style={styles.grid}>
                {modules.map(mod => (
                    <div key={mod.id} className="module-card glass-panel hover-scale" style={styles.card}>
                        <div style={{ ...styles.cover, backgroundImage: `url(${mod.cover_image})` }}>
                            <div style={styles.overlay}>
                                <span style={styles.badge}>Módulo {mod.id}</span>
                            </div>
                        </div>

                        <div style={styles.content}>
                            <h3 style={styles.cardTitle}>{mod.title}</h3>
                            <p style={styles.desc}>{mod.description}</p>

                            <div style={styles.progressContainer}>
                                <div style={styles.progressBar}>
                                    <div style={{ width: '30%', height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                                </div>
                                <span style={styles.progressText}>30% concluído</span>
                            </div>

                            <Link to={`/modules/${mod.id}`} className="btn-primary" style={styles.btn}>
                                <PlayCircle size={18} /> Continuar Aula
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '50px',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '700',
        background: 'linear-gradient(to right, #fff, #94a3b8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '10px'
    },
    subtitle: {
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '30px',
    },
    card: {
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(180deg, rgba(30,32,40,0.6) 0%, rgba(30,32,40,0.3) 100%)',
        display: 'flex',
        flexDirection: 'column',
    },
    cover: {
        height: '200px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(15,17,21,0.8) 100%)',
        padding: '15px'
    },
    badge: {
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        color: '#fff',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    content: {
        padding: '24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    cardTitle: {
        fontSize: '1.25rem',
        color: 'var(--text-primary)',
        marginBottom: '10px',
        fontWeight: 600,
    },
    desc: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
        marginBottom: '20px',
        flex: 1,
    },
    progressContainer: {
        marginBottom: '20px',
    },
    progressBar: {
        width: '100%',
        height: '6px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
        marginBottom: '8px',
        overflow: 'hidden'
    },
    progressText: {
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
    },
    btn: {
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center'
    }
};

export default Modules;
