import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, FileText, MessageSquare, ChevronRight, Download, Lock } from 'lucide-react';

export default function Lesson() {
    const { moduleId, lessonId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    // MOCK DATA (Depois conectamos na API)
    const lesson = {
        id: 1,
        title: 'Aula 1: A Psicologia do Traço',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=ScZrt7gqGjQ2e5-Y', // Placeholder Rick Roll (mas funcional)
        description: 'Nesta aula fundamental, vamos entender como a pressão da mão e a velocidade da máquina influenciam a psicologia do traço na pele.',
        materials: [
            { name: 'Guia de Agulhas.pdf', size: '2.4 MB' },
            { name: 'Exercício Prático.jpg', size: '1.1 MB' }
        ]
    };

    const playlist = [
        { id: 1, title: 'A Psicologia do Traço', duration: '12:40', completed: true, current: true },
        { id: 2, title: 'Configurando a Máquina', duration: '15:20', completed: false, current: false },
        { id: 3, title: 'Bancada e Higiene', duration: '08:15', completed: false, current: false },
        { id: 4, title: 'Treino em Pele Artificial', duration: '22:00', completed: false, current: false, locked: true },
    ];

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-theme(spacing.20))] gap-6 animate-fade-in pl-2 lg:pl-0">

            {/* Esquerda: Player e Conteúdo */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Player Container */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/20 border border-slate-800 relative group">
                    <iframe
                        src={lesson.videoUrl}
                        className="w-full h-full"
                        title="Lesson Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Info e Abas */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-slate-100">{lesson.title}</h1>
                        <button className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-400/20 transition-colors">
                            <CheckCircle size={18} />
                            <span>Marcar como Concluída</span>
                        </button>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-slate-800 mb-6">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: FileText },
                            { id: 'comments', label: 'Dúvidas (12)', icon: MessageSquare },
                            { id: 'materials', label: 'Materiais', icon: Download },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                            ${activeTab === tab.id
                                        ? 'border-violet-500 text-violet-400'
                                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="text-slate-300 leading-relaxed">
                        {activeTab === 'overview' && (
                            <div className="space-y-4">
                                <p>{lesson.description}</p>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <h3 className="text-slate-100 font-bold mb-2">Objetivos da Aula</h3>
                                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                                        <li>Dominar a estabilidade da mão</li>
                                        <li>Entender voltagem x velocidade</li>
                                        <li>Prática de traço contínuo</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'materials' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {lesson.materials.map((mat, i) => (
                                    <div key={i} className="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-violet-500/50 transition-colors cursor-pointer group">
                                        <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                                            <FileText size={24} />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h4 className="font-medium text-slate-200">{mat.name}</h4>
                                            <span className="text-xs text-slate-500">{mat.size}</span>
                                        </div>
                                        <Download size={20} className="text-slate-600 group-hover:text-violet-400" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'comments' && (
                            <div className="text-center py-10 text-slate-500">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Área de comentários em desenvolvimento...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Direita: Playlist (Sidebar de Conteúdo) */}
            <div className="w-full lg:w-80 flex-shrink-0 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-fit flex flex-col">
                <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
                    <h3 className="font-bold text-slate-100">Conteúdo do Módulo</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-[25%] h-full bg-emerald-500 rounded-full"></div>
                        </div>
                        <span>25%</span>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[600px]">
                    {playlist.map((item, index) => (
                        <div
                            key={item.id}
                            className={`p-4 border-b border-slate-800/50 transition-all cursor-pointer flex gap-4
                        ${item.current ? 'bg-violet-500/10 border-l-4 border-l-violet-500' : 'hover:bg-slate-800 border-l-4 border-l-transparent'}
                        ${item.locked ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                        >
                            <div className="mt-1">
                                {item.completed ? (
                                    <CheckCircle size={16} className="text-emerald-500" />
                                ) : item.locked ? (
                                    <Lock size={16} className="text-slate-600" />
                                ) : (
                                    <Play size={16} className={item.current ? 'text-violet-400' : 'text-slate-500'} fill={item.current ? "currentColor" : "none"} />
                                )}
                            </div>
                            <div>
                                <h4 className={`text-sm font-medium leading-snug ${item.current ? 'text-violet-100' : 'text-slate-300'}`}>
                                    {item.title}
                                </h4>
                                <span className="text-xs text-slate-500 mt-1 block">{item.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
