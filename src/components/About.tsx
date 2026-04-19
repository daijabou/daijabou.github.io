export const About = () => {
    return (
        <section id="about" className="relative min-h-screen bg-zinc-950 flex items-center py-20">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#09090b_1px)] bg-[size:20px_20px]" />
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <h2 className="text-4xl font-bold mb-4 text-green-400 text-center">
                    About Me
                </h2>
                <p className="text-zinc-400 text-xl leading-relaxed max-w-3xl mx-auto text-center">
                    I'm a software developer with a passion for creating innovative applications. I have a strong background in programming and a deep understanding of the latest technologies. I'm always looking for new challenges and opportunities to learn and grow.
                </p>
            </div>
        </section>
    )
}