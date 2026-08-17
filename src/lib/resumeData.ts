export interface ExperienceItem {
    company: string;
    role: string;
    duration: string;
    description: string;
    technologies?: string[];
    order?: number;
}

export interface SiteSection {
    id: string;
    label: string;
    path: string;
}

export const identity = {
    name: 'Michael Endaya',
    handle: 'daijabou',
    role: 'Software Engineer',
    email: 'michaelendaya3@gmail.com',
} as const;

export const bio =
    "I'm a software developer with a passion for creating innovative applications. I have a strong background in programming and a deep understanding of the latest technologies. I'm always looking for new challenges and opportunities to learn and grow.";

export const taglines = [
    "I'm a software developer.",
    'I build innovative applications.',
    'I love solving complex problems.',
    "I'm passionate about tech.",
];

export const skillCategories = [
    'Languages, Frameworks & Development',
    'AI/LLM Tools',
    'Cloud & DevOps',
] as const;

export type SkillCategory = (typeof skillCategories)[number];

export const skills: Record<SkillCategory, string[]> = {
    'Languages, Frameworks & Development': [
        'TypeScript',
        'JavaScript',
        'React',
        'Next.js',
        'Vue.js',
        'Node.js',
        '.NET',
        'NestJS',
        'PostgreSQL',
        'SQL Server',
        'Redis',
        'MongoDb',
    ],
    'AI/LLM Tools': ['OpenAI API', 'AutoGen', 'LangChain', 'Pinecone'],
    'Cloud & DevOps': ['Amazon web services', 'Docker', 'GitHub Actions', 'Gitlab CI/CD'],
};

export const experience: ExperienceItem[] = [
    {
        company: 'TSA Group',
        role: 'Software Engineer',
        duration: '2025 - Present',
        description:
            'Leading development of scalable web applications and mentoring junior developers. Architecting solutions using modern tech stack and best practices.',
        technologies: ['React', 'TypeScript', 'Node.js', 'AWS'],
    },
    {
        company: 'Asurion',
        role: 'Software Engineer',
        duration: '2023 - 2025',
        description:
            'Developed and maintained full-stack applications. Collaborated with cross-functional teams to deliver high-quality software solutions.',
        technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Docker'],
    },
    {
        company: 'Realtair',
        role: 'Software Engineer',
        duration: '2022 - 2025',
        description:
            'Built responsive user interfaces and interactive web experiences. Improved website performance and user engagement metrics.',
        technologies: ['JavaScript', 'React', 'CSS', 'Figma'],
    },
    {
        company: 'Startup Labs',
        role: 'Front-end engineer',
        duration: '2018 - 2019',
        description:
            'Started development career working on various client projects. Gained foundational skills in web development and agile methodologies.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Git'],
    },
];

export const sections: SiteSection[] = [
    { id: 'hero', path: '~/', label: 'home' },
    { id: 'about', path: '~/about', label: 'about' },
    { id: 'skills', path: '~/skills', label: 'skills' },
    { id: 'experience', path: '~/experience', label: 'experience' },
    { id: 'contact', path: '~/contact', label: 'contact' },
];
