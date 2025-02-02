import i18n from "@/i18n/i18n.config";
import { LANGUAGES } from "@/i18n/utils";
import { useEffect, useState } from "react";
import { LanguageFlag, type FlagSVG } from "./flags";
const savedLang = localStorage.getItem("preferred-lang");
export const LanguageSelector = () => {
  const [currectLang, setCurrentLang] = useState(
    LANGUAGES.find((lang) => lang.code === savedLang) || LANGUAGES[0]
  );

  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-lang");
    if (savedLang && LANGUAGES.some((lang) => lang.code === savedLang)) {
      void i18n.changeLanguage(savedLang);
      setCurrentLang(
        LANGUAGES.find((lang) => lang.code === savedLang) || currectLang
      );
    }
  }, []);

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
    localStorage.setItem("preferred-lang", lng);
    const newLang = LANGUAGES.find((lang) => lang.code === lng);
    setCurrentLang(newLang || currectLang);
  };
  const otherLocales = LANGUAGES.filter(
    (lang) => lang.code !== currectLang.code
  );
  return (
    <div className="relative inline-block text-left w-[95px]">
      <div className="group text-white rounded-md text-xs font-semibold bg-black/30 hover:bg-black/70 transition-all">
        <button
          type="button"
          className="inline-flex justify-start items-center w-full gap-x-2 px-3 py-2"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <LanguageFlag code={currectLang.code as FlagSVG} />
          {currectLang.name}
        </button>
        <ul className="group-hover:block group-hover:animate-fade-down group-hover:animate-duration-200 hidden pt-0.5 absolute w-full">
          {otherLocales.map((locale, index) => (
            <li className="py-[2px]" key={`${locale.name}${index}`}>
              <button
                onClick={() => changeLanguage(locale.code)}
                className="rounded-md bg-black/30 hover:bg-black/70 whitespace-no-wrap inline-flex justify-start items-center w-full gap-x-2 px-3 py-2"
              >
                <LanguageFlag code={locale.code as FlagSVG} />
                {locale.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
