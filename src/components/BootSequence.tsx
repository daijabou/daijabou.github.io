import { useEffect, useState } from 'react';
import { Prompt } from './ui/Prompt';

const LINES = [
    'BIOS v2.14 — phosphor display detected',
    'mounting /dev/portfolio ................ ok',
    'loading profile: michael_endaya ........ ok',
    'starting session ....................... ok',
];

export const BootSequence = () => {
    const [done, setDone] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    const [shown, setShown] = useState(0);

    useEffect(() => {
        if (done) return;

        const skip = () => setDone(true);
        window.addEventListener('keydown', skip);
        window.addEventListener('click', skip);

        const timers = LINES.map((_, i) =>
            window.setTimeout(() => setShown(i + 1), 180 * (i + 1))
        );
        const finish = window.setTimeout(() => setDone(true), 180 * LINES.length + 520);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', skip);
            window.removeEventListener('click', skip);
            timers.forEach(clearTimeout);
            clearTimeout(finish);
            document.body.style.overflow = prevOverflow;
        };
    }, [done]);

    if (done) return null;

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-term-void px-6"
            aria-hidden="true"
        >
            <div className="w-full max-w-5xl font-ui text-chrome text-term-phosphor text-glow-soft">
                {LINES.slice(0, shown).map((line) => (
                    <p key={line} className="animate-boot-in">
                        <Prompt className="mr-2 inline" />
                        {line}
                    </p>
                ))}
                <span className="mt-2 inline-block h-4 w-2 bg-term-phosphor animate-blink" />
            </div>
        </div>
    );
};
