import { createClient, type Entry, type EntrySkeletonType } from 'contentful';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import type { Document } from '@contentful/rich-text-types';
import { experience as fallbackExperienceData } from './resumeData';

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
        const contentType = 'experience';

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
