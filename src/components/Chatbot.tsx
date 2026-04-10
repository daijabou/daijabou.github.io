import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Send, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;

        const userMessage: Message = { role: 'user', content: input.trim() };
        const nextMessages = [...messages, userMessage];

        // Batch: append user message + empty assistant placeholder in one update
        setMessages([...nextMessages, { role: 'assistant', content: '' }]);
        setInput('');
        setIsStreaming(true);

        let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

        try {
            const apiBase = import.meta.env.VITE_CHATBOT_API_URL ?? '';
            const res = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: nextMessages }),
            });

            if (!res.ok || !res.body) throw new Error('Request failed');

            reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let done = false;

            while (!done) {
                const { done: streamDone, value } = await reader.read();
                if (streamDone) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? ''; // keep incomplete trailing line

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const raw = line.slice(6);
                    if (raw === '[DONE]') { done = true; break; }
                    try {
                        const { content } = JSON.parse(raw) as { content: string };
                        setMessages(prev => {
                            const copy = [...prev];
                            copy[copy.length - 1] = {
                                ...copy[copy.length - 1],
                                content: copy[copy.length - 1].content + content,
                            };
                            return copy;
                        });
                    } catch {
                        // skip malformed chunks
                    }
                }
            }
        } catch {
            setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                    role: 'assistant',
                    content: 'Connection error — please try again.',
                };
                return copy;
            });
        } finally {
            reader?.cancel().catch(() => {});
            setIsStreaming(false);
        }
    };

    return (
        <>
            {/* Floating trigger button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                className="fixed bottom-6 right-6 z-50 w-12 h-12
                           bg-zinc-950 border-2 border-green-400 text-green-400
                           flex items-center justify-center
                           hover:bg-green-400 hover:text-zinc-950
                           transition-colors duration-200"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
            </button>

            {/* Chat panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
                        className="fixed top-0 right-0 h-screen w-full md:w-1/3
                                   bg-zinc-950 border-l border-green-400/50
                                   flex flex-col z-40 font-mono"
                    >
                        {/* Terminal header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-green-400/30 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">michael@portfolio:~$</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-500 hover:text-green-400 transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                            {/* Static greeting */}
                            <div className="flex gap-2">
                                <span className="text-green-400/60 flex-shrink-0">$</span>
                                <span className="text-green-400">
                                    Hi! I'm Michael's portfolio assistant. Ask me about his skills, experience, or background.
                                </span>
                            </div>

                            {messages.map((msg, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className={`flex-shrink-0 ${msg.role === 'user' ? 'text-zinc-500' : 'text-green-400/60'}`}>
                                        {msg.role === 'user' ? '>' : '$'}
                                    </span>
                                    <span className={msg.role === 'user' ? 'text-zinc-300' : 'text-green-400'}>
                                        {msg.content}
                                        {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                                            <span className="animate-pulse ml-0.5">▋</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input row */}
                        <form
                            onSubmit={handleSubmit}
                            className="border-t border-green-400/30 px-4 py-3 flex items-center gap-3 flex-shrink-0"
                        >
                            <span className="text-green-400 flex-shrink-0">{'>'}</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                disabled={isStreaming}
                                placeholder="ask me anything..."
                                className="flex-1 bg-transparent text-green-400 placeholder-green-400/30
                                           focus:outline-none text-sm caret-green-400
                                           disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isStreaming || !input.trim()}
                                className="text-green-400 disabled:opacity-30 hover:text-green-300 transition-colors flex-shrink-0"
                                aria-label="Send message"
                            >
                                {isStreaming
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Send className="w-4 h-4" />
                                }
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
