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
        /* Background transparente para ver a imagem do body */
        backgroundColor: 'transparent',
        color: 'var(--text-primary)',
    },
    content: {
        flex: 1,
        marginLeft: '260px', // Ajustado para nova largura do sidebar
        padding: '40px 60px',
        overflowY: 'auto',
        backgroundColor: 'transparent', // Transparente
        /* Gradiente sutil em cima da imagem */
        backgroundImage: `radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), transparent 50%)`
    },
};

export default Layout;
