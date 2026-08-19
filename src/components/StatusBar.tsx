import { useEffect, useState } from 'react';
import { Terminal, Cpu } from 'lucide-react';
import type { ChatWindowState } from './TerminalConsole';
import { sections as SECTIONS } from '../lib/resumeData';

const pad = (n: number) => String(n).padStart(2, '0');

interface StatusBarProps {
    chat: ChatWindowState;
    onChatChange: (state: ChatWindowState) => void;
}

/** The site's only navigation, so it is built as navigation first. */
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
            className="fixed bottom-0 left-0 z-[90] flex h-[var(--statusbar-h)] w-full items-stretch gap-1.5
                       border-t border-edge bg-gradient-to-b from-term-panel to-term-void px-2
                       font-ui text-chrome text-ink-label backdrop-blur-sm"
        >
            {/* overflow-x-auto rather than hidden, so focus rings are not clipped. */}
            <nav
                aria-label="Sections"
                className="flex min-w-0 flex-1 snap-x items-stretch gap-1.5 overflow-x-auto
                           [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)]
                           [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {SECTIONS.map((section, i) => {
                    const isActive = section.id === activeId;
                    return (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex flex-shrink-0 snap-start items-center gap-1.5 border px-2.5 transition-colors ${isActive
                                ? 'border-edge-strong bg-term-phosphor/20 text-term-phosphor shadow-glow-sm'
                                : 'border-edge text-ink-label hover:border-edge-strong hover:text-term-phosphor'
                                }`}
                        >
                            <span aria-hidden="true" className="hidden sm:inline">
                                {i + 1}
                            </span>
                            {/* Labels are the accessible name as well as the visible one. */}
                            <span>{section.label}</span>
                        </a>
                    );
                })}
            </nav>

            {chat === 'closed' ? (
                <button
                    type="button"
                    onClick={() => onChatChange('open')}
                    className="flex flex-shrink-0 items-center gap-1.5 border border-edge-strong bg-term-phosphor/10
                               px-2.5 text-term-phosphor transition-colors hover:bg-term-phosphor/20"
                >
                    <Terminal className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    <span>ask<span className="hidden sm:inline">&nbsp;michael</span></span>
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => onChatChange(chat === 'open' ? 'minimized' : 'open')}
                    aria-label={chat === 'open' ? 'Minimize terminal' : 'Restore terminal'}
                    className={`flex min-w-[44px] flex-shrink-0 items-center justify-center gap-1.5 border px-2.5 transition-colors ${chat === 'open'
                        ? 'border-edge-strong bg-term-phosphor/20 text-term-phosphor shadow-glow-sm'
                        : 'border-edge text-ink-label hover:border-edge-strong hover:text-term-phosphor'
                        }`}
                >
                    <Terminal className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">terminal</span>
                </button>
            )}

            <div className="hidden flex-shrink-0 items-center gap-3 border border-edge px-2.5 tabular-nums lg:flex">
                <span className="flex items-center gap-1.5" title="Scroll position">
                    <Cpu className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    <span className="w-8 text-right">{progress}%</span>
                </span>
                <span className="hidden w-24 truncate text-right text-ink-hint lg:inline">
                    {active.path}
                </span>
                <span className="w-16 text-right text-ink-label">{clock}</span>
            </div>
        </div>
    );
};
