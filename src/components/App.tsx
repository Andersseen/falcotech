import "../i18n/i18n.config";
import { Navbar } from "./navigation/navbar";
import { SmoothScroll } from "./providers/smooth-scroll";
import About from "./react/About";
import Features from "./react/Features";
import Footer from "./react/Footer";
import Hero from "./react/Hero";
import { ScrollToTop } from "./react/ScrollToTop";

export default function App() {
  return (
    <>
      <Navbar />
      <SmoothScroll>
        <main>
          <Hero />
          <Features />
          <About />
          <Footer />
          <ScrollToTop />
        </main>
      </SmoothScroll>
    </>
  );
}
