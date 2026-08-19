import { GlitchText } from './effects/GlitchText';
import { Section } from './ui/Section';
import { Prompt, Cursor } from './ui/Prompt';
import { identity, skills } from '../lib/resumeData';

/** First viewport as `whoami` output: static and selectable, no typing required. */
const HEADLINE = 'I ship AI features into production products.';

const STACK = [
    'TypeScript',
    'React',
    '.NET',
    'AWS',
    ...skills['AI/LLM Tools'].slice(0, 2),
];

export const Hero = () => {
    return (
        <Section id="hero" label="Introduction" fill>
            <p className="t-label mb-4">
                <Prompt host={`visitor@${identity.handle}:~`} className="inline" /> whoami
            </p>

            <div className="shell-output">
                <h1 className="t-display">
                    <GlitchText text={identity.name} className="text-term-phosphor text-glow" />
                </h1>

                <p className="mt-2 font-ui text-heading text-ink-label">
                    {identity.role}
                </p>

                <p className="t-body mt-6 text-ink-strong">
                    {HEADLINE}
                    <Cursor />
                </p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Core stack">
                    {STACK.map((item) => (
                        <li key={item} className="chip">
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                    <a href="#experience" className="btn-term-solid">
                        $ git log --career
                    </a>
                    <a href="#contact" className="btn-term">
                        $ ./contact.sh
                    </a>
                </div>
            </div>
        </Section>
    );
};
