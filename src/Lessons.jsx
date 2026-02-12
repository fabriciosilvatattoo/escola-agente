import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock, BookOpen } from 'lucide-react';
import './App.css';

export default function Lessons() {
    const { id } = useParams();

    // Mock data para preview imediato se a API falhar ou demorar
    const mockData = {
        module: {
            title: 'Fundamentos da Arte',
            description: 'Módulo introdutório sobre luz, sombra e composição para tatuadores iniciantes.',
            lessons_count: 5
        },
        lessons: [
            { id: 1, title: 'Introdução à Luz e Sombra', duration: '15:20' },
            { id: 2, title: 'Perspectiva Básica de 1 Ponto', duration: '22:15' },
            { id: 3, title: 'Teoria das Cores na Pele', duration: '18:45' },
            { id: 4, title: 'Composição Dinâmica', duration: '25:00' },
            { id: 5, title: 'Exercício Prático: Esfera', duration: '10:00' },
        ]
    };

    const [data, setData] = useState(mockData);
    const [loading, setLoading] = useState(false); // Mock loading false

    // useEffect(() => {
    //     setLoading(true);
    //     fetch(`/api/modules/${id}`)
    //         .then(res => res.json())
    //         .then(json => { setData(json); setLoading(false); })
    //         .catch(() => {
    //             // Fallback to mock on error
    //             setData(mockData);
    //             setLoading(false);
    //         });
    // }, [id]);

    if (loading) return <div className="loader">Carregando aulas...</div>;
    if (!data) return <div className="error-msg">Módulo não encontrado</div>;

    const { module, lessons } = data;

    return (
        <div style={styles.container} className="animate-fade-in">
            <Link to="/modules" className="back-link" style={styles.backLink}>
                <ArrowLeft size={18} /> Voltar aos cursos
            </Link>

            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{module.title}</h1>
                    <p style={styles.desc}>{module.description}</p>
                </div>
                <div className="glass-panel" style={styles.stats}>
                    <BookOpen size={24} color="var(--primary)" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                            {lessons ? lessons.length : 0} aulas
                        </span>
                    </div>
                </div>
            </div>

            <div style={styles.list}>
                {lessons && lessons.map((lesson, i) => (
                    <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="glass-card hover-scale" style={styles.lessonCard}>
                        <div style={styles.num}>{String(i + 1).padStart(2, '0')}</div>

                        <div style={styles.info}>
                            <h3 style={styles.lessonTitle}>{lesson.title}</h3>
                            <div style={styles.meta}>
                                <div style={styles.metaItem}>
                                    <Play size={14} color="var(--secondary)" fill="var(--secondary)" />
                                    <span>Vídeo Aula</span>
                                </div>
                                <div style={styles.metaItem}>
                                    <Clock size={14} color="var(--text-muted)" />
                                    <span>{lesson.duration || '20:00'}</span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.playBtn}>
                            <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
                        </div>
                    </Link>
                ))}

                {lesson && lessons.length === 0 && (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Nenhuma aula disponível neste módulo ainda.
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', paddingBottom: '60px' },

    backLink: {
        display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px',
        color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
        padding: '8px 16px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)',
        transition: 'background 0.2s'
    },

    header: {
        marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px'
    },
    headerContent: { flex: 1, minWidth: '300px' },
    desc: { color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '600px' },

    stats: {
        display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderRadius: '16px',
        minWidth: '160px', border: '1px solid var(--glass-border)'
    },

    list: { display: 'flex', flexDirection: 'column', gap: '16px' },

    lessonCard: {
        display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px',
        textDecoration: 'none', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },

    num: {
        color: 'var(--text-muted)', fontWeight: 800, fontSize: '1.5rem',
        width: '50px', textAlign: 'center', flexShrink: 0, opacity: 0.3, letterSpacing: '-1px'
    },

    info: { flex: 1 },

    lessonTitle: {
        color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem',
        margin: 0, marginBottom: '8px'
    },

    meta: { display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 500 },

    playBtn: {
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
        transition: 'transform 0.2s'
    }
};
