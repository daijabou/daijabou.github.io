import { SectionHeading } from './ui/SectionHeading';

export const About = () => {
    return (
        <section id="about" className="relative min-h-screen bg-term-void flex items-center py-20">
            <div className="absolute inset-0 grid-bg" />
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <SectionHeading command="cat about.md" label="About" className="mb-8" />
                <p className="text-term-text text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-center font-mono">
                    I'm a software developer with a passion for creating innovative applications. I have a strong background in programming and a deep understanding of the latest technologies. I'm always looking for new challenges and opportunities to learn and grow.
                </p>
            </div>
        </section>
    )
}
