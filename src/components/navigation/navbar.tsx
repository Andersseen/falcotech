import logoBlack from "@/assets/logo-black.svg";
import logoWhite from "@/assets/logo-white.svg";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { TFunction } from "i18next";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Navbar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const NavItems = ({
    translation,
  }: {
    translation: TFunction<"translation", undefined>;
  }) => (
    <>
      {["about", "features", "contact"].map((item, index) => (
        <Button
          key={`${item}${index}`}
          variant="ghost"
          onClick={() => scrollToSection(item)}
        >
          {translation(`nav.${item}`)}
        </Button>
      ))}
    </>
  );

  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="font-bold text-xl"
          onClick={() => scrollToSection("hero")}
        >
          <img
            src={logoWhite.src}
            alt="logo"
            className="w-0 dark:w-[80px] mx-auto cursor-pointer"
          />
          <img
            src={logoBlack.src}
            alt="logo"
            className="w-[80px] dark:w-0 mx-auto cursor-pointer"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavItems translation={t} />
          {children}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          {children}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <NavItems translation={t} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
