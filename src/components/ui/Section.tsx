import type { ReactNode } from 'react';

/** The single vertical model for every section: they declare what they are, not their spacing. */
interface SectionProps {
    id: string;
    /** Accessible name for the region, so the landmark is navigable. */
    label: string;
    /** The hero fills the first viewport; nothing else needs to. */
    fill?: boolean;
    children: ReactNode;
}

export const Section = ({ id, label, fill = false, children }: SectionProps) => (
    <section
        id={id}
        aria-label={label}
        className={`relative px-4 md:px-10 ${fill
            ? 'flex min-h-[100svh] flex-col justify-center py-24'
            : 'py-24 md:py-32'
            }`}
    >
        <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
);
