import "../i18n/i18n.config";
import Footer from "./Footer";
import { Navbar } from "./navigation/navbar";
import PortfolioGrid from "./PortfolioGrid";
import { SmoothScroll } from "./providers/smooth-scroll";
import About from "./react/About";
import ContactForm from "./react/ContactForm";
import Features from "./react/Features";
import Hero from "./react/Hero";
import { ScrollToTop } from "./react/ScrollToTop";

export default function App() {
  return (
    <>
      <Navbar />
      <SmoothScroll>
        <main className="bg-background overflow-y-hidden">
          <Hero />
          <Features />
          <About />
          <PortfolioGrid />
          <ContactForm />
        </main>
      </SmoothScroll>
      <Footer />
      <ScrollToTop />
    </>
  );
}
