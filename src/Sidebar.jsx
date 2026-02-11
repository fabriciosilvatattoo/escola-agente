import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div style={styles.sidebar}>
            <div style={styles.logo}>
                <h1>🎓 NEXUS</h1>
            </div>

            <nav style={styles.nav}>
                <Link to="/modules" style={isActive('/modules') ? styles.linkActive : styles.link}>📚 Módulos</Link>
                <Link to="/feed" style={isActive('/feed') ? styles.linkActive : styles.link}>💬 Comunidade</Link>
                <Link to="/chat" style={isActive('/chat') ? styles.linkActive : styles.link}>🤖 Tutor IA</Link>
            </nav>

            <div style={styles.footer}>
                <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
            </div>
        </div>
    );
}

const styles = {
    sidebar: {
        width: '250px',
        height: '100vh',
        background: '#1a1c23',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        padding: '20px',
        boxSizing: 'border-box',
    },
    logo: {
        marginBottom: '40px',
        textAlign: 'center',
        borderBottom: '1px solid #333',
        paddingBottom: '20px',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flex: 1,
    },
    link: {
        color: '#a0aec0',
        textDecoration: 'none',
        padding: '12px 15px',
        borderRadius: '8px',
        transition: '0.2s',
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: 500
    },
    linkActive: {
        background: '#667eea',
        color: 'white',
        textDecoration: 'none', // Adicionado para garantir
        padding: '12px 15px',
        borderRadius: '8px',
        fontWeight: 600
    },
    footer: {
        borderTop: '1px solid #333',
        paddingTop: '20px',
    },
    logoutBtn: {
        width: '100%',
        padding: '12px',
        background: 'transparent',
        border: '1px solid #e53e3e',
        color: '#e53e3e',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: '0.2s',
    }
};

export default Sidebar;
