import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css'; // Carrega o tema dark

function Layout() {
    return (
        <div className="layout" style={styles.layout}>
            <Sidebar />
            <main className="main-content" style={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}

const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
    },
    content: {
        flex: 1,
        marginLeft: '280px',
        padding: '40px 60px',
        overflowY: 'auto',
        /* Efeito de profundidade para o content */
        backgroundColor: 'var(--bg-primary)',
        backgroundImage: `radial-gradient(circle at top right, rgba(139, 92, 246, 0.05), transparent 40%)`
    },
};

export default Layout;
