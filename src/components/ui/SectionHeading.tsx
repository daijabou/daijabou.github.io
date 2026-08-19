import { Prompt, Cursor } from './Prompt';

interface SectionHeadingProps {
    command: string;
    label: string;
}

/** Always left-aligned, so `.shell-output` below hangs off the same x-position. */
export const SectionHeading = ({ command, label }: SectionHeadingProps) => (
    <h2 className="t-heading mb-8 text-glow">
        <span className="sr-only">{label}</span>
        <span aria-hidden="true">
            <Prompt className="inline-block w-[var(--gutter)]" />
            {command}
            <Cursor />
        </span>
    </h2>
);
