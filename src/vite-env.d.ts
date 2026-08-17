/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CONTENTFUL_SPACE_ID: string;
    readonly VITE_CONTENTFUL_ACCESS_TOKEN: string;
    readonly VITE_CONTENTFUL_EXPERIENCE_CONTENT_TYPE: string;
    readonly VITE_CHATBOT_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
