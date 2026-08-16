import { useState, useEffect } from 'react';

interface TypewriterProps {
    sentences: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delay?: number;
    loop?: boolean;
    className?: string;
}

export const Typewriter = ({
    sentences,
    typingSpeed = 150,
    deletingSpeed = 100,
    delay = 2000,
    loop = true,
    className = '',
}: TypewriterProps) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [delta, setDelta] = useState(typingSpeed);

    useEffect(() => {
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
    }, [text, isDeleting, loopNum, sentences, typingSpeed, deletingSpeed, delay, delta, loop]);

    return (
        <span className={`text-term-phosphor text-glow-soft ${className}`}>
            {text}
            <span className="ml-0.5 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-term-phosphor animate-blink" />
        </span>
    );
};
