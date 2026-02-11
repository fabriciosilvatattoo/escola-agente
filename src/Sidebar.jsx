import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BookOpen, MonitorPlay, MessageSquare, Users, LogOut, GraduationCap, LayoutDashboard } from 'lucide-react';
import './App.css'; // Garantir estilos globais

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    const menuItems = [
        { path: '/modules', label: 'Meus Cursos', icon: BookOpen },
        { path: '/feed', label: 'Comunidade', icon: Users },
        { path: '/chat', label: 'Tutor IA', icon: MessageSquare },
    ];

    return (
        <aside style={styles.sidebar}>
            {/* Logo */}
            <div style={styles.logoContainer}>
                <div style={styles.logoBox}>
                    <GraduationCap size={28} color="#fff" />
                </div>
                <div>
                    <h1 style={styles.brandName}>NEXUS</h1>
                    <span style={styles.brandSubtitle}>Academy</span>
                </div>
            </div>

            {/* Navegação */}
            <nav style={styles.nav}>
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                ...styles.link,
                                ...(active ? styles.linkActive : {}),
                            }}
                        >
                            <Icon size={20} color={active ? '#fff' : '#94a3b8'} style={{ minWidth: '24px' }} />
                            <span style={active ? { color: '#fff', fontWeight: 600 } : { color: '#94a3b8' }}>
                                {item.label}
                            </span>
                            {active && <div style={styles.activeIndicator} />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div style={styles.footer}>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Sair da conta</span>
                </button>
            </div>
        </aside>
    );
}

const styles = {
    sidebar: {
        width: '280px',
        height: '100vh',
        background: 'var(--bg-secondary)', // #1a1c23
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        padding: '30px 20px',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '50px',
        paddingLeft: '10px',
    },
    logoBox: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)',
    },
    brandName: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'white',
        lineHeight: 1,
        letterSpacing: '-0.5px'
    },
    brandSubtitle: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        fontWeight: '500',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '12px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
    },
    linkActive: {
        background: 'rgba(139, 92, 246, 0.1)', // primary com opacidade
    },
    activeIndicator: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '24px',
        background: 'var(--primary)',
        borderRadius: '0 4px 4px 0',
    },
    footer: {
        marginTop: 'auto',
        paddingTop: '20px',
        borderTop: '1px solid var(--border)',
    },
    logoutBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px',
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: '0.2s',
        fontSize: '0.9rem',
        fontWeight: 500
    }
};

export default Sidebar;
