import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function LessonPlayer() {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/lessons/${id}`)
            .then(res => res.json())
            .then(data => { setLesson(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div style={styles.loading}>Carregando aula...</div>;
    if (!lesson) return <div style={styles.loading}>Aula não encontrada</div>;

    return (
        <div style={styles.container}>
            <Link to={`/modules/${lesson.module_id}`} style={styles.back}>
                <ArrowLeft size={16} /> Voltar ao módulo
            </Link>

            {lesson.video_url && (
                <div style={styles.videoWrap}>
                    <iframe
                        width="100%" height="480" src={lesson.video_url} title={lesson.title}
                        frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen style={{ display: 'block', borderRadius: '12px' }}
                    />
                </div>
            )}

            <div style={styles.content}>
                <h1 style={styles.title}>{lesson.title}</h1>
                <div style={styles.text}>
                    {lesson.content?.split('\n').map((line, i) => (
                        <p key={i} style={{ marginBottom: '12px' }}>{line}</p>
                    ))}
                </div>
            </div>

            <button style={styles.completeBtn}>
                <CheckCircle size={18} /> Marcar como Concluída
            </button>
        </div>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '0 auto' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#64748b' },
    back: {
        display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
        color: '#8b5cf6', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem',
    },
    videoWrap: {
        background: '#000', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)', marginBottom: '32px',
    },
    content: {
        background: 'var(--bg-card)', padding: '36px', borderRadius: '16px',
        border: '1px solid var(--border)', marginBottom: '24px',
    },
    title: { color: '#fff', fontWeight: 700, fontSize: '1.5rem', marginBottom: '20px', marginTop: 0 },
    text: { color: '#94a3b8', lineHeight: 1.8, fontSize: '1rem' },
    completeBtn: {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff',
        border: 'none', padding: '14px 28px', borderRadius: '12px',
        fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(34,197,94,0.3)', transition: 'all 0.15s',
        fontFamily: 'var(--font-sans)',
    },
};
