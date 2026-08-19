import { useState } from "react";
import useWeb3Forms from "@web3forms/react";
import { Section } from "./ui/Section";
import { SectionHeading } from "./ui/SectionHeading";
import { TerminalWindow } from "./ui/TerminalWindow";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { identity } from "../lib/resumeData";

/** Flag-form labels carry a plain-language name, so the accessible name reads. */
const FIELDS = [
    { name: "name", flag: "--name", plain: "your name", placeholder: "jane doe", type: "text" },
    { name: "email", flag: "--email", plain: "so I can reply", placeholder: "jane@example.com", type: "email" },
] as const;

export const CallToAction = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const { submit } = useWeb3Forms({
        access_key: "1c9a5ed9-d1bc-42d4-ba7d-1a7f94e1181c",
        settings: {
            from_name: "Portfolio Contact Form",
            subject: "New message from your portfolio website",
        },
        onSuccess: () => {
            setFormData({ name: "", email: "", message: "" });
            setIsSuccess(true);
            setIsLoading(false);
            // No auto-dismiss: the confirmation is the reassurance.
        },
        onError: () => {
            setIsError(true);
            setIsLoading(false);
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);
        await submit(formData);
    };

    return (
        <Section id="contact" label="Contact">
            <SectionHeading command="./contact.sh" label="Contact" />

            <div className="shell-output">
                <p className="t-body mb-8">
                    Have a project in mind or want to collaborate? I'd love to hear from
                    you. Drop me a message and let's create something amazing together.
                </p>

                <TerminalWindow title="~/contact/message.txt" bodyClassName="p-5 md:p-8">
                    <form onSubmit={handleSubmit} noValidate={false}>
                        <div
                            aria-live="polite"
                            className={isSuccess || isError ? "mb-6" : undefined}
                        >
                            {isSuccess && (
                                <div className="flex items-start gap-3 border border-edge-strong bg-term-phosphor/[0.06] p-4">
                                    <CheckCircle
                                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-term-phosphor"
                                        aria-hidden="true"
                                    />
                                    <div className="font-mono text-chrome">
                                        <p className="text-term-phosphor">exit 0 — message sent</p>
                                        <p className="mt-1 text-ink-body">
                                            delivered to {identity.email} · I read every message and
                                            usually reply within a couple of days.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {isError && (
                                <div className="flex items-start gap-3 border border-term-magenta/40 bg-term-magenta/[0.06] p-4">
                                    <AlertCircle
                                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-term-magenta"
                                        aria-hidden="true"
                                    />
                                    <div className="font-mono text-chrome">
                                        <p className="text-term-magenta">exit 1 — send failed</p>
                                        <p className="mt-1 text-ink-body">
                                            Check your connection and try again, or email{" "}
                                            <a
                                                href={`mailto:${identity.email}`}
                                                className="text-term-phosphor underline decoration-edge underline-offset-2 hover:decoration-term-phosphor"
                                            >
                                                {identity.email}
                                            </a>{" "}
                                            directly.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                            {FIELDS.map((field) => (
                                <div key={field.name}>
                                    <label htmlFor={field.name} className="t-label mb-2 block">
                                        {field.flag}
                                        <span className="ml-2 text-ink-hint">({field.plain})</span>
                                    </label>
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required
                                        placeholder={field.placeholder}
                                        className="input-term"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mb-8">
                            <label htmlFor="message" className="t-label mb-2 block">
                                --message
                                <span className="ml-2 text-ink-hint">(what you need)</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="a role you're hiring for, or a project you want built..."
                                className="input-term resize-y"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-term-solid"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                        sending...
                                    </>
                                ) : (
                                    <>
                                        $ send --now
                                        <Send className="h-4 w-4" aria-hidden="true" />
                                    </>
                                )}
                            </button>

                            <p className="t-meta">
                                all three fields required · or email{" "}
                                <a
                                    href={`mailto:${identity.email}`}
                                    className="inline-flex min-h-[44px] items-center text-ink-label underline
                                               decoration-edge underline-offset-2 transition-colors
                                               hover:text-term-phosphor hover:decoration-term-phosphor"
                                >
                                    {identity.email}
                                </a>
                            </p>
                        </div>
                    </form>
                </TerminalWindow>
            </div>
        </Section>
    );
};
