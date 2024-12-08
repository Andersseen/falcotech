import { motion } from "motion/react";
import { ImagesSlider } from "@/components/ui/images-slider";
import { BlurInTitle, BlurInParagraph } from "@/components/magicui/blur-in";
import image1 from "@/assets/p-1.webp";
import image2 from "@/assets/p-10.webp";
import image3 from "@/assets/p-6.webp";
import image4 from "@/assets/p-8.webp";
import image5 from "@/assets/p-11.webp";

export default function Hero() {
  const images = [image1.src, image2.src, image3.src, image4.src, image5.src];
  return (
    <section id="hero">
      <ImagesSlider className="h-[95vh]" images={images}>
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
              word="FALCOTECH"
              className="text-4xl font-bold "
            />
          </div>
          {/* End Title */}

          <div className="mt-5 max-w-3xl">
            <BlurInParagraph
              duration={0.4}
              word="Implementamos soluciones innovadoras para abordar los
           desafíos contemporáneos que afectan tanto a la sociedad como a la
           fauna. Nuestra misión es utilizar tecnología de vanguardia para
           encontrar respuestas efectivas y sostenibles a los conflictos que
           surgen en estos ámbitos, combinando experiencia, compromiso y un
           profundo respeto por el entorno natural."
            />
          </div>
        </motion.div>
      </ImagesSlider>
    </section>
  );
}
