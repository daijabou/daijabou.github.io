import { useState, useEffect } from 'react';

interface TypewriterProps {
    sentences: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delay?: number;
    loop?: boolean;
    className?: string;
}

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Typewriter = ({
    sentences,
    typingSpeed = 150,
    deletingSpeed = 100,
    delay = 2000,
    loop = true,
    className = '',
}: TypewriterProps) => {
    // The CSS reduced-motion block zeroes CSS durations; it cannot stop a setTimeout loop.
    const reduced = prefersReducedMotion();

    const [text, setText] = useState(reduced ? (sentences[0] ?? '') : '');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [delta, setDelta] = useState(typingSpeed);

    useEffect(() => {
        if (reduced) return;

        const handleType = () => {
            const i = loopNum % sentences.length;
            const fullText = sentences[i];

            setText(
                isDeleting
                    ? fullText.substring(0, text.length - 1)
                    : fullText.substring(0, text.length + 1)
            );

            setDelta(isDeleting ? deletingSpeed : typingSpeed);

            if (!isDeleting && text === fullText) {
                if (!loop) {
                    return;
                }
                setTimeout(() => setIsDeleting(true), delay);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
                setDelta(typingSpeed);
            }
        };

        const ticker = setTimeout(handleType, delta);

        return () => clearTimeout(ticker);
    }, [text, isDeleting, loopNum, sentences, typingSpeed, deletingSpeed, delay, delta, loop, reduced]);

    return (
        <span className={`text-term-phosphor text-glow-soft ${className}`}>
            {text}
            <span
                aria-hidden="true"
                className="ml-1 inline-block h-[0.85em] w-[0.5em] translate-y-[0.08em] bg-term-phosphor animate-blink"
            />
        </span>
    );
};
