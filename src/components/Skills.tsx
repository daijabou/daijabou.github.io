import { useState } from 'react';
import { Typewriter } from './Typewriter';

type SkillCategory = 'Languages, Frameworks & Development' | 'AI/LLM Tools' | 'Cloud & DevOps';

const skillsData: Record<SkillCategory, string[]> = {
    'Languages, Frameworks & Development': [
        'TypeScript, JavaScript, React, Next.js, Vue.js, Node.js, .NET, NestJS, PostgreSQL, SQL Server, Redis, MongoDb'
    ],
    'AI/LLM Tools': [
        'OpenAI API, AutoGen, LangChain, Pinecone'
    ],
    'Cloud & DevOps': [
        'Amazon web services, Docker, GitHub Actions, Gitlab CI/CD'
    ]
};

export const Skills = () => {
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('Languages, Frameworks & Development');
    return (
        <section id="skills" className='relative h-screen bg-zinc-950'>
            <div className="flex justify-center items-center h-screen bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] p-4">
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-white p-8">
                    <h2 className="text-4xl font-bold mb-8 text-green-400">Skills</h2>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {(Object.keys(skillsData) as SkillCategory[]).map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 border-2 transition-colors duration-300 font-mono text-sm md:text-base
                            ${selectedCategory === category
                                        ? 'border-green-400 bg-green-400 text-black'
                                        : 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="text-center min-h-[100px] max-w-3xl">
                        <p className="text-xl md:text-2xl font-mono">
                            <Typewriter
                                key={selectedCategory}
                                sentences={skillsData[selectedCategory]}
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
