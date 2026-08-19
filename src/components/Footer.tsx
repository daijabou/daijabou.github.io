import { Prompt } from './ui/Prompt';
import { identity } from '../lib/resumeData';
import { GITHUB_URL, LINKEDIN_URL } from '../lib/links';

/** Keyboard-reachable external links, rendered as `ls -la ~/links`. */
const LINKS = [
    { label: 'github', href: GITHUB_URL, note: 'code' },
    { label: 'linkedin', href: LINKEDIN_URL, note: 'history' },
    { label: 'email', href: `mailto:${identity.email}`, note: identity.email },
].filter((link) => Boolean(link.href));

export const Footer = () => (
    <footer className="relative border-t border-edge px-6 py-16 md:px-10">
        <div className="mx-auto w-full max-w-5xl">
            <p className="t-label mb-6">
                <Prompt className="mr-2 inline" /> ls -la ~/links
            </p>

            <ul className="shell-output space-y-3">
                {LINKS.map((link) => (
                    <li key={link.label} className="flex flex-wrap items-baseline gap-x-4">
                        <a
                            href={link.href}
                            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                            rel="noreferrer"
                            className="inline-flex min-h-[44px] items-center font-ui text-role
                                       text-term-phosphor underline decoration-edge underline-offset-4
                                       transition-colors hover:decoration-term-phosphor hover:text-glow"
                        >
                            {link.label}
                        </a>
                        <span className="t-meta">{link.note}</span>
                    </li>
                ))}
            </ul>

            <p className="t-meta mt-12">
                {identity.name} · {identity.role} · built with react, typescript and vite
            </p>
        </div>
    </footer>
);
