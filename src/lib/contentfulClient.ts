import { createClient, type Entry, type EntrySkeletonType } from 'contentful';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import type { Document } from '@contentful/rich-text-types';

// Define the fields for Experience content type (description is rich text from Contentful)
export interface ExperienceFields {
    company: string;
    role: string;
    duration: string;
    description: string;
    technologies?: string[];
    order?: number;
}

// Raw fields from Contentful (description is Document type)
interface ContentfulExperienceFields {
    company: string;
    role: string;
    duration: string;
    description: Document;
    technologies?: string[];
    order?: number;
}

export interface ExperienceSkeleton extends EntrySkeletonType {
    contentTypeId: 'experience';
    fields: ContentfulExperienceFields;
}

export type ExperienceEntry = Entry<ExperienceSkeleton, undefined, string>;

const fallbackExperienceData: ExperienceFields[] = [
    {
        company: "TSA Group",
        role: "Software Engineer",
        duration: "2025 - Present",
        description: "Leading development of scalable web applications and mentoring junior developers. Architecting solutions using modern tech stack and best practices.",
        technologies: ["React", "TypeScript", "Node.js", "AWS"]
    },
    {
        company: "Asurion",
        role: "Software Engineer",
        duration: "2023 - 2025",
        description: "Developed and maintained full-stack applications. Collaborated with cross-functional teams to deliver high-quality software solutions.",
        technologies: ["Vue.js", "Python", "PostgreSQL", "Docker"]
    },
    {
        company: "Realtair",
        role: "Software Engineer",
        duration: "2022 - 2025",
        description: "Built responsive user interfaces and interactive web experiences. Improved website performance and user engagement metrics.",
        technologies: ["JavaScript", "React", "CSS", "Figma"]
    },
    {
        company: "Startup Labs",
        role: "Front-end engineer",
        duration: "2018 - 2019",
        description: "Started development career working on various client projects. Gained foundational skills in web development and agile methodologies.",
        technologies: ["HTML", "CSS", "JavaScript", "Git"]
    }
];

const isContentfulConfigured = () => {
    return (
        import.meta.env.VITE_CONTENTFUL_SPACE_ID &&
        import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
    );
};

const getClient = () => {
    if (!isContentfulConfigured()) {
        return null;
    }

    return createClient({
        space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
        accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
    });
};

export async function getExperienceEntries(): Promise<ExperienceFields[]> {
    const client = getClient();

    if (!client) {
        console.log('Contentful not configured, using fallback data');
        return fallbackExperienceData;
    }

    try {
        const contentType = import.meta.env.VITE_CONTENTFUL_EXPERIENCE_CONTENT_TYPE || 'experience';

        const response = await client.getEntries<ExperienceSkeleton>({
            content_type: contentType as 'experience',
        });

        if (response.items.length === 0) {
            console.log('No entries found in Contentful, using fallback data');
            return fallbackExperienceData;
        }

        return response.items.map((item) => ({
            company: item.fields.company as string,
            role: item.fields.role as string,
            duration: item.fields.duration as string,
            // Convert rich text document to plain string
            description: documentToPlainTextString(item.fields.description as Document),
            technologies: item.fields.technologies as string[] | undefined,
            order: item.fields.order as number | undefined,
        }));
    } catch (error) {
        console.error('Error fetching from Contentful:', error);
        return fallbackExperienceData;
    }
}
