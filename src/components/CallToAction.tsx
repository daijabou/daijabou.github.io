import { useState } from "react";
import useWeb3Forms from "@web3forms/react";
import { Typewriter } from "./Typewriter";
import { TerminalWindow } from "./ui/TerminalWindow";
import { SectionHeading } from "./ui/SectionHeading";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { identity } from "../lib/resumeData";

export const CallToAction = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
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
            setTimeout(() => setIsSuccess(false), 5000);
        },
        onError: () => {
            setIsError(true);
            setIsLoading(false);
            setTimeout(() => setIsError(false), 5000);
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
        <section
            id="contact"
            className="relative min-h-screen bg-term-void py-20 px-4"
        >
            <div className="absolute inset-0 grid-bg" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <SectionHeading command="./contact.sh" label="Contact" className="mb-4" />
                    <p className="text-lg md:text-xl mb-6 font-mono">
                        <span className="text-term-phosphor/50">&gt;&nbsp;</span>
                        <Typewriter
                            sentences={["Let's work together", "Get in touch"]}
                            typingSpeed={80}
                            deletingSpeed={50}
                            delay={3000}
                            loop={true}
                        />
                    </p>
                    <p className="text-term-text text-base md:text-lg max-w-2xl mx-auto font-mono">
                        Have a project in mind or want to collaborate? I'd love
                        to hear from you. Drop me a message and let's create
                        something amazing together.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-px bg-gradient-to-r from-term-phosphor/0 via-term-phosphor/40 to-term-phosphor/0 opacity-0 blur-sm transition-opacity duration-500 group-focus-within:opacity-100" />

                    <TerminalWindow
                        title="~/contact/message.txt"
                        className="relative"
                        bodyClassName="p-8 md:p-12"
                    >
                        <form onSubmit={handleSubmit}>
                            {isSuccess && (
                                <div className="mb-8 p-4 bg-term-phosphor/10 border border-term-phosphor/30 flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-term-phosphor flex-shrink-0" />
                                    <p className="text-term-phosphor font-mono text-sm">
                                        Message sent. I'll get back to you soon.
                                    </p>
                                </div>
                            )}

                            {isError && (
                                <div className="mb-8 p-4 bg-term-magenta/10 border border-term-magenta/30 flex items-center gap-3">
                                    <AlertCircle className="w-6 h-6 text-term-magenta flex-shrink-0" />
                                    <p className="text-term-magenta font-mono text-sm">
                                        Send failed. Check your connection and try again.
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="group/field">
                                    <label
                                        htmlFor="name"
                                        className="block text-term-phosphor/60 text-sm font-ui mb-2 group-focus-within/field:text-term-phosphor transition-colors"
                                    >
                                        --name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="john doe"
                                        className="input-term"
                                    />
                                </div>

                                <div className="group/field">
                                    <label
                                        htmlFor="email"
                                        className="block text-term-phosphor/60 text-sm font-ui mb-2 group-focus-within/field:text-term-phosphor transition-colors"
                                    >
                                        --email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                        className="input-term"
                                    />
                                </div>
                            </div>

                            <div className="group/field mb-8">
                                <label
                                    htmlFor="message"
                                    className="block text-term-phosphor/60 text-sm font-ui mb-2 group-focus-within/field:text-term-phosphor transition-colors"
                                >
                                    --message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="tell me about your project..."
                                    className="input-term resize-none"
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-term-solid w-full md:w-auto"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            sending...
                                        </>
                                    ) : (
                                        <>
                                            $ send --now
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </TerminalWindow>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-term-text text-sm font-mono">
                        Or reach out directly at{" "}
                        <a
                            href={`mailto:${identity.email}`}
                            className="text-term-phosphor hover:text-glow hover:underline transition-all"
                        >
                            {identity.email}
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};
