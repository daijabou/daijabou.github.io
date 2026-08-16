import { Typewriter } from './Typewriter';
import { GlitchText } from './effects/GlitchText';

export const Hero = () => {
    return (
        <section id="hero" className='relative h-screen bg-term-void'>
            <div className="flex justify-center items-center h-screen grid-bg p-4">
                <div className="flex flex-row justify-center items-center px-5">
                    <div className="flex flex-col">
                        <p className="font-ui text-sm md:text-base text-term-phosphor/60 mb-3">
                            visitor@daijabou:~$ whoami
                        </p>

                        <h1 className="font-display text-6xl md:text-9xl text-term-bright leading-none">
                            Hello, I'm{' '}
                            <GlitchText text="Michael" className="text-term-phosphor text-glow" />
                        </h1>

                        <p className="text-base mt-4 md:text-3xl font-mono">
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

                        <div className="flex justify-center items-center pt-8">
                            <a href="#about" className="btn-term">
                                $ cd ./about
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
