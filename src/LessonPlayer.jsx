import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, PlayCircle, FileText } from 'lucide-react';
import './App.css';

export default function LessonPlayer() {
    const { id } = useParams();

    // Mock data para preview
    const mockLesson = {
        id: id || 1,
        module_id: 1,
        title: 'Introdução à Luz e Sombra',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Rick Roll placeholder (trocar por vídeo real)
        content: `
        Nesta aula vamos explorar os princípios fundamentais da iluminação.\n
        1. A fonte de luz determina a direção da sombra.\n
        2. A sombra própria é a parte escura do objeto.\n
        3. A sombra projetada é a sombra no chão/superfície.\n
        \nPratique desenhando esferas com diferentes posições de luz.
        `
    };

    const [lesson, setLesson] = useState(mockLesson);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     setLoading(true);
    //     fetch(`/api/lessons/${id}`)
    //         .then(res => res.json())
    //         .then(data => { setLesson(data); setLoading(false); })
    //         .catch(() => setLoading(false));
    // }, [id]);

    if (loading) return <div className="loader">Carregando aula...</div>;
    if (!lesson) return <div className="error-msg">Aula não encontrada</div>;

    return (
        <div style={styles.container} className="animate-fade-in">
            <Link to={`/modules/${lesson.module_id}`} style={styles.back} className="hover-scale">
                <ArrowLeft size={18} /> Voltar ao módulo
            </Link>

            {lesson.video_url && (
                <div style={styles.videoWrapper} className="glass-card">
                    <iframe
                        width="100%" height="100%" src={lesson.video_url} title={lesson.title}
                        frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen style={{ display: 'block', borderRadius: '16px', border: 'none' }}
                    />
                </div>
            )}

            <div style={styles.contentRow}>
                <div style={{ flex: 1 }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '24px' }}>{lesson.title}</h1>

                    <div className="glass-panel" style={styles.textContent}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--primary)' }}>
                            <FileText size={18} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px' }}>RESUMO DA AULA</span>
                        </div>
                        <div style={styles.textBody}>
                            {lesson.content?.split('\n').map((line, i) => (
                                line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                            ))}
                        </div>
                    </div>
                </div>

                <div style={styles.sidebar}>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.1rem' }}>Status</h3>
                        <button className="btn-primary w-100" style={{ background: 'linear-gradient(135deg, var(--success), #059669)' }}>
                            <CheckCircle size={18} /> Marcar como Concluída
                        </button>

                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>Próxima Aula</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                <PlayCircle size={16} color="var(--text-muted)" />
                                <span>Perspectiva Básica</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', paddingBottom: '80px' },

    back: {
        display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px',
        color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem',
        padding: '8px 16px', borderRadius: '8px',
        transition: 'color 0.2s'
    },

    videoWrapper: {
        position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden',
        background: '#000', borderRadius: '24px', marginBottom: '40px',
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)'
    },

    contentRow: { display: 'flex', gap: '40px', flexWrap: 'wrap' },

    textContent: { padding: '32px', lineHeight: 1.8 },
    textBody: { color: 'var(--text-secondary)', fontSize: '1.05rem' },

    sidebar: { width: '320px', flexShrink: 0 }
};
