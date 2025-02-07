import type { TFunction } from "i18next";
import { Instagram, PhoneIcon as WhatsApp } from "lucide-react";
const Footer = ({
  translation,
}: {
  translation: TFunction<"translation", undefined>;
}) => {
  const year = new Date().getFullYear();
  return (
    <>
      <section className="mb-[100vh]"></section>
      <footer className="fixed w-full bg-gradient-to-r from-transparent via-secondary to-transparent bottom-0 -z-10 flex flex-col items-center justify-between h-screen px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <a href="#" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">FalcoTech</span>
          </a>
          <nav className="flex space-x-6">
            <a
              href="https://www.instagram.com/falcotechsl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://wa.me/+34694236492"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <WhatsApp className="w-6 h-6" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </nav>
        </div>
        <div className="w-full border-t py-4 text-xs text-muted-foreground">
          <h3>
            &copy;{year} FalcoTech. {translation("footer.copyright")}
          </h3>
        </div>
      </footer>
    </>
  );
};

export default Footer;
