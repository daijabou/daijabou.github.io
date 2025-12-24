import { Hero } from "./components/Hero"
import { About } from "./components/About"
import { Header } from "./components/Header"
import { Skills } from "./components/Skills"
import { Experience } from "./components/Experience"
import { CallToAction } from "./components/CallToAction"
import { useState, useEffect } from "react";
function App() {
  const [isShowHeader, setIsShowHeader] = useState(false);
  const viewHeight = window.innerHeight;
  console.log(viewHeight);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY + 100 > viewHeight) {
        setIsShowHeader(true);
      } else {
        setIsShowHeader(false);
      }

    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>

      {isShowHeader && <Header />}
      <Hero />
      <About />
      <Skills />
      <Experience />
      <CallToAction />
    </>
  )
}

export default App
