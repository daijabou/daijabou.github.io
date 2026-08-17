import { useMemo, useState } from 'react';
import { Typewriter } from './Typewriter';
import { SectionHeading } from './ui/SectionHeading';
import { skillCategories, skills, type SkillCategory } from '../lib/resumeData';

export const Skills = () => {
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory>(skillCategories[0]);

    const sentences = useMemo(() => [skills[selectedCategory].join(', ')], [selectedCategory]);
    return (
        <section id="skills" className='relative h-screen bg-term-void'>
            <div className="flex justify-center items-center h-screen grid-bg p-4">
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
                    <SectionHeading command="ls ./skills" label="Skills" className="mb-8" />

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {skillCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                aria-pressed={selectedCategory === category}
                                className={`btn-term !px-4 !py-2 text-sm md:text-base
                            ${selectedCategory === category
                                        ? '!bg-term-phosphor !text-term-void shadow-glow'
                                        : ''
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="text-center min-h-[100px] max-w-3xl">
                        <p className="text-lg md:text-2xl font-mono">
                            <Typewriter
                                key={selectedCategory}
                                sentences={sentences}
                                typingSpeed={50}
                                deletingSpeed={0}
                                delay={1000}
                                loop={false}
                            />
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
