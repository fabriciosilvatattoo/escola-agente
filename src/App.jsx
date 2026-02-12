import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layouts/Sidebar.jsx';
import Modules from './pages/Modules.jsx';
import Feed from './pages/Feed.jsx';
import Chat from './pages/Chat.jsx';
// Login e Auth virão depois. Foco no Core.

function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
            {/* Sidebar Fixa à Esquerda */}
            <Sidebar className="w-20 lg:w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl" />

            {/* Área de Conteúdo Scrollável */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/modules" replace />} />
                <Route path="/modules" element={<Modules />} />
                <Route path="/community" element={<Feed />} />
                <Route path="/tutor" element={<Chat />} />
            </Routes>
        </Layout>
    );
}
