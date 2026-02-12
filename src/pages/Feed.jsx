import { useEffect, useState } from 'react';
import { Send, Heart, MoreHorizontal, User } from 'lucide-react';

export default function Feed() {
    const [data, setData] = useState([{ id: 1, author: 'Andreza', content: 'Bom dia alunos! Prontos para treinar traço fino hoje?', likes: 12 }]);
    const [input, setInput] = useState('');

    // Fetch real
    useEffect(() => {
        fetch('/api/feed')
            .then(r => r.json())
            .then(d => { if (Array.isArray(d)) setData(d) });
    }, []);

    const handlePost = async () => {
        if (!input.trim()) return;
        // Optimistic Update
        const newPost = { id: Date.now(), author: 'Você', content: input, likes: 0 };
        setData([newPost, ...data]);
        setInput('');

        // API Call
        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer temp-token` },
            body: JSON.stringify({ content: input })
        });
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* Composer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        A
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Compartilhe seu progresso ou dúvida..."
                            className="w-full bg-slate-950 border-none resize-none focus:ring-0 text-slate-100 placeholder-slate-600 text-lg min-h-[100px]"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
                    <div className="flex gap-4 text-violet-400">
                        <button className="hover:bg-slate-800 p-2 rounded-full transition-colors">📷</button>
                        <button className="hover:bg-slate-800 p-2 rounded-full transition-colors">📍</button>
                    </div>
                    <button
                        onClick={handlePost}
                        disabled={!input.trim()}
                        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-6 py-2 rounded-full font-bold transition-all"
                    >
                        Publicar
                    </button>
                </div>
            </div>

            {/* Feed Stream */}
            <div className="space-y-4">
                {data.map((post) => (
                    <div key={post.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:bg-slate-900 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold shrink-0 border border-slate-700">
                                    {post.author_name ? post.author_name[0] : 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-100">{post.author_name || post.author}</h4>
                                    <span className="text-xs text-slate-500">2h atrás</span>
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-slate-300">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <p className="text-slate-300 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                            {post.content}
                        </p>

                        <div className="flex items-center gap-6 pt-4 border-t border-slate-800/50">
                            <button className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors group">
                                <Heart size={18} className="group-hover:fill-pink-500 transition-all" />
                                <span className="text-sm font-medium">{post.likes_count || post.likes || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-500 hover:text-violet-400 transition-colors">
                                <span className="text-sm font-medium">Responder</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
