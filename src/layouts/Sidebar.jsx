import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, Bot, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ className }) {
    const location = useLocation();

    const menuItems = [
        { icon: BookOpen, label: 'Meus Cursos', path: '/modules' },
        { icon: Users, label: 'Comunidade', path: '/community' },
        { icon: Bot, label: 'Tutor IA', path: '/tutor' },
    ];

    return (
        <aside className={`${className} flex flex-col h-screen fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800`}>
            {/* Brand */}
            <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 hidden lg:block tracking-wide">
                    NEXUS<span className="text-slate-100 font-light">ACADEMY</span>
                </h1>
                <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-glow" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4 mt-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                                    ? 'bg-violet-500/10 text-violet-400 font-semibold shadow-lg shadow-violet-500/5'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                }`}
                        >
                            <item.icon size={22} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="hidden lg:block text-sm">{item.label}</span>

                            {isActive && (
                                <div className="lg:hidden absolute left-0 w-1 h-8 bg-violet-500 rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div className="border-t border-slate-800 p-4">
                <button className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors">
                    <LogOut size={20} />
                    <span className="hidden lg:block text-sm font-medium">Sair</span>
                </button>
            </div>
        </aside>
    );
}
