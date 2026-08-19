# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences of equal weight, both arriving cold and deciding fast:

- **Recruiters and hiring managers** screening Michael for a full-time software engineering role. They need to verify seniority, stack fit, and recency quickly, then get a contact path. Many are non-technical and skim.
- **Prospective clients** with a project in mind, evaluating whether Michael can build it. They arrive with a problem rather than a job spec and need evidence of shipped work plus a low-friction way to enquire.

The site must serve employment screening and inbound project enquiry equally well; neither audience may be designed for at the other's expense.

## Product Purpose

A personal portfolio and web resume for **Michael Endaya**, software engineer, at `daijabou.github.io`. It presents his identity, skills, and work history, and gives visitors two ways to make contact: a message form and an AI assistant that answers questions about him conversationally.

Success is a qualified contact: a recruiter or client who arrives cold, believes Michael can do the work, and reaches out.

## Positioning

Michael ships AI features into real products — practical LLM integration (OpenAI API, LangChain, AutoGen, Pinecone) wired into production applications rather than demos. The site's own AI terminal assistant is the proof of the claim, not decoration around it.

This is the differentiator to make legible. Generic developer claims ("passion for innovative applications", "loves solving complex problems") currently occupy the copy slots where this positioning belongs; they are placeholder-grade and must not be treated as settled voice.

## Operating Context

- Visitors arrive from a resume link, a job application, LinkedIn, GitHub, or a referral — usually on a single visit, often on mobile, with no prior context about Michael.
- Recruiters typically scan for role titles, dates, and technologies before reading anything.
- Content is authored outside the codebase: Experience entries are edited in **Contentful** and published without a code change.
- The site doubles as a work sample. Engineering-literate visitors will read the interface itself as evidence of craft.

## Capabilities and Constraints

**Capabilities**

- Single-page scrolling site: Hero, About, Skills, Experience, Contact.
- Interactive terminal console with a real command registry (`help`, section navigation, resume queries, clear, exit) and tab completion, plus a chat mode backed by an LLM.
- AI chat assistant via `api/chat.ts` — an OpenRouter-backed streaming Vercel function (default model `nvidia/nemotron-3-super-120b-a12b:free`, overridable by `MODEL`). Only user/assistant roles are forwarded, and message content is truncated to 5000 characters.
- Contact form via Web3Forms (client-side, no backend of its own), with success and failure states.
- Experience content fetched from Contentful, falling back silently to the hardcoded array when credentials are absent.
- Boot sequence, Matrix rain, CRT overlay, glitch and typewriter effects, and a persistent status bar.

**Technical constraints**

- Stack: React 19, TypeScript, Vite 7, Tailwind 3, Framer Motion, lucide-react.
- **The canonical deployment is GitHub Pages at `daijabou.github.io`**, built by `.github/workflows/deploy.yml` on push to `main`. The build is fully static: no server, no serverless functions, no runtime secrets.
- The Vercel project (`web-resume-rust.vercel.app`) exists to host the chat API endpoint only. The Pages site calls it cross-origin via `VITE_CHATBOT_API_URL`; CORS is wide open on `/api/*` by design.
- Consequence: **no feature may depend on server-side rendering or a same-origin backend.** Anything needing compute must either call the Vercel function cross-origin or degrade gracefully to static behavior.
- Build-time secrets come from GitHub repository secrets (`VITE_CONTENTFUL_SPACE_ID`, `VITE_CONTENTFUL_ACCESS_TOKEN`, `VITE_CHATBOT_API_URL`). `VITE_*` values are inlined into the browser bundle and are therefore public — `OPENROUTER_API_KEY` must never carry that prefix.

**Terminology used in the product**

Sections are addressed as filesystem paths (`~/`, `~/about`, `~/skills`, `~/experience`, `~/contact`); actions are phrased as commands (`./contact.sh`, `$ send --now`); form fields are phrased as flags (`--name`, `--email`, `--message`). The handle is `daijabou`.

**Undecided / open**

- No LinkedIn URL is set (`LINKEDIN_URL` is an empty string in `src/lib/links.ts`). Either supply it or stop rendering the affordance; do not invent one.
- Two contact routes coexist: `michaelendaya3@gmail.com` in `resumeData.ts` and the chat system prompt, alongside the Web3Forms endpoint. Which address is canonical for public contact is unconfirmed.
- No projects or case-study section exists. Whether to add one is undecided.

## Brand Commitments

- Name: **Michael Endaya**. Handle: **daijabou**. Title: **Software Engineer**.
- **The terminal / CLI identity is binding.** The command-line metaphor, boot sequence, CRT and phosphor-green treatment, monospace typography, and command-shaped interactions are deliberate and permanent. Future work extends this world; it does not replace it and does not dilute it toward a conventional portfolio layout.
- Voice follows from that identity: lowercase, terse, command-like in interface copy. The prose sections do not yet live up to it.

## Evidence on Hand

**Real**

- Employer names, and the working AI terminal assistant, which is itself a live demonstration of the positioning.
- GitHub profile: `https://github.com/daijabou`.
- Skills inventory in `src/lib/resumeData.ts` (languages/frameworks, AI/LLM tools, cloud/DevOps) is accurate.
- `public/logo.png`, `public/favicon.ico`.

**Placeholder — must not be presented as fact**

- The `experience` array in `src/lib/resumeData.ts` is a **fallback stub only**. Contentful holds the authoritative work history. Its role descriptions, technology lists, and overlapping durations (Realtair 2022–2025 against Asurion 2023–2025) are not authoritative and must not be quoted, summarized, or built upon as real accomplishments.
- `bio` and `taglines` in `resumeData.ts` are generic filler.
- The chat system prompt in `api/chat.ts` restates the skills inventory inline; it will drift from Contentful and is not a source of truth about Michael's history.

**Absent — do not fabricate**

- No testimonials, client names, case studies, metrics, press, or awards exist. No project portfolio exists. No photograph of Michael is in the repo. Nothing in these categories may be invented to fill a layout.
- Existing metric-flavored claims in the placeholder descriptions ("improved website performance and user engagement metrics") are unsubstantiated and must not be promoted into headline copy.

## Product Principles

1. **The interface is the argument.** This site is Michael's most visible work sample, so its craft carries the same weight as its content. A claim about engineering ability that the page itself contradicts is a net loss.
2. **The terminal must never cost a visitor the information they came for.** A recruiter who does not type a command still has to reach dates, titles, technologies, and a contact path. The metaphor is the delivery mechanism, not a gate.
3. **Truth over completeness.** An empty section beats a fabricated one. Placeholder copy is a known debt to be written, never a layout to be preserved.
4. **Static-first by architecture.** Every feature works, or degrades honestly, in a static build with no same-origin server.
5. **Content stays authorable.** Work history lives in Contentful; changes to it must not require a deploy from source.

## Accessibility & Inclusion

No formal standard has been mandated, but the design carries real obligations from its own choices:

- The heavy motion layer (Matrix rain, boot sequence, glitch, typewriter, CRT) already honors `prefers-reduced-motion` in `MatrixRain`, `BootSequence`, `GlitchText`, and `TerminalConsole`. Every future effect must do the same.
- Low-contrast phosphor-on-black is the identity's biggest accessibility risk. Body and label text must stay legible; decorative dimming must not spread to content the visitor needs.
- The terminal is keyboard-driven by nature; keyboard access and visible focus are non-negotiable, and all interactive affordances need accessible names.
- Purely decorative layers stay `aria-hidden`.
