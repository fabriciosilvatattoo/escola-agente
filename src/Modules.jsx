import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle } from 'lucide-react';
import './App.css';

function Modules() {
    // Mock data for preview se a API falhar
    const mockModules = [
        { id: 1, title: 'Fundamentos da Arte', description: 'Aprenda luz, sombra e perspectiva para tatuagem.', cover_image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=600' },
        { id: 2, title: 'Anatomia Humana', description: 'Estudo dos musculos e estrutura óssea.', cover_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600' },
        { id: 3, title: 'Colorimetria Avançada', description: 'Teoria das cores aplicada à pele.', cover_image: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&q=80&w=600' }
    ];

    const [modules, setModules] = useState(mockModules);
    const [loading, setLoading] = useState(false); // Mock loading false for preview

    // useEffect(() => {
    //     fetch('/api/modules')
    //         .then(res => res.json())
    //         .then(data => {
    //             setModules(data);
    //             setLoading(false);
    //         })
    //         .catch(err => setLoading(false));
    // }, []);

    if (loading) return <div className="loader">Carregando seus cursos...</div>;

    return (
        <div style={styles.container} className="animate-fade-in">
            <header style={styles.header}>
                <h1 className="text-gradient" style={styles.title}>Meus Cursos</h1>
                <p style={styles.subtitle}>Continue de onde parou e avance sua carreira</p>
            </header>

            <div style={styles.grid}>
                {modules.map(mod => (
                    <div key={mod.id} className="glass-card hover-scale" style={styles.card}>
                        <div style={{ ...styles.cover, backgroundImage: `url(${mod.cover_image})` }}>
                            <div style={styles.overlay}>
                                <span style={styles.badge}>Módulo {mod.id}</span>
                            </div>
                        </div>

                        <div style={styles.content}>
                            <h3 style={styles.cardTitle}>{mod.title}</h3>
                            <p style={styles.desc}>{mod.description}</p>

                            <div style={styles.progressContainer}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={styles.progressText}>Progresso</span>
                                    <span style={{ ...styles.progressText, color: 'var(--primary-light)' }}>30%</span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '4px' }}></div>
                                </div>
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
        marginBottom: '10px',
        background: 'linear-gradient(to right, #fff, var(--text-secondary))', // Fallback
    },
    subtitle: {
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
    },
    card: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // Background e border removidos daqui pois estão na classe .glass-card
    },
    cover: {
        height: '180px',
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
        background: 'linear-gradient(to bottom, transparent 0%, rgba(2,6,23,0.8) 100%)',
        padding: '16px'
    },
    badge: {
        background: 'rgba(139, 92, 246, 0.8)',
        backdropFilter: 'blur(4px)',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
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
        marginBottom: '8px',
        fontWeight: 600,
    },
    desc: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
        marginBottom: '24px',
        flex: 1,
    },
    progressContainer: {
        marginBottom: '24px',
    },
    progressBar: {
        width: '100%',
        height: '6px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressText: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        fontWeight: 500
    },
    btn: {
        width: '100%',
    }
};

export default Modules;
