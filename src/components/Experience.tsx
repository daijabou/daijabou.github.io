import { useEffect, useState } from 'react';
import { getExperienceEntries, type ExperienceFields } from '../lib/contentfulClient';

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
}

const ExperienceCard = ({ experience, isLeft }: ExperienceCardProps) => {
    return (
        <div className={`
            w-full md:w-[45%] 
            ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}
            group
        `}>
            <div className="
        backdrop-blur-sm
                border border-green-400
                p-6 
      
            ">
                {/* Duration Badge */}
                <span className="
                    inline-block px-3 py-1 
                    text-xs font-mono 
                    bg-green-400/10 text-green-400 
                    border border-green-400/30 
                  mb-3
                ">
                    {experience.duration}
                </span>

                {/* Role & Company */}
                <h3 className="text-xl font-bold text-white mb-1">
                    {experience.role}
                </h3>
                <h4 className="text-green-400 font-mono text-sm mb-3">
                    @ {experience.company}
                </h4>

                {/* Description */}
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {experience.description}
                </p>

                {/* Technologies */}
                {experience.technologies && (
                    <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="
                                    px-2 py-1 
                                    text-xs s
                                text-zinc-400
                            border border-green-400/30
                                    transition-colors duration-200
                                    group-hover:text-green-400/70
                                "
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="space-y-12">
        {[1, 2, 3].map((i) => (
            <div key={i} className="relative flex items-center">
                <div className={`w-full md:w-[45%] ${i % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8'}`}>
                    <div className="backdrop-blur-sm border border-green-400/30 p-6 animate-pulse">
                        <div className="h-6 w-24 bg-green-400/20 rounded mb-3"></div>
                        <div className="h-6 w-48 bg-zinc-700 rounded mb-1"></div>
                        <div className="h-4 w-32 bg-green-400/20 rounded mb-3"></div>
                        <div className="h-16 w-full bg-zinc-700/50 rounded mb-4"></div>
                        <div className="flex gap-2">
                            <div className="h-6 w-16 bg-zinc-700/30 rounded"></div>
                            <div className="h-6 w-20 bg-zinc-700/30 rounded"></div>
                            <div className="h-6 w-14 bg-zinc-700/30 rounded"></div>
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
        <section id="experience" className="relative min-h-screen bg-zinc-950 py-20">
            {/* Grid Background */}
            <div
                className="
                absolute inset-0
            bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#09090b_1px)] bg-[size:20px_20px]
                "
            />
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-4xl font-bold mb-16 text-green-400 text-center">
                    Experience
                </h2>

                {/* Loading State */}
                {isLoading && <LoadingSkeleton />}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-red-400 font-mono">{error}</p>
                    </div>
                )}

                {/* Timeline Container */}
                {!isLoading && !error && experiences.length > 0 && (
                    <div className="relative">
                        {/* Vertical Line - Center on desktop, Right on mobile */}
                        <div className="
                            absolute 
                            right-4 md:right-auto md:left-1/2 
                            top-0 bottom-0 
                            w-0.5 
                            bg-gradient-to-b from-green-400 via-green-400/50 to-transparent
                            md:-translate-x-1/2
                        " />

                        {/* Experience Items */}
                        <div className="space-y-12">
                            {experiences.map((experience, index) => {
                                const isLeft = index % 2 === 0;

                                return (
                                    <div
                                        key={index}
                                        className="relative flex items-center"
                                    >
                                        {/* Timeline Node - Right on mobile, Center on desktop */}
                                        <div className="
                                            absolute 
                                            right-2 md:right-auto md:left-1/2

                                            w-4 h-4 
                                            bg-zinc-950 
                                            border-2 border-green-400 
                                            rounded-full
                                            md:-translate-x-1/2
                                            z-10
                                            
                                            before:absolute before:inset-1
                                            before:bg-green-400 before:rounded-full
                                            before:opacity-50
                                            
                                            after:absolute after:-inset-1
                                            after:border after:border-green-400/30
                                            after:rounded-full
                                            after:animate-ping
                                            after:opacity-0
                                            hover:after:opacity-100
                                        " />

                                        {/* Card Container - Always on left for mobile */}
                                        <div className="w-full pr-12 md:pr-0">
                                            {/* Desktop: Alternating layout */}
                                            <div className="hidden md:block">
                                                <ExperienceCard
                                                    experience={experience}
                                                    isLeft={isLeft}
                                                />
                                            </div>

                                            {/* Mobile: Same card style as desktop, always left */}
                                            <div className="block md:hidden">
                                                <ExperienceCard
                                                    experience={experience}
                                                    isLeft={true}
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
