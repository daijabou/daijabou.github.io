import { useState } from 'react';
import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { skillCategories, skills, type SkillCategory } from '../lib/resumeData';

/** `ls` output, present on first paint. Defaults to AI/LLM: the differentiator. */
const DEFAULT_CATEGORY: SkillCategory = 'AI/LLM Tools';

export const Skills = () => {
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory>(DEFAULT_CATEGORY);
    const listed = skills[selectedCategory];

    return (
        <Section id="skills" label="Skills">
            <SectionHeading command="ls ./skills" label="Skills" />

            <div className="shell-output">
                <div className="mb-8 flex flex-wrap gap-2">
                    {skillCategories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            aria-pressed={selectedCategory === category}
                            data-selected={selectedCategory === category}
                            className="btn-term"
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Flex wrap packs to the content; CSS columns stretch short categories. */}
                <ul aria-live="polite" className="flex flex-wrap gap-x-8 gap-y-1">
                    {listed.map((skill) => (
                        <li key={skill} className="t-body">
                            {skill}
                        </li>
                    ))}
                </ul>

                <p className="t-meta mt-6">
                    {listed.length} entries in ~/skills/{selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                </p>
            </div>
        </Section>
    );
};
