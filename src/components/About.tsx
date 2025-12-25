import { Typewriter } from "./Typewriter"

export const About = () => {
    return (
        <div id="about" className="flex justify-center items-center p-4 py-16 h-screen
                   bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#09090b_1px)] bg-[size:20px_20px]
        ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-[70%]">
                <div className="flex items-center justify-center">
                    <h1 className="text-4xl font-bold">
                        <Typewriter
                            sentences={[
                                "About Me",
                            ]}
                            typingSpeed={100}
                            deletingSpeed={200}
                            delay={6000}
                            loop={true}
                        />
                    </h1>
                </div>
                <div className="flex items-center">
                    <p className="text-2xl">
                        I'm a software developer with a passion for creating innovative applications. I have a strong background in programming and a deep understanding of the latest technologies. I'm always looking for new challenges and opportunities to learn and grow.
                    </p>
                </div>
            </div>
        </div>
    )
}