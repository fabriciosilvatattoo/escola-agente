import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function Chat() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Olá! Sou o Tutor IA da Andreza. Posso ajudar com dúvidas sobre as aulas ou técnicas de tatuagem. O que manda?' }
    ]);
    const [input, setInput] = useState('');
    const [streaming, setStreaming] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

    const sendMessage = async () => {
        if (!input.trim() || streaming) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setStreaming(true);

        try {
            const res = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content, history: messages })
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let aiText = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.replace('data: ', '').trim();
                        if (data === '[DONE]') break;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                aiText += parsed.content;
                                setMessages(prev => {
                                    const newMsg = [...prev];
                                    newMsg[newMsg.length - 1] = { role: 'assistant', content: aiText };
                                    return newMsg;
                                });
                            }
                        } catch (e) { }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setStreaming(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] relative max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-10 w-full pt-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Sparkles className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Tutor IA</h1>
                    <p className="text-violet-400 text-sm font-medium">Online • Especialista em Tatuagem</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-32 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-2">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                <Bot size={16} className="text-violet-400" />
                            </div>
                        )}

                        <div className={`max-w-[80%] rounded-2xl p-4 text-base leading-relaxed shadow-sm
                    ${msg.role === 'user'
                                ? 'bg-violet-600/20 text-violet-100 border border-violet-500/30 rounded-tr-sm'
                                : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-sm shadow-xl'
                            }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                <User size={16} className="text-slate-400" />
                            </div>
                        )}
                    </div>
                ))}
                {streaming && (
                    <div className="flex gap-2 text-slate-500 text-xs ml-12 animate-pulse">
                        <span>Digitando...</span>
                    </div>
                )}
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Input Fixed Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-10 pb-6 px-4">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative flex items-center bg-slate-900 rounded-2xl border border-slate-800 focus-within:border-violet-500/50 focus-within:shadow-lg focus-within:shadow-violet-500/10 transition-all p-2">
                        <input
                            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 px-4 py-3 focus:ring-0 text-lg rounded-xl"
                            placeholder="Pergunte sobre agulhas, pigmentação ou cuidados..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || streaming}
                            className="bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-600 mt-2">
                        O Tutor IA pode cometer erros. Sempre verifique informações críticas de saúde.
                    </p>
                </div>
            </div>
        </div>
    );
}
