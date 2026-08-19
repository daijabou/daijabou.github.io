import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion';
import { Terminal, CornerDownLeft, Loader2, Minus, Square, X } from 'lucide-react';
import { Prompt } from './ui/Prompt';
import {
    completeLine,
    longestCommonPrefix,
    runCommand,
    type CommandAction,
    type OutputLine,
} from '../lib/terminalCommands';
import { experience as fallbackExperience, identity, type ExperienceItem } from '../lib/resumeData';
import { getExperienceEntries } from '../lib/contentfulClient';

export type ChatWindowState = 'closed' | 'open' | 'minimized';

type HistoryEntry =
    | { id: number; kind: 'input'; text: string }
    | { id: number; kind: 'output'; lines: OutputLine[] }
    | { id: number; kind: 'error'; lines: OutputLine[] }
    | { id: number; kind: 'system'; text: string }
    | { id: number; kind: 'chat-user'; text: string }
    | { id: number; kind: 'chat-reply'; text: string };

interface TerminalConsoleProps {
    state: ChatWindowState;
    onChange: (state: ChatWindowState) => void;
}

let entryId = 0;
const nextId = () => ++entryId;

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const banner = (): HistoryEntry[] => [
    { id: nextId(), kind: 'output', lines: [{ kind: 'text', text: `${identity.name.toLowerCase()} — portfolio shell`, tone: 'accent' }] },
    { id: nextId(), kind: 'output', lines: [{ kind: 'text', text: "type 'help' for available commands", tone: 'dim' }] },
];

async function streamChatReply(
    history: { role: 'user' | 'assistant'; content: string }[],
    onDelta: (chunk: string) => void
): Promise<void> {
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    try {
        const apiBase = import.meta.env.VITE_CHATBOT_API_URL ?? '';
        const res = await fetch(`${apiBase}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history }),
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
                    onDelta(content);
                } catch {
                    continue;
                }
            }
        }
    } finally {
        reader?.cancel().catch(() => { });
    }
}

const toneClass = (tone?: 'dim' | 'bright' | 'accent') => {
    if (tone === 'dim') return 'text-ink-hint';
    if (tone === 'bright') return 'text-term-bright';
    if (tone === 'accent') return 'text-term-phosphor';
    return 'text-ink-body';
};

const OutputLines = ({ lines, isError }: { lines: OutputLine[]; isError?: boolean }) => (
    <>
        {lines.map((line, i) => {
            if (line.kind === 'blank') return <div key={i} className="h-2" aria-hidden="true" />;

            if (line.kind === 'kv') {
                return (
                    <div key={i} className="flex gap-3">
                        <span className="w-20 flex-shrink-0 text-ink-label sm:w-24">{line.key}</span>
                        <span className="min-w-0 break-words text-ink-body">{line.value}</span>
                    </div>
                );
            }

            if (line.kind === 'link') {
                return (
                    <div key={i}>
                        <a
                            href={line.href}
                            target={line.href.startsWith('mailto:') ? undefined : '_blank'}
                            rel="noreferrer"
                            className="text-term-phosphor underline decoration-edge underline-offset-2
                                       transition-all hover:text-glow hover:decoration-term-phosphor"
                        >
                            {line.label}
                        </a>
                    </div>
                );
            }

            return (
                <div key={i} className={`break-words ${isError ? 'text-term-magenta' : toneClass(line.tone)}`}>
                    {line.text}
                </div>
            );
        })}
    </>
);

export const TerminalConsole = ({ state, onChange }: TerminalConsoleProps) => {
    const [history, setHistory] = useState<HistoryEntry[]>(banner);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'command' | 'chat'>('command');
    const [streamingId, setStreamingId] = useState<number | null>(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [experience, setExperience] = useState<ExperienceItem[]>(fallbackExperience);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const isOpen = state === 'open';
    const isChat = mode === 'chat';
    const isStreaming = streamingId !== null;

    const toggleMaximize = () => {
        x.set(0);
        y.set(0);
        setIsMaximized((v) => !v);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

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

    const hasLoadedExperience = useRef(false);
    useEffect(() => {
        if (!isOpen || hasLoadedExperience.current) return;
        hasLoadedExperience.current = true;

        let cancelled = false;
        getExperienceEntries()
            .then((entries) => {
                if (!cancelled && entries.length > 0) setExperience(entries);
            })
            .catch(() => { });

        return () => { cancelled = true; };
    }, [isOpen]);

    const push = (...entries: HistoryEntry[]) => setHistory((prev) => [...prev, ...entries]);

    const leaveChatMode = () => {
        setMode('command');
        push({ id: nextId(), kind: 'system', text: '[left chat mode]' });
    };

    const applyAction = (action: CommandAction) => {
        switch (action.type) {
            case 'clear':
                setHistory(banner());
                break;
            case 'exit':
                onChange('closed');
                break;
            case 'enter-chat':
                setMode('chat');
                push({
                    id: nextId(),
                    kind: 'system',
                    text: "chat mode — answers come from the AI. 'exit' or Esc to leave.",
                });
                break;
            case 'scroll': {
                const el = document.getElementById(action.sectionId);
                if (!el) break;
                const top = el.getBoundingClientRect().top + window.scrollY;
                if (prefersReducedMotion()) {
                    window.scrollTo(0, top);
                    break;
                }
                const before = window.scrollY;
                window.scrollTo({ top, behavior: 'smooth' });
                // Smooth scrolling fails silently when system animations are off; jump instead.
                window.setTimeout(() => {
                    if (Math.abs(window.scrollY - before) < 2 && Math.abs(top - before) > 2) {
                        window.scrollTo(0, top);
                    }
                }, 250);
                break;
            }
        }
    };

    const submitCommand = (line: string) => {
        setCommandHistory((prev) => (prev[prev.length - 1] === line ? prev : [...prev, line]));

        const result = runCommand(line, { experience });
        const entries: HistoryEntry[] = [{ id: nextId(), kind: 'input', text: line }];

        if (result.lines?.length) {
            entries.push({
                id: nextId(),
                kind: result.isError ? 'error' : 'output',
                lines: result.lines,
            });
        }

        push(...entries);
        if (result.action) applyAction(result.action);
    };

    const submitChat = async (question: string) => {
        const conversation = history
            .filter((e): e is Extract<HistoryEntry, { kind: 'chat-user' | 'chat-reply' }> =>
                e.kind === 'chat-user' || e.kind === 'chat-reply'
            )
            .map((e) => ({
                role: e.kind === 'chat-user' ? ('user' as const) : ('assistant' as const),
                content: e.text,
            }));

        const replyId = nextId();
        push(
            { id: nextId(), kind: 'chat-user', text: question },
            { id: replyId, kind: 'chat-reply', text: '' }
        );
        setStreamingId(replyId);

        const appendToReply = (chunk: string) =>
            setHistory((prev) =>
                prev.map((e) =>
                    e.id === replyId && e.kind === 'chat-reply' ? { ...e, text: e.text + chunk } : e
                )
            );

        try {
            await streamChatReply([...conversation, { role: 'user', content: question }], appendToReply);
        } catch {
            setHistory((prev) =>
                prev.map((e) =>
                    e.id === replyId && e.kind === 'chat-reply'
                        ? { ...e, text: 'Connection error — please try again.' }
                        : e
                )
            );
        } finally {
            setStreamingId(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const line = input.trim();
        if (!line || isStreaming) return;

        setInput('');
        setHistoryIndex(null);

        if (isChat) {
            const bare = line.replace(/^\//, '').toLowerCase();
            if (bare === 'exit' || bare === 'quit') {
                push({ id: nextId(), kind: 'chat-user', text: line });
                leaveChatMode();
                return;
            }
            if (bare === 'clear' || bare === 'cls') {
                setHistory(banner());
                return;
            }
            void submitChat(line);
            return;
        }

        submitCommand(line);
    };

    const handleTab = () => {
        const { candidates, prefix, token } = completeLine(input);
        if (candidates.length === 0) return;

        if (candidates.length === 1) {
            setInput(`${prefix}${candidates[0]} `);
            return;
        }

        const common = longestCommonPrefix(candidates);
        if (common.length > token.length) setInput(`${prefix}${common}`);

        push({
            id: nextId(),
            kind: 'output',
            lines: [{ kind: 'text', text: candidates.join('   '), tone: 'dim' }],
        });
    };

    const recallHistory = (direction: -1 | 1) => {
        if (commandHistory.length === 0) return;

        if (direction === -1) {
            const next = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(next);
            setInput(commandHistory[next]);
            return;
        }

        if (historyIndex === null) return;

        const next = historyIndex + 1;
        if (next >= commandHistory.length) {
            setHistoryIndex(null);
            setInput('');
            return;
        }
        setHistoryIndex(next);
        setInput(commandHistory[next]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && input.length > 0 && !isChat) {
            e.preventDefault();
            handleTab();
            return;
        }

        if (e.key === 'Escape' && isChat) {
            e.preventDefault();
            leaveChatMode();
            return;
        }

        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            setHistory(banner());
            return;
        }

        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            if (input) {
                push({ id: nextId(), kind: 'input', text: `${input}^C` });
                setInput('');
            } else if (isChat) {
                leaveChatMode();
            }
            setHistoryIndex(null);
            return;
        }

        if (isChat) return;

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            recallHistory(-1);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            recallHistory(1);
        }
    };

    return (
        <>
            <div
                ref={constraintsRef}
                aria-hidden="true"
                className="pointer-events-none fixed inset-x-0 top-0 bottom-[var(--statusbar-h)] z-0"
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        aria-label="Portfolio terminal"
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
                            ? 'inset-x-2 top-2 bottom-[calc(var(--statusbar-h)+0.5rem)]'
                            : 'bottom-[calc(var(--statusbar-h)+0.5rem)] right-4 w-[calc(100vw-2rem)] max-w-md h-[min(70vh,560px)]'
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

                            {isChat && (
                                <span className="flex-shrink-0 border border-term-amber/50 px-1.5 text-meta text-term-amber">
                                    ask
                                </span>
                            )}

                            <div
                                onPointerDown={(e) => e.stopPropagation()}
                                className="ml-auto flex flex-shrink-0 items-center gap-2"
                            >
                                <button
                                    onClick={() => onChange('minimized')}
                                    aria-label="Minimize"
                                    className="hit-44 flex h-8 w-8 items-center justify-center border border-edge text-ink-label transition-colors hover:bg-term-phosphor/20 hover:text-term-phosphor"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={toggleMaximize}
                                    aria-label={isMaximized ? 'Restore' : 'Maximize'}
                                    className="hit-44 flex h-8 w-8 items-center justify-center border border-edge text-ink-label transition-colors hover:bg-term-phosphor/20 hover:text-term-phosphor"
                                >
                                    <Square className="h-2.5 w-2.5" />
                                </button>
                                <button
                                    onClick={() => onChange('closed')}
                                    aria-label="Close"
                                    className="hit-44 flex h-8 w-8 items-center justify-center border border-edge text-ink-label transition-colors hover:bg-term-phosphor hover:text-term-void"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        <div
                            aria-live="polite"
                            aria-atomic="false"
                            className="flex-1 overflow-y-auto p-4 space-y-2 text-sm"
                            onClick={() => inputRef.current?.focus()}
                        >
                            {history.map((entry) => {
                                if (entry.kind === 'input') {
                                    return (
                                        <div key={entry.id} className="flex gap-2">
                                            <Prompt sigil="~$" className="text-sm" />
                                            <span className="min-w-0 break-words text-ink-strong">{entry.text}</span>
                                        </div>
                                    );
                                }

                                if (entry.kind === 'system') {
                                    return (
                                        <div key={entry.id} className="text-meta text-ink-hint">
                                            {entry.text}
                                        </div>
                                    );
                                }

                                if (entry.kind === 'chat-user') {
                                    return (
                                        <div key={entry.id} className="flex gap-2">
                                            <Prompt sigil=">" mode="chat" className="text-sm" />
                                            <span className="min-w-0 break-words text-term-bright">{entry.text}</span>
                                        </div>
                                    );
                                }

                                if (entry.kind === 'chat-reply') {
                                    return (
                                        <div key={entry.id} className="flex gap-2">
                                            <Prompt sigil="ai$" mode="chat" className="text-sm" />
                                            <span className="min-w-0 break-words text-term-phosphor">
                                                {entry.text}
                                                {entry.id === streamingId && (
                                                    <span className="animate-blink ml-0.5">▋</span>
                                                )}
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={entry.id} className="pl-5 space-y-0.5">
                                        <OutputLines lines={entry.lines} isError={entry.kind === 'error'} />
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-shrink-0 items-center gap-3 border-t border-edge px-4 py-3"
                        >
                            <Prompt
                                sigil={isChat ? 'ask>' : '~$'}
                                mode={isChat ? 'chat' : 'shell'}
                                className="text-sm"
                            />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isStreaming}
                                aria-label={isChat ? 'Question for the AI' : 'Terminal command input'}
                                autoComplete="off"
                                autoCapitalize="off"
                                spellCheck={false}
                                placeholder={isChat ? 'ask a question...' : "type 'help'..."}
                                className="min-h-[44px] flex-1 self-stretch border-b border-transparent bg-transparent
                                           py-2 text-chrome text-term-phosphor caret-term-phosphor
                                           placeholder:text-ink-hint focus:border-term-phosphor
                                           disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isStreaming || !input.trim()}
                                className="hit-44 flex-shrink-0 text-term-phosphor transition-all hover:text-glow disabled:opacity-30"
                                aria-label={isChat ? 'Send question' : 'Run command'}
                            >
                                {isStreaming
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <CornerDownLeft className="w-4 h-4" />
                                }
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
