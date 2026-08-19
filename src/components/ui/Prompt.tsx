/** The prompt sigil, from one place. `mode` is meaning: amber is AI/chat, phosphor is shell. */
interface PromptProps {
    /** The sigil itself: `$`, `~$`, `>`, `ai$`, `ask>`. */
    sigil?: string;
    mode?: 'shell' | 'chat';
    /** Full `user@host:~$` form, for the hero and boot screen. */
    host?: string;
    className?: string;
}

export const Prompt = ({
    sigil = '$',
    mode = 'shell',
    host,
    className = '',
}: PromptProps) => (
    <span
        aria-hidden="true"
        className={`flex-shrink-0 font-ui ${mode === 'chat' ? 'text-term-amber' : 'text-ink-label'} ${className}`}
    >
        {host ? `${host}${sigil}` : sigil}
    </span>
);

/** The blinking block cursor. Same size and colour everywhere it appears. */
export const Cursor = ({ className = '' }: { className?: string }) => (
    <span
        aria-hidden="true"
        className={`ml-1 inline-block h-[0.85em] w-[0.5em] translate-y-[0.08em] bg-term-phosphor animate-blink ${className}`}
    />
);
