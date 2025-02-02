import { useTranslation } from "react-i18next";
import "../i18n/i18n.config";
import Footer from "./Footer";
import PortfolioGrid from "./PortfolioGrid";
import { SmoothScroll } from "./providers/smooth-scroll";
import About from "./react/About";
import ContactForm from "./react/ContactForm";
import Features from "./react/Features";
import Hero from "./react/Hero";
import { ScrollToTop } from "./react/ScrollToTop";

export default function App() {
  const { t } = useTranslation();
  return (
    <>
      <SmoothScroll>
        <main className="bg-background overflow-y-hidden">
          <Hero translation={t} />
          <Features translation={t} />
          <About />
          <PortfolioGrid />
          <ContactForm translation={t} />
        </main>
      </SmoothScroll>
      <Footer />
      <ScrollToTop />
    </>
  );
}
