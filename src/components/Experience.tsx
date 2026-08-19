import { useCallback, useEffect, useState } from 'react';
import { getExperienceEntries, type ExperienceFields } from '../lib/contentfulClient';
import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { TerminalWindow } from './ui/TerminalWindow';

interface ExperienceItem {
    company: string;
    role: string;
    duration: string;
    description: string;
    technologies?: string[];
}

const hashOf = (value: string) => {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
        h = (h * 31 + value.charCodeAt(i)) >>> 0;
    }
    return h.toString(16).padStart(7, '0').slice(0, 7);
};

/** The commit node on the rail. A drawn block, matching the cursor. */
const CommitNode = ({ isHead }: { isHead: boolean }) => (
    <span
        aria-hidden="true"
        className={`absolute -left-[calc(1.25rem+5px)] top-4 h-2.5 w-2.5 md:-left-[calc(2.5rem+5px)] ${isHead ? 'bg-term-phosphor shadow-glow-sm' : 'bg-ink-label'
            }`}
    />
);

const ExperienceCard = ({ experience, isHead }: { experience: ExperienceItem; isHead: boolean }) => (
    <TerminalWindow
        variant="git"
        title={`commit ${hashOf(experience.company + experience.role)}`}
        meta={isHead ? '(HEAD -> main)' : undefined}
        className="group-hover:border-edge-strong group-hover:shadow-glow"
    >
        {/* Date leads: it is the field a recruiter scans for. */}
        <p className="t-meta mb-3">
            <span className="text-ink-hint">Date:&nbsp;&nbsp;&nbsp;</span>
            <span className="text-ink-body">{experience.duration}</span>
        </p>

        <h3 className="t-role">{experience.role}</h3>
        <h4 className="t-label mb-4 text-term-phosphor">@ {experience.company}</h4>

        <p className="t-body">{experience.description}</p>

        {experience.technologies && experience.technologies.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                {experience.technologies.map((tech) => (
                    <li key={tech} className="chip">
                        {tech}
                    </li>
                ))}
            </ul>
        )}
    </TerminalWindow>
);

/** Matches the loaded card's shape, so the layout does not change form. */
const LoadingSkeleton = () => (
    <ol className="relative space-y-8 border-l border-edge pl-5 md:pl-10">
        {[0, 1, 2].map((i) => (
            <li key={i} className="relative">
                <CommitNode isHead={i === 0} />
                <TerminalWindow variant="git" title="loading...">
                    <div className="animate-pulse space-y-3" aria-hidden="true">
                        <div className="h-3 w-32 bg-term-phosphor/10" />
                        <div className="h-5 w-48 bg-term-phosphor/20" />
                        <div className="h-4 w-32 bg-term-phosphor/10" />
                        <div className="h-16 w-full bg-term-phosphor/[0.06]" />
                    </div>
                </TerminalWindow>
            </li>
        ))}
    </ol>
);

export const Experience = () => {
    const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getExperienceEntries();
            setExperiences(
                data.map((item: ExperienceFields) => ({
                    company: item.company,
                    role: item.role,
                    duration: item.duration,
                    description: item.description,
                    technologies: item.technologies,
                }))
            );
        } catch (err) {
            console.error('Failed to fetch experiences:', err);
            setError('could not read ~/experience');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <Section id="experience" label="Experience">
            <SectionHeading command="git log --career --author=michael" label="Experience" />

            <div className="shell-output">
                {isLoading && <LoadingSkeleton />}

                {error && !isLoading && (
                    <div className="border border-term-magenta/40 bg-term-magenta/[0.06] p-5">
                        <p className="font-mono text-body text-term-magenta">
                            <span aria-hidden="true">! </span>
                            {error}
                        </p>
                        <button type="button" onClick={load} className="btn-term mt-4">
                            $ retry
                        </button>
                    </div>
                )}

                {!isLoading && !error && experiences.length > 0 && (
                    <ol className="relative space-y-8 border-l border-edge pl-5 md:pl-10">
                        {experiences.map((experience, index) => (
                            <li
                                key={`${experience.company}-${experience.role}`}
                                className="group relative"
                            >
                                <CommitNode isHead={index === 0} />
                                <ExperienceCard experience={experience} isHead={index === 0} />
                            </li>
                        ))}
                    </ol>
                )}

                {!isLoading && !error && experiences.length === 0 && (
                    <p className="t-body">no commits on this branch yet.</p>
                )}
            </div>
        </Section>
    );
};
