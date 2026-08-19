import type { ReactNode } from 'react';
import { GitCommit } from 'lucide-react';
import { Prompt } from './Prompt';

interface TerminalWindowProps {
    title?: string;
    meta?: string;
    variant?: 'terminal' | 'git';
    children: ReactNode;
    className?: string;
    bodyClassName?: string;
}

export const TerminalWindow = ({
    title,
    meta,
    variant = 'terminal',
    children,
    className = '',
    bodyClassName = 'p-4 md:p-6',
}: TerminalWindowProps) => {
    return (
        <div className={`panel transition-shadow duration-200 ${className}`}>
            <div className="panel-bar">
                {variant === 'git' ? (
                    <GitCommit className="h-3.5 w-3.5 flex-shrink-0 text-ink-label" aria-hidden="true" />
                ) : (
                    <Prompt sigil=">_" />
                )}
                {title && <span className="truncate">{title}</span>}
                {meta && <span className="ml-auto flex-shrink-0 text-term-phosphor">{meta}</span>}
            </div>
            <div className={bodyClassName}>{children}</div>
        </div>
    );
};
