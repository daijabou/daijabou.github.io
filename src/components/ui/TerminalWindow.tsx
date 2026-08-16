import type { ReactNode } from 'react';
import { GitCommit } from 'lucide-react';

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
    bodyClassName = 'p-6',
}: TerminalWindowProps) => {
    return (
        <div className={`panel transition-shadow duration-300 ${className}`}>
            <div className="panel-bar">
                {variant === 'git' ? (
                    <GitCommit className="w-3.5 h-3.5 flex-shrink-0 text-term-amber" aria-hidden="true" />
                ) : (
                    <span className="flex-shrink-0 text-term-phosphor" aria-hidden="true">&gt;_</span>
                )}
                {title && <span className="truncate">{title}</span>}
                {meta && <span className="ml-auto flex-shrink-0 text-term-amber/70">{meta}</span>}
            </div>
            <div className={bodyClassName}>{children}</div>
        </div>
    );
};
