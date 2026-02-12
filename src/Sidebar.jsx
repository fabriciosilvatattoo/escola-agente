import { useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { BookOpen, MessageSquare, Users, LogOut, GraduationCap, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname.startsWith(path);

    const menuItems = [
        { path: '/modules', label: 'Meus Cursos', icon: BookOpen },
        { path: '/feed', label: 'Comunidade', icon: Users },
        { path: '/chat', label: 'Tutor IA', icon: MessageSquare },
    ];

    if (user?.role === 'admin') {
        menuItems.unshift({ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard });
    }

    return (
        <aside style={styles.sidebar}>
            {/* Logo Area */}
            <div style={styles.logoContainer}>
                <img
                    src="https://xvagvpdrpsaarhqsjbnn.supabase.co/storage/v1/object/public/imagemns/ANDREZA/Logo-andreza.png"
                    alt="Andreza Tattoo Logo"
                    style={styles.logoImage}
                />
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                {menuItems.map(item => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                ...styles.link,
                                ...(active ? styles.linkActive : {})
                            }}
                        >
                            {active && <div style={styles.indicator} />}
                            <Icon
                                size={20}
                                style={{
                                    color: active ? '#fff' : 'var(--text-muted)',
                                    flexShrink: 0,
                                    filter: active ? 'drop-shadow(0 0 8px var(--primary))' : 'none'
                                }}
                            />
                            <span style={{
                                color: active ? '#fff' : 'var(--text-secondary)',
                                fontWeight: active ? 600 : 500
                            }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer User */}
            <div style={styles.footer}>
                {user && (
                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={styles.userName}>{user.name}</div>
                            <div style={styles.userRole}>
                                {user.role === 'admin' ? 'Administrador' : 'Aluno'}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={logout}
                    style={styles.logoutBtn}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.3)';
                        e.currentTarget.style.color = 'var(--error)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                >
                    <LogOut size={16} /> Sair
                </button>
            </div>
        </aside>
    );
}

const styles = {
    sidebar: {
        width: '260px',
        height: '100vh',
        background: 'var(--glass)', // Usando variável glass
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        padding: '24px 16px',
        boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
        padding: '0 8px',
    },
    logoImage: {
        height: '50px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
    },
    brandName: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#fff',
        lineHeight: 1,
        letterSpacing: '-0.5px',
        background: 'linear-gradient(to right, #fff, var(--secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    brandSub: {
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        fontWeight: 600,
        letterSpacing: '2px',
        marginTop: '2px',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        textDecoration: 'none',
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid transparent',
    },
    linkActive: {
        background: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    indicator: {
        position: 'absolute',
        left: '-16px', // Fora do padding
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '24px',
        background: 'var(--primary)',
        borderRadius: '0 4px 4px 0',
        boxShadow: '0 0 10px var(--primary)',
    },
    footer: {
        borderTop: '1px solid var(--border)',
        paddingTop: '20px',
        marginTop: 'auto',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        padding: '8px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '0.8rem',
    },
    userName: {
        color: '#fff',
        fontWeight: 600,
        fontSize: '0.85rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '120px',
    },
    userRole: {
        color: 'var(--text-muted)',
        fontSize: '0.7rem',
        marginTop: '-2px',
    },
    logoutBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px',
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
        transition: 'all 0.2s',
        fontFamily: 'var(--font-sans)',
    },
};

