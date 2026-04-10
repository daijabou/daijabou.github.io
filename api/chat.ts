import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

const SYSTEM_PROMPT = `You are an AI assistant for Michael Endaya's portfolio website. Michael is a software developer with expertise in TypeScript, JavaScript, React, Next.js, Vue.js, Node.js, .NET, NestJS, PostgreSQL, SQL Server, Redis, MongoDB, AWS, Docker, GitHub Actions, GitLab CI/CD, and AI/LLM tools including the OpenAI API, LangChain, AutoGen, and Pinecone.

Your job is to help visitors learn about Michael — his skills, experience, projects, and how to get in touch. Be concise, professional, and friendly. Keep responses to 2–4 sentences unless the visitor asks for more detail. If asked something you don't know about Michael, say so honestly. For contact, direct visitors to michaelendaya3@gmail.com.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS first — set before anything else so every response includes them
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Guard missing API key before attempting anything
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }

    // Initialize inside handler so a bad key fails here, not at module load
    const openrouter = createOpenRouter({
        apiKey,
        appName: 'Michael Endaya Portfolio',
        appUrl: 'https://web-resume-rust.vercel.app',
    });

    const { messages } = req.body as { messages: Array<{ role: string; content: string }> };

    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages must be a non-empty array' });
    }

    // Only allow user/assistant roles — prevents system prompt injection
    const validMessages = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: String(m.content).slice(0, 5000) }));

    if (validMessages.length === 0) {
        return res.status(400).json({ error: 'No valid messages provided' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const result = streamText({
            model: openrouter(process.env.MODEL??'nvidia/nemotron-3-super-120b-a12b:free'),
            system: SYSTEM_PROMPT,
            messages: validMessages,
        });

        for await (const delta of result.textStream) {
            if (res.writableEnded) break;
            res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
        }
        if (!res.writableEnded) {
            res.write('data: [DONE]\n\n');
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[chat] error:', message);
        if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ content: `\n\n[error: ${message}]` })}\n\n`);
        }
    }

    res.end();
}
