import { useEffect, useState } from 'react';
import { getExperienceEntries, type ExperienceFields } from '../lib/contentfulClient';
import { SectionHeading } from './ui/SectionHeading';
import { TerminalWindow } from './ui/TerminalWindow';

interface ExperienceItem {
    company: string;
    role: string;
    duration: string;
    description: string;
    technologies?: string[];
}

interface ExperienceCardProps {
    experience: ExperienceItem;
    isLeft: boolean;
    isHead: boolean;
}

const hashOf = (value: string) => {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
        h = (h * 31 + value.charCodeAt(i)) >>> 0;
    }
    return h.toString(16).padStart(7, '0').slice(0, 7);
};

const ExperienceCard = ({ experience, isLeft, isHead }: ExperienceCardProps) => {
    const hash = hashOf(experience.company + experience.role);

    return (
        <div className={`
            w-full md:w-[45%]
            ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}
            group
        `}>
            <TerminalWindow
                variant="git"
                title={`commit ${hash}`}
                meta={isHead ? '(HEAD -> main)' : undefined}
                className="group-hover:shadow-glow group-hover:border-term-phosphor/70"
            >
                <div className="font-ui text-xs mb-4 space-y-0.5">
                    <p className="text-term-text">
                        <span className="text-term-phosphor/40">Author:&nbsp;</span>
                        Michael Endaya &lt;michaelendaya3@gmail.com&gt;
                    </p>
                    <p className="text-term-text">
                        <span className="text-term-phosphor/40">Date:&nbsp;&nbsp;&nbsp;</span>
                        {experience.duration}
                    </p>
                </div>

                <h3 className="font-display text-2xl text-term-bright mb-1">
                    {experience.role}
                </h3>
                <h4 className="text-term-phosphor font-ui text-sm mb-3 text-glow-soft">
                    @ {experience.company}
                </h4>

                <p className="text-term-text text-sm leading-relaxed mb-4 font-mono">
                    {experience.description}
                </p>

                {experience.technologies && (
                    <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                            <span key={tech} className="chip">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </TerminalWindow>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="space-y-12">
        {[1, 2, 3].map((i) => (
            <div key={i} className="relative flex items-center">
                <div className={`w-full md:w-[45%] ${i % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8'}`}>
                    <div className="panel p-6 animate-pulse">
                        <div className="h-6 w-24 bg-term-amber/20 mb-3"></div>
                        <div className="h-6 w-48 bg-term-phosphor/10 mb-1"></div>
                        <div className="h-4 w-32 bg-term-phosphor/20 mb-3"></div>
                        <div className="h-16 w-full bg-term-phosphor/[0.06] mb-4"></div>
                        <div className="flex gap-2">
                            <div className="h-6 w-16 bg-term-phosphor/[0.06]"></div>
                            <div className="h-6 w-20 bg-term-phosphor/[0.06]"></div>
                            <div className="h-6 w-14 bg-term-phosphor/[0.06]"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const Experience = () => {
    const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getExperienceEntries();

                const experienceItems: ExperienceItem[] = data.map((item: ExperienceFields) => ({
                    company: item.company,
                    role: item.role,
                    duration: item.duration,
                    description: item.description,
                    technologies: item.technologies,
                }));
                setExperiences(experienceItems);
            } catch (err) {
                console.error('Failed to fetch experiences:', err);
                setError('Failed to load experiences');
            } finally {
                setIsLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    return (
        <section id="experience" className="relative min-h-screen bg-term-void py-20">
            <div className="absolute inset-0 grid-bg" />
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <SectionHeading command="git log --career" label="Experience" className="mb-16" />

                {isLoading && <LoadingSkeleton />}

                {error && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-term-magenta font-mono">
                            <span className="text-term-magenta/60">! </span>
                            {error}
                        </p>
                    </div>
                )}

                {!isLoading && !error && experiences.length > 0 && (
                    <div className="relative">
                        <div className="
                            absolute
                            right-4 md:right-auto md:left-1/2
                            top-0 bottom-0
                            w-0.5
                            bg-gradient-to-b from-term-phosphor via-term-phosphor/50 to-transparent
                            md:-translate-x-1/2
                        " />

                        <div className="space-y-12">
                            {experiences.map((experience, index) => {
                                const isLeft = index % 2 === 0;

                                return (
                                    <div
                                        key={index}
                                        className="relative flex items-center"
                                    >
                                        <div className="
                                            absolute
                                            right-2 md:right-auto md:left-1/2

                                            w-4 h-4
                                            bg-term-void
                                            border-2 border-term-phosphor
                                            rounded-full
                                            md:-translate-x-1/2
                                            z-10
                                            shadow-glow-sm

                                            before:absolute before:inset-1
                                            before:bg-term-phosphor before:rounded-full
                                            before:opacity-50

                                            after:absolute after:-inset-1
                                            after:border after:border-term-phosphor/30
                                            after:rounded-full
                                            after:animate-ping
                                            after:opacity-0
                                            hover:after:opacity-100
                                        " />

                                        <div className="w-full pr-12 md:pr-0">
                                            <div className="hidden md:block">
                                                <ExperienceCard
                                                    experience={experience}
                                                    isLeft={isLeft}
                                                    isHead={index === 0}
                                                />
                                            </div>

                                            <div className="block md:hidden">
                                                <ExperienceCard
                                                    experience={experience}
                                                    isLeft={true}
                                                    isHead={index === 0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
