interface SectionHeadingProps {
    command: string;
    label: string;
    align?: 'left' | 'center';
    className?: string;
}

export const SectionHeading = ({
    command,
    label,
    align = 'center',
    className = '',
}: SectionHeadingProps) => {
    return (
        <h2
            className={`font-display text-4xl md:text-5xl text-term-phosphor text-glow ${align === 'center' ? 'text-center' : ''
                } ${className}`}
        >
            <span className="sr-only">{label}</span>
            <span aria-hidden="true">
                <span className="text-term-phosphor/50">$&nbsp;</span>
                {command}
                <span className="ml-1 inline-block h-[0.85em] w-[0.5em] translate-y-[0.08em] bg-term-phosphor animate-blink" />
            </span>
        </h2>
    );
};
