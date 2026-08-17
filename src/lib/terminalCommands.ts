import {
    bio,
    experience as staticExperience,
    identity,
    sections,
    skillCategories,
    skills,
    type ExperienceItem,
    type SkillCategory,
} from './resumeData';
import { GITHUB_URL, LINKEDIN_URL } from './links';

export interface CommandContext {
    experience: ExperienceItem[];
}

export const defaultContext: CommandContext = { experience: staticExperience };

export type OutputLine =
    | { kind: 'text'; text: string; tone?: 'dim' | 'bright' | 'accent' }
    | { kind: 'kv'; key: string; value: string }
    | { kind: 'link'; label: string; href: string }
    | { kind: 'blank' };

export type CommandAction =
    | { type: 'clear' }
    | { type: 'exit' }
    | { type: 'enter-chat' }
    | { type: 'scroll'; sectionId: string };

export interface CommandResult {
    lines?: OutputLine[];
    action?: CommandAction;
    isError?: boolean;
}

export interface Command {
    name: string;
    aliases?: string[];
    summary: string;
    usage?: string;
    run: (args: string[], ctx: CommandContext) => CommandResult;
    complete?: (partial: string) => string[];
}

const text = (t: string, tone?: 'dim' | 'bright' | 'accent'): OutputLine => ({ kind: 'text', text: t, tone });
const blank = (): OutputLine => ({ kind: 'blank' });

const registry: Command[] = [];

const register = (command: Command) => {
    registry.push(command);
};

register({
    name: 'help',
    aliases: ['?'],
    summary: 'list the available commands',
    usage: 'help [command]',
    complete: (partial) => registry.map((c) => c.name).filter((n) => n.startsWith(partial)),
    run: (args) => {
        if (args.length > 0) {
            const command = resolveCommand(args[0]);
            if (!command) {
                return unknownCommand(args[0]);
            }
            const lines: OutputLine[] = [
                text(command.usage ?? command.name, 'accent'),
                text(command.summary),
            ];
            if (command.aliases?.length) {
                lines.push(blank(), { kind: 'kv', key: 'aliases', value: command.aliases.join(', ') });
            }
            return { lines };
        }

        return {
            lines: [
                text('available commands', 'accent'),
                blank(),
                ...registry.map<OutputLine>((c) => ({ kind: 'kv', key: c.name, value: c.summary })),
                blank(),
                text('tab completes · ↑/↓ recalls history · ctrl+l clears', 'dim'),
                text("help <command> for details", 'dim'),
            ],
        };
    },
});

register({
    name: 'whoami',
    aliases: ['about'],
    summary: 'who I am',
    run: () => ({
        lines: [
            text(identity.name, 'bright'),
            text(identity.role, 'accent'),
            blank(),
            text(bio),
        ],
    }),
});

register({
    name: 'skills',
    summary: 'the tech I work with',
    usage: 'skills [category]',
    complete: (partial) => {
        const needle = partial.toLowerCase();
        return skillCategories.filter((c) => c.toLowerCase().startsWith(needle));
    },
    run: (args) => {
        if (args.length === 0) {
            return {
                lines: [
                    text('skill categories', 'accent'),
                    blank(),
                    ...skillCategories.map<OutputLine>((category) => ({
                        kind: 'kv',
                        key: `${skills[category].length} items`,
                        value: category,
                    })),
                    blank(),
                    text("skills <category> to expand one — partial names work", 'dim'),
                ],
            };
        }

        const query = args.join(' ').toLowerCase();
        const match = skillCategories.find((c) => c.toLowerCase().includes(query));

        if (!match) {
            return {
                isError: true,
                lines: [
                    text(`no skill category matching "${args.join(' ')}"`),
                    text(`try: ${skillCategories.join(' · ')}`, 'dim'),
                ],
            };
        }

        return {
            lines: [
                text(match, 'accent'),
                blank(),
                ...skills[match as SkillCategory].map<OutputLine>((skill) => text(`· ${skill}`)),
            ],
        };
    },
});

register({
    name: 'experience',
    aliases: ['work'],
    summary: 'where I have worked',
    run: (_args, ctx) => {
        const lines: OutputLine[] = [text('work history', 'accent')];

        ctx.experience.forEach((item) => {
            lines.push(blank());
            lines.push(text(`${item.company} — ${item.role}`, 'bright'));
            lines.push(text(item.duration, 'dim'));
            lines.push(text(item.description));
            if (item.technologies?.length) {
                lines.push(text(`[ ${item.technologies.join(' · ')} ]`, 'dim'));
            }
        });

        return { lines };
    },
});

register({
    name: 'contact',
    summary: 'how to reach me',
    run: () => {
        const lines: OutputLine[] = [
            text('get in touch', 'accent'),
            blank(),
            { kind: 'link', label: identity.email, href: `mailto:${identity.email}` },
        ];

        if (GITHUB_URL) lines.push({ kind: 'link', label: GITHUB_URL, href: GITHUB_URL });
        if (LINKEDIN_URL) lines.push({ kind: 'link', label: LINKEDIN_URL, href: LINKEDIN_URL });

        lines.push(blank(), text("or use the form in ~/contact — 'cd contact'", 'dim'));

        return { lines };
    },
});

register({
    name: 'email',
    summary: 'open a mail draft',
    run: () => ({
        lines: [{ kind: 'link', label: identity.email, href: `mailto:${identity.email}` }],
    }),
});

if (GITHUB_URL) {
    register({
        name: 'github',
        summary: 'my GitHub profile',
        run: () => ({ lines: [{ kind: 'link', label: GITHUB_URL, href: GITHUB_URL }] }),
    });
}

if (LINKEDIN_URL) {
    register({
        name: 'linkedin',
        summary: 'my LinkedIn profile',
        run: () => ({ lines: [{ kind: 'link', label: LINKEDIN_URL, href: LINKEDIN_URL }] }),
    });
}

register({
    name: 'ls',
    summary: 'list the sections of this site',
    run: () => ({
        lines: [
            ...sections.map<OutputLine>((s) => ({ kind: 'kv', key: s.id, value: s.path })),
            blank(),
            text("cd <section> to jump there", 'dim'),
        ],
    }),
});

register({
    name: 'cd',
    aliases: ['goto'],
    summary: 'scroll the page to a section',
    usage: 'cd <section>',
    complete: (partial) => sections.map((s) => s.id).filter((id) => id.startsWith(partial.toLowerCase())),
    run: (args) => {
        if (args.length === 0) {
            return {
                isError: true,
                lines: [text('cd needs a section — try: ' + sections.map((s) => s.id).join(', '))],
            };
        }

        const target = args[0].toLowerCase().replace(/^[~.]?\/+/, '').replace(/\/+$/, '');
        const match = sections.find((s) => s.id === target || s.label === target);

        if (!match) {
            return {
                isError: true,
                lines: [
                    text(`no such section: ${args[0]}`),
                    text(`try: ${sections.map((s) => s.id).join(', ')}`, 'dim'),
                ],
            };
        }

        return {
            lines: [text(`→ ${match.path}`, 'dim')],
            action: { type: 'scroll', sectionId: match.id },
        };
    },
});

register({
    name: 'ask',
    summary: 'enter AI chat mode for free-form questions',
    run: () => ({ action: { type: 'enter-chat' } }),
});

register({
    name: 'clear',
    aliases: ['cls'],
    summary: 'wipe the screen',
    run: () => ({ action: { type: 'clear' } }),
});

register({
    name: 'exit',
    aliases: ['quit'],
    summary: 'close this terminal',
    run: () => ({ action: { type: 'exit' } }),
});

export const commands: readonly Command[] = registry;

export const commandNames: readonly string[] = registry.flatMap((c) => [c.name, ...(c.aliases ?? [])]);

export function resolveCommand(name: string): Command | undefined {
    const needle = name.toLowerCase();
    return registry.find((c) => c.name === needle || c.aliases?.includes(needle));
}

function unknownCommand(name: string): CommandResult {
    const lines: OutputLine[] = [text(`command not found: ${name}`)];

    const needle = name.toLowerCase();
    const suggestions = needle.length >= 2
        ? commandNames.filter((n) => n.startsWith(needle.slice(0, 2)) && n !== needle)
        : [];

    if (suggestions.length > 0) {
        lines.push(text(`did you mean: ${suggestions.join(', ')}?`, 'dim'));
    } else {
        lines.push(text("type 'help' to see what's available", 'dim'));
    }

    return { isError: true, lines };
}

export function runCommand(raw: string, ctx: CommandContext = defaultContext): CommandResult {
    const tokens = raw.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return {};

    const name = tokens[0].replace(/^\//, '');
    const command = resolveCommand(name);

    if (!command) return unknownCommand(name);

    return command.run(tokens.slice(1), ctx);
}

export function completeLine(line: string): { candidates: string[]; prefix: string; token: string } {
    const startingNewToken = /\s$/.test(line);
    const tokens = line.trimStart().split(/\s+/).filter(Boolean);

    if (tokens.length === 0 || (tokens.length === 1 && !startingNewToken)) {
        const token = tokens[0] ?? '';
        return {
            candidates: commandNames.filter((n) => n.startsWith(token.toLowerCase())),
            prefix: '',
            token,
        };
    }

    const command = resolveCommand(tokens[0]);
    if (!command?.complete) return { candidates: [], prefix: line, token: '' };

    const token = startingNewToken ? '' : tokens[tokens.length - 1];
    const consumed = startingNewToken ? tokens : tokens.slice(0, -1);

    return {
        candidates: command.complete(token),
        prefix: consumed.join(' ') + ' ',
        token,
    };
}

export function longestCommonPrefix(values: string[]): string {
    if (values.length === 0) return '';

    let prefix = values[0];
    for (const value of values.slice(1)) {
        let i = 0;
        while (i < prefix.length && i < value.length && prefix[i].toLowerCase() === value[i].toLowerCase()) i++;
        prefix = prefix.slice(0, i);
        if (!prefix) break;
    }
    return prefix;
}
