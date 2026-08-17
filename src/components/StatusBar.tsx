import { useEffect, useState } from 'react';
import { Terminal, Wifi, Volume2, Cpu } from 'lucide-react';
import type { ChatWindowState } from './Chatbot';

const SECTIONS = [
    { id: 'hero', path: '~/', label: 'home' },
    { id: 'about', path: '~/about', label: 'about' },
    { id: 'skills', path: '~/skills', label: 'skills' },
    { id: 'experience', path: '~/experience', label: 'experience' },
    { id: 'contact', path: '~/contact', label: 'contact' },
];

const pad = (n: number) => String(n).padStart(2, '0');

interface StatusBarProps {
    chat: ChatWindowState;
    onChatChange: (state: ChatWindowState) => void;
}

export const StatusBar = ({ chat, onChatChange }: StatusBarProps) => {
    const [activeId, setActiveId] = useState('hero');
    const [progress, setProgress] = useState(0);
    const [clock, setClock] = useState('');

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setClock(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
        };
        tick();
        const id = window.setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActiveId(visible.target.id);
            },
            { threshold: [0.25, 0.5, 0.75] }
        );

        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const active = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];

    return (
        <div
            className="fixed bottom-0 left-0 z-[90] flex h-9 w-full items-stretch gap-1 border-t border-term-phosphor/30
                       bg-gradient-to-b from-term-panel to-term-void px-1.5 py-1 font-ui text-[11px]
                       text-term-phosphor/70 backdrop-blur-sm"
        >
            <div className="flex flex-shrink-0 items-center gap-1.5 border border-term-phosphor/40 bg-term-phosphor/10 px-2 text-term-phosphor">
                <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">daijabou</span>
            </div>

            <nav aria-label="Sections" className="flex min-w-0 flex-1 items-stretch gap-1 overflow-hidden">
                {SECTIONS.map((section, i) => {
                    const isActive = section.id === activeId;
                    return (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            aria-current={isActive ? 'true' : undefined}
                            className={`flex min-w-0 items-center gap-1.5 border px-2 transition-colors ${isActive
                                    ? 'border-term-phosphor/60 bg-term-phosphor/20 text-term-phosphor shadow-glow-sm'
                                    : 'border-term-phosphor/15 text-term-phosphor/50 hover:border-term-phosphor/40 hover:text-term-phosphor'
                                }`}
                        >
                            <span className="opacity-50">{i + 1}</span>
                            <span className="hidden truncate md:inline">{section.label}</span>
                        </a>
                    );
                })}
            </nav>

            {chat !== 'closed' && (
                <button
                    onClick={() => onChatChange(chat === 'open' ? 'minimized' : 'open')}
                    aria-label={chat === 'open' ? 'Minimize assistant' : 'Restore assistant'}
                    className={`flex flex-shrink-0 items-center gap-1.5 border px-2 transition-colors ${chat === 'open'
                            ? 'border-term-phosphor/60 bg-term-phosphor/20 text-term-phosphor shadow-glow-sm'
                            : 'border-term-phosphor/15 text-term-phosphor/50 hover:border-term-phosphor/40 hover:text-term-phosphor'
                        }`}
                >
                    <Terminal className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">assistant</span>
                </button>
            )}

            <div className="flex flex-shrink-0 items-center gap-3 border border-term-phosphor/15 px-2 tabular-nums">
                <span className="hidden items-center gap-1 sm:flex" title="Scroll position">
                    <Cpu className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    <span className="w-8 text-right">{progress}%</span>
                </span>
                <Wifi className="hidden h-3.5 w-3.5 flex-shrink-0 sm:block" aria-hidden="true" />
                <Volume2 className="hidden h-3.5 w-3.5 flex-shrink-0 md:block" aria-hidden="true" />
                <span className="hidden w-24 truncate text-right text-term-phosphor/50 lg:inline">
                    {active.path}
                </span>
                <span className="w-16 text-right text-term-amber">{clock}</span>
            </div>
        </div>
    );
};
