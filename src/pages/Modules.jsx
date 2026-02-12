import { useEffect, useState } from 'react';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';

export default function Modules() {
    const [data, setData] = useState([
        // Mock inicial enquanto fetch carrega
        { id: 1, title: 'Iniciação à Arte', desc: 'Fundamentos de desenho e anatomia para tatuadores.', progress: 10, cover: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=800' },
        { id: 2, title: 'Técnicas de Traço', desc: 'Domine linhas firmes e clean line work.', progress: 0, cover: 'https://images.unsplash.com/photo-1542226601-cb8276181b3f?auto=format&fit=crop&q=80&w=800' },
        { id: 3, title: 'Sombreamento Pro', desc: 'Do whip shading ao realismo suave.', progress: 0, cover: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&q=80&w=800' }
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/modules')
            .then(r => r.json())
            .then(d => {
                if (Array.isArray(d) && d.length > 0) setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pl-20 lg:pl-64 pr-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Meus Cursos</h2>
                    <p className="text-slate-400 mt-1 max-w-2xl">
                        Sua jornada para se tornar uma referência na tatuagem começa aqui.
                    </p>
                </div>
                <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400 flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span>Progresso Total: 15%</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-900/10 transition-all duration-300 flex flex-col h-full"
                    >
                        {/* Cover Image */}
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={item.cover_image || item.cover}
                                alt={item.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                            {/* Badge sobre a imagem */}
                            <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-100 uppercase tracking-wide border border-slate-800">
                                Módulo {item.id}
                            </span>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-violet-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                                    {item.description || item.desc}
                                </p>
                            </div>

                            {/* Footer / Action */}
                            <div className="space-y-4 pt-4 border-t border-slate-800/50">
                                {/* Progress Bar */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Concluído</span>
                                        <span className="text-violet-400">{item.progress || 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                                            style={{ width: `${item.progress || 5}%` }}
                                        />
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:translate-y-0 translate-y-0">
                                    <PlayCircle size={18} fill="currentColor" className="text-white/20" />
                                    <span>Continuar Aula</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
