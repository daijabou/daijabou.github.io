import { useState, useEffect } from 'react';

interface TypewriterProps {
    sentences: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delay?: number;
    loop?: boolean;
}

export const Typewriter = ({
    sentences,
    typingSpeed = 150,
    deletingSpeed = 100,
    delay = 2000,
    loop = true,
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
        <span className="-r-2 border-green-400 animate-pulse pr-1 text-green-400">
            {text}
        </span>
    );
};
