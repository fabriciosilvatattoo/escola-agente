import { useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { BookOpen, MessageSquare, Users, LogOut, GraduationCap } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname.startsWith(path);

    const menuItems = [
        { path: '/modules', label: 'Meus Cursos', icon: BookOpen },
        { path: '/feed', label: 'Comunidade', icon: Users },
        { path: '/chat', label: 'Tutor IA', icon: MessageSquare },
    ];

    return (
        <aside style={styles.sidebar}>
            <div style={styles.logoContainer}>
                <div style={styles.logoBox}>
                    <GraduationCap size={28} color="#fff" />
                </div>
                <div>
                    <h1 style={styles.brandName}>NEXUS</h1>
                    <span style={styles.brandSub}>Academy</span>
                </div>
            </div>

            <nav style={styles.nav}>
                {menuItems.map(item => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} to={item.path} style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}>
                            {active && <div style={styles.indicator} />}
                            <Icon size={20} style={{ color: active ? '#fff' : '#64748b', flexShrink: 0 }} />
                            <span style={{ color: active ? '#fff' : '#94a3b8', fontWeight: active ? 600 : 400 }}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div style={styles.footer}>
                {user && (
                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>{user.name?.[0]?.toUpperCase() || 'U'}</div>
                        <div>
                            <div style={styles.userName}>{user.name}</div>
                            <div style={styles.userRole}>{user.role === 'admin' ? 'Administrador' : 'Aluno'}</div>
                        </div>
                    </div>
                )}
                <button onClick={logout} style={styles.logoutBtn}>
                    <LogOut size={16} /> Sair
                </button>
            </div>
        </aside>
    );
}

const styles = {
    sidebar: {
        width: '280px', height: '100vh', background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, zIndex: 50, padding: '28px 16px',
    },
    logoContainer: {
        display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '44px', paddingLeft: '12px',
    },
    logoBox: {
        width: '44px', height: '44px', borderRadius: '12px',
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(139,92,246,0.35)',
    },
    brandName: { fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' },
    brandSub: { fontSize: '0.75rem', color: '#64748b', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' },
    nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
    link: {
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
        borderRadius: '10px', textDecoration: 'none', position: 'relative', transition: 'background 0.15s',
    },
    linkActive: { background: 'rgba(139,92,246,0.12)' },
    indicator: {
        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
        width: '3px', height: '20px', background: '#8b5cf6', borderRadius: '0 3px 3px 0',
    },
    footer: { borderTop: '1px solid var(--border)', paddingTop: '16px' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingLeft: '4px' },
    avatar: {
        width: '36px', height: '36px', borderRadius: '10px',
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.9rem',
    },
    userName: { color: '#fff', fontWeight: 600, fontSize: '0.9rem' },
    userRole: { color: '#64748b', fontSize: '0.75rem' },
    logoutBtn: {
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px', padding: '10px', background: 'transparent', border: '1px solid var(--border)',
        color: '#64748b', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
        transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
    },
};
