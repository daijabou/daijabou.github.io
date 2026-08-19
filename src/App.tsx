import { useState } from "react"
import { Hero } from "./components/Hero"
import { About } from "./components/About"
import { Skills } from "./components/Skills"
import { Experience } from "./components/Experience"
import { CallToAction } from "./components/CallToAction"
import { Footer } from "./components/Footer"
import { TerminalConsole, type ChatWindowState } from "./components/TerminalConsole"
import { StatusBar } from "./components/StatusBar"
import { BootSequence } from "./components/BootSequence"
import { MatrixRain } from "./components/effects/MatrixRain"
import { CRTOverlay } from "./components/effects/CRTOverlay"

function App() {
  const [chat, setChat] = useState<ChatWindowState>('closed')

  return (
    <>
      <MatrixRain />

      {/* Page-level grid, fading out below the first screens. */}
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none fixed inset-0 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 80%)',
        }}
      />

      <a
        href="#main"
        className="sr-only font-ui text-chrome focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110]
                   focus:border focus:border-term-phosphor focus:bg-term-void focus:px-4 focus:py-2
                   focus:text-term-phosphor"
      >
        skip to content
      </a>

      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <CallToAction />
        <Footer />
      </main>

      <TerminalConsole state={chat} onChange={setChat} />
      <StatusBar chat={chat} onChatChange={setChat} />
      <CRTOverlay />
      <BootSequence />
    </>
  )
}

export default App
