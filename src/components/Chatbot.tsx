import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion';
import { Terminal, Send, Loader2, Minus, Square, X } from 'lucide-react';

export type ChatWindowState = 'closed' | 'open' | 'minimized';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatbotProps {
    state: ChatWindowState;
    onChange: (state: ChatWindowState) => void;
}

export const Chatbot = ({ state, onChange }: ChatbotProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const isOpen = state === 'open';

    const toggleMaximize = () => {
        x.set(0);
        y.set(0);
        setIsMaximized((v) => !v);
    };

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
            onChange('closed');
            return;
        }

        if (input.trim() === '/clear') {
            setInput('');
            setMessages([]);
            return;
        }

        const userMessage: Message = { role: 'user', content: input.trim() };
        const nextMessages = [...messages, userMessage];

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
                buffer = lines.pop() ?? '';

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
            reader?.cancel().catch(() => { });
            setIsStreaming(false);
        }
    };

    return (
        <>
            {state === 'closed' && (
                <button
                    onClick={() => onChange('open')}
                    aria-label="Open assistant"
                    className="btn-term fixed bottom-12 right-6 z-[95] w-12 h-12 !p-0"
                >
                    <Terminal className="w-5 h-5" />
                </button>
            )}

            <div
                ref={constraintsRef}
                aria-hidden="true"
                className="pointer-events-none fixed inset-x-0 top-0 bottom-9 z-0"
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        aria-label="Portfolio assistant"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
                        style={{ x, y, transformOrigin: 'bottom right' }}
                        drag={!isMaximized}
                        dragListener={false}
                        dragControls={dragControls}
                        dragConstraints={constraintsRef}
                        dragMomentum={false}
                        dragElastic={0}
                        className={`panel fixed z-[95] flex flex-col font-mono shadow-glow-lg ${isMaximized
                            ? 'inset-x-2 top-2 bottom-11'
                            : 'bottom-11 right-4 w-[calc(100vw-2rem)] max-w-md h-[min(70vh,560px)]'
                            }`}
                    >
                        <div
                            onPointerDown={(e) => {
                                if (!isMaximized) dragControls.start(e);
                            }}
                            className={`panel-bar flex-shrink-0 !py-2 select-none ${isMaximized ? '' : 'cursor-move touch-none'
                                }`}
                        >
                            <Terminal className="w-4 h-4 flex-shrink-0 text-term-phosphor" aria-hidden="true" />
                            <span className="truncate text-term-phosphor">michael@portfolio: ~</span>

                            <div
                                onPointerDown={(e) => e.stopPropagation()}
                                className="ml-auto flex flex-shrink-0 items-center gap-1"
                            >
                                <button
                                    onClick={() => onChange('minimized')}
                                    aria-label="Minimize"
                                    className="flex h-5 w-5 items-center justify-center border border-term-phosphor/25 text-term-phosphor/70 transition-colors hover:bg-term-phosphor/20 hover:text-term-phosphor"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={toggleMaximize}
                                    aria-label={isMaximized ? 'Restore' : 'Maximize'}
                                    className="flex h-5 w-5 items-center justify-center border border-term-phosphor/25 text-term-phosphor/70 transition-colors hover:bg-term-phosphor/20 hover:text-term-phosphor"
                                >
                                    <Square className="h-2.5 w-2.5" />
                                </button>
                                <button
                                    onClick={() => onChange('closed')}
                                    aria-label="Close"
                                    className="flex h-5 w-5 items-center justify-center border border-term-phosphor/25 text-term-phosphor/70 transition-colors hover:bg-term-magenta hover:text-term-void"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
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
