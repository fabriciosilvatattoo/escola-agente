import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <Sidebar />
            </div>
            <div style={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
    },
    sidebar: {
        width: '250px',
        flexShrink: 0,
    },
    content: {
        flex: 1,
        padding: '40px',
        background: '#f5f7fa',
        overflowY: 'auto',
    },
};

export default Layout;
