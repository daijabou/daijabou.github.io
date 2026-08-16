import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Loader2 } from 'lucide-react';

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

    useEffect(() => {
        if (isOpen && !isStreaming) {
            inputRef.current?.focus();
        }
    }, [isOpen, isStreaming]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;

        if (input.trim() === '/exit') {
            setInput('');
            setIsOpen(false);
            return;
        }

        if (input.trim() === '/clear') {
            setInput('');
            setMessages([]);
            return;
        }

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
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                    className="btn-term fixed bottom-12 right-6 z-[95] w-12 h-12 !p-0"
                >
                    <Terminal className="w-5 h-5" />
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
                        className="fixed top-0 right-0 h-screen w-full md:w-1/3
                                   bg-term-panel/95 backdrop-blur-sm border-l border-term-phosphor/40
                                   flex flex-col z-[95] font-mono pb-9"
                    >
                        <div className="panel-bar flex-shrink-0 !py-3">
                            <Terminal className="w-4 h-4 text-term-phosphor" />
                            <span className="text-term-phosphor text-sm">michael@portfolio:~$</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                            <div className="flex gap-2">
                                <span className="text-term-phosphor/60 flex-shrink-0">$</span>
                                <span className="text-term-phosphor">
                                    Hi! I'm Michael's portfolio assistant. Ask me about his skills, experience, or background.
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-term-phosphor/60 flex-shrink-0">$</span>
                                <span className="text-term-text text-xs">/exit to close · /clear to reset</span>
                            </div>

                            {messages.map((msg, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className={`flex-shrink-0 ${msg.role === 'user' ? 'text-term-amber/70' : 'text-term-phosphor/60'}`}>
                                        {msg.role === 'user' ? '>' : '$'}
                                    </span>
                                    <span className={msg.role === 'user' ? 'text-term-bright' : 'text-term-phosphor'}>
                                        {msg.content}
                                        {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                                            <span className="animate-blink ml-0.5">▋</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="border-t border-term-phosphor/30 px-4 py-3 flex items-center gap-3 flex-shrink-0"
                        >
                            <span className="text-term-phosphor flex-shrink-0">{'>'}</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                disabled={isStreaming}
                                placeholder="ask me anything..."
                                className="flex-1 bg-transparent text-term-phosphor placeholder-term-phosphor/30
                                           focus:outline-none text-sm caret-term-phosphor
                                           disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isStreaming || !input.trim()}
                                className="text-term-phosphor disabled:opacity-30 hover:text-glow transition-all flex-shrink-0"
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
