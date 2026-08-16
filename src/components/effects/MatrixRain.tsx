import { useEffect, useRef } from 'react';

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>[]{}/\\$#@%&*+=';
const FONT_SIZE = 16;
const TARGET_FPS = 20;

export const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reduce.matches) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let columns = 0;
        let drops: number[] = [];
        let frame = 0;
        let last = 0;
        let paused = document.hidden;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;
            ctx.textBaseline = 'top';

            columns = Math.ceil(window.innerWidth / FONT_SIZE);
            drops = Array.from({ length: columns }, () =>
                Math.floor((Math.random() * window.innerHeight) / FONT_SIZE)
            );
        };

        const draw = (now: number) => {
            frame = requestAnimationFrame(draw);
            if (paused) return;
            if (now - last < 1000 / TARGET_FPS) return;
            last = now;

            ctx.fillStyle = 'rgba(5, 7, 6, 0.10)';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            ctx.fillStyle = '#00ff9c';
            for (let i = 0; i < drops.length; i++) {
                const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

                if (drops[i] * FONT_SIZE > window.innerHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const onVisibility = () => {
            paused = document.hidden;
        };

        resize();
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', onVisibility);
        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="matrix-rain pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
        />
    );
};
