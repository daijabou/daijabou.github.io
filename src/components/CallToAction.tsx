import { useState } from "react";
import useWeb3Forms from "@web3forms/react";
import { Typewriter } from "./Typewriter";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
            className="relative min-h-screen bg-zinc-950 py-20 px-4"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        <Typewriter
                            sentences={["Let's Work Together", "Get In Touch"]}
                            typingSpeed={80}
                            deletingSpeed={50}
                            delay={3000}
                            loop={true}
                        />
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Have a project in mind or want to collaborate? I'd love
                        to hear from you. Drop me a message and let's create
                        something amazing together.
                    </p>
                </div>

                {/* Form Container */}
                <div className="relative">
                    {/* Glowing border effect */}

                    <form
                        onSubmit={handleSubmit}
                        className="relative  backdrop-blur-sm border border-green-800 p-8 md:p-12"
                    >
                        {/* Success Message */}
                        {isSuccess && (
                            <div className="mb-8 p-4 bg-green-400/10 border border-green-400/30 flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                <p className="text-green-400">
                                    Thank you! Your message has been sent
                                    successfully. I'll get back to you soon.
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {isError && (
                            <div className="mb-8 p-4 bg-red-400/10 border border-red-400/30 flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                <p className="text-red-400">
                                    Oops! Something went wrong. Please try again
                                    later.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Name Input */}
                            <div className="group">
                                <label
                                    htmlFor="name"
                                    className="block text-zinc-400 text-sm font-mono mb-2 group-focus-within:text-green-400 transition-colors"
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 
                                             text-white placeholder-zinc-500 
                                             focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50
                                             transition-all duration-300"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="group">
                                <label
                                    htmlFor="email"
                                    className="block text-zinc-400 text-sm font-mono mb-2 group-focus-within:text-green-400 transition-colors"
                                >
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 
                                             text-white placeholder-zinc-500 
                                             focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50
                                             transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Message Textarea */}
                        <div className="group mb-8">
                            <label
                                htmlFor="message"
                                className="block text-zinc-400 text-sm font-mono mb-2 group-focus-within:text-green-400 transition-colors"
                            >
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Tell me about your project..."
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 
                                         text-white placeholder-zinc-500 resize-none
                                         focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50
                                         transition-all duration-300"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto px-8 py-4 bg-green-400 text-zinc-900 font-bold font-mono
                                    flex items-center justify-center gap-3
                                     hover:bg-green-300 hover:shadow-lg hover:shadow-green-400/25
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-all duration-300 group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Message
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Alternative Contact */}
                <div className="mt-12 text-center">
                    <p className="text-zinc-500 text-sm">
                        Or reach out directly at{" "}
                        <a
                            href="mailto:michaelendaya3@gmail.com"
                            className="text-green-400 hover:underline"
                        >
                            michaelendaya3@gmail.com

                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};
