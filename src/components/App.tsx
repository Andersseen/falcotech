import "../i18n/i18n.config";
import { Navbar } from "./navigation/navbar";
import { SmoothScroll } from "./providers/smooth-scroll";
import About from "./react/About";
import Features from "./react/Features";
import Footer from "./Footer";
import Hero from "./react/Hero";
import { ScrollToTop } from "./react/ScrollToTop";
import PortfolioGrid from "./PortfolioGrid";
import Contact from "./Contact.astro";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <SmoothScroll>
        <main className="bg-background overflow-y-hidden">
          <Hero />
          <Features />
          <About />
          <PortfolioGrid />
          {children}
        </main>
      </SmoothScroll>
      <Footer />
      <ScrollToTop />
    </>
  );
}
