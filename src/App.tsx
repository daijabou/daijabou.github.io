import { Hero } from "./components/Hero"
import { About } from "./components/About"
import { Skills } from "./components/Skills"
import { Experience } from "./components/Experience"
import { CallToAction } from "./components/CallToAction"
import { Chatbot, type ChatWindowState } from "./components/Chatbot"
import { StatusBar } from "./components/StatusBar"
import { BootSequence } from "./components/BootSequence"
import { MatrixRain } from "./components/effects/MatrixRain"
import { CRTOverlay } from "./components/effects/CRTOverlay"
import { useState } from "react"

function App() {
  const [chat, setChat] = useState<ChatWindowState>('closed')

  return (
    <>
      <MatrixRain />

      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <CallToAction />
      </div>

      <Chatbot state={chat} onChange={setChat} />
      <StatusBar chat={chat} onChatChange={setChat} />
      <CRTOverlay />
      <BootSequence />
    </>
  )
}

export default App
