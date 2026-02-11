import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock } from 'lucide-react';

export default function Lessons() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/modules/${id}`)
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div style={styles.loading}>Carregando aulas...</div>;
    if (!data) return <div style={styles.loading}>Módulo não encontrado</div>;

    const { module, lessons } = data;

    return (
        <div style={styles.container}>
            <Link to="/modules" style={styles.back}><ArrowLeft size={16} /> Voltar aos cursos</Link>

            <div style={styles.header}>
                <h1 style={styles.title}>{module.title}</h1>
                <p style={styles.desc}>{module.description}</p>
                <span style={styles.count}>{lessons.length} aula{lessons.length !== 1 ? 's' : ''}</span>
            </div>

            <div style={styles.list}>
                {lessons.map((lesson, i) => (
                    <Link key={lesson.id} to={`/lessons/${lesson.id}`} style={styles.card} className="hover-scale">
                        <div style={styles.num}>{String(i + 1).padStart(2, '0')}</div>
                        <div style={styles.info}>
                            <h3 style={styles.lessonTitle}>{lesson.title}</h3>
                            <div style={styles.meta}>
                                <Play size={14} style={{ color: '#8b5cf6' }} />
                                <span>Vídeo Aula</span>
                            </div>
                        </div>
                        <div style={styles.arrow}>→</div>
                    </Link>
                ))}
                {lessons.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Nenhuma aula disponível ainda.</p>}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#64748b', fontSize: '1.1rem' },
    back: {
        display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
        color: '#8b5cf6', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem',
    },
    header: {
        marginBottom: '36px', paddingBottom: '24px', borderBottom: '1px solid var(--border)',
    },
    title: {
        fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '8px',
        background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    desc: { color: '#94a3b8', fontSize: '1rem', lineHeight: 1.5, marginBottom: '12px' },
    count: { color: '#64748b', fontSize: '0.85rem', background: 'var(--bg-card)', padding: '4px 12px', borderRadius: '20px' },
    list: { display: 'flex', flexDirection: 'column', gap: '10px' },
    card: {
        display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px',
        background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)',
        textDecoration: 'none', transition: 'all 0.15s',
    },
    num: { color: '#64748b', fontWeight: 700, fontSize: '1.1rem', width: '32px', textAlign: 'center', flexShrink: 0 },
    info: { flex: 1 },
    lessonTitle: { color: '#fff', fontWeight: 600, fontSize: '1rem', margin: 0, marginBottom: '4px' },
    meta: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem' },
    arrow: { color: '#64748b', fontSize: '1.2rem', flexShrink: 0 },
};
