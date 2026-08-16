import { useEffect, useRef, useState } from 'react';

interface GlitchTextProps {
    text: string;
    className?: string;
    ambient?: boolean;
}

export const GlitchText = ({ text, className = '', ambient = true }: GlitchTextProps) => {
    const [active, setActive] = useState(false);
    const timers = useRef<number[]>([]);

    useEffect(() => {
        if (!ambient) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const schedule = () => {
            const id = window.setTimeout(() => {
                setActive(true);
                const off = window.setTimeout(() => {
                    setActive(false);
                    schedule();
                }, 220);
                timers.current.push(off);
            }, 3200 + Math.random() * 4200);
            timers.current.push(id);
        };

        schedule();
        const pending = timers.current;
        return () => {
            pending.forEach(clearTimeout);
            pending.length = 0;
        };
    }, [ambient]);

    return (
        <span
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 select-none text-term-magenta opacity-0 mix-blend-screen ${active ? 'opacity-80 animate-glitch-x' : ''
                    }`}
            >
                {text}
            </span>
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 select-none text-term-phosphor opacity-0 mix-blend-screen ${active ? 'opacity-80 animate-glitch-y' : ''
                    }`}
            >
                {text}
            </span>
            <span className="relative">{text}</span>
        </span>
    );
};
