import image1 from "@/assets/p-1.webp";
import image2 from "@/assets/p-10.webp";
import image5 from "@/assets/p-11.webp";
import image3 from "@/assets/p-6.webp";
import image4 from "@/assets/p-8.webp";
import { BlurInParagraph, BlurInTitle } from "@/components/magicui/blur-in";
import { ImagesSlider } from "@/components/ui/images-slider";
import type { TFunction } from "i18next";
import { motion } from "motion/react";

interface HeroProps {
  title: string;
  description: string;
}

const heroObj: HeroProps = {
  title: "home.title",
  description: "home.description",
};

export default function Hero({
  translation,
}: {
  translation: TFunction<"translation", undefined>;
}) {
  const images = [image1.src, image2.src, image3.src, image4.src, image5.src];
  return (
    <section id="hero">
      <ImagesSlider className="h-screen" images={images}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 w-full h-full flex flex-col justify-end items-end p-2 md:p-12"
        >
          <div className="mt-5 max-w-2xl">
            <BlurInTitle
              duration={0.2}
              word={translation(heroObj.title)}
              className="text-4xl font-bold "
            />
          </div>
          {/* End Title */}

          <div className="mt-5 max-w-3xl">
            <BlurInParagraph
              duration={0.4}
              word={translation(heroObj.description)}
            />
          </div>
        </motion.div>
      </ImagesSlider>
    </section>
  );
}
