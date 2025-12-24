import { Typewriter } from './Typewriter';

export const Hero = () => {
    return (
        <section id="hero" className='relative h-screen bg-zinc-950'>
            <div className="flex justify-center items-center h-screen bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] p-4">
                <div className="flex flex-row justify-center items-center px-5">
                    <div className="flex flex-col">
                        <h1 className="text-5xl md:text-8xl font-bold">
                            Hello, I'm <span className="text-green-400">Michael</span>
                        </h1>
                        <p className="text-lg mt-4 md:text-4xl">
                            <Typewriter
                                sentences={[
                                    "I'm a software developer.",
                                    "I build innovative applications.",
                                    "I love solving complex problems.",
                                    "I'm passionate about tech."
                                ]}
                                typingSpeed={100}
                                deletingSpeed={50}
                                delay={1500}
                            />
                        </p>
                        <div className="flex justify-center items-center pt-5">
                            <a href="#about" className="bg-black border-2 border-green-400 
                    text-green-400 px-6 py-3 font-mono hover:bg-green-400 
                    hover:text-black transition-colors">
                                About Me
                            </a>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>

            </div>
        </section>
    )
}