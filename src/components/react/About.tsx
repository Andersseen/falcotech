import { motion } from "motion/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import image1 from "@/assets/4.webp";
import image2 from "@/assets/p-3.webp";
import image3 from "@/assets/p-4.webp";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
interface AboutSection {
  title: string;
  description: string[];
  accordion: boolean;
  imgSrc: string;
  imgRight?: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: () => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6, // Duración de la animación
      type: "spring", // Tipo de animación
      stiffness: 100, // Rigidez del resorte
      damping: 20, // Amortiguación para suavizar el rebote
    },
  }),
};

export default function About() {
  const [ref1, inView1] = useInView({ threshold: 0.1 });
  const [ref2, inView2] = useInView({ threshold: 0.1 });
  const [ref3, inView3] = useInView({ threshold: 0.1 });

  const { t } = useTranslation();

  const sections = [
    {
      title: t("about.section1.title"),
      description: [
        t("about.section1.description.p1"),
        t("about.section1.description.p2"),
        t("about.section1.description.p3"),
      ],
      accordion: true,
      imgSrc: image2.src,
    },
    {
      title: t("about.section2.title"),
      description: [
        t("about.section2.description.p1"),
        t("about.section2.description.p2"),
      ],
      accordion: false,
      imgSrc: image3.src,
      imgRight: true,
    },
    {
      title: t("about.section3.title"),
      description: [t("about.section3.description")],
      accordion: false,
      imgSrc: image1.src,
    },
  ];

  return (
    <section id="features">
      <motion.section
        ref={ref1}
        initial="hidden"
        animate={inView1 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <SectionContent section={sections[0]} />
      </motion.section>

      <motion.section
        ref={ref2}
        initial="hidden"
        animate={inView2 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <SectionContent section={sections[1]} />
      </motion.section>
      <motion.section
        ref={ref3}
        initial="hidden"
        animate={inView3 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <SectionContent section={sections[2]} />
      </motion.section>
    </section>
  );
}
const SectionContent = ({ section }: { section: AboutSection }) => {
  return (
    <div
      className={`container flex flex-col items-center gap-8 px-4 md:px-6 lg:gap-16 ${
        section.imgRight ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <img
        src={section.imgSrc}
        width="650"
        height="450"
        alt="Collaboration"
        className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover"
      />
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {section.title}
        </h2>

        {section.description.map((description, index) => (
          <p
            key={`about-card${index}`}
            className="max-w-[600px] text-muted-foreground md:text-md/relaxed lg:text-base/relaxed xl:text-md/relaxed"
          >
            {description}
          </p>
        ))}
        {section.accordion && (
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Aeropuertos:</AccordionTrigger>
              <AccordionContent>
                Gestionamos la fauna para minimizar los riesgos de colisiones
                con aeronaves, garantizando la seguridad en las operaciones
                aeroportuarias.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Zonas Urbanas:</AccordionTrigger>
              <AccordionContent>
                Desarrollamos soluciones que facilitan la convivencia entre la
                fauna y la población en áreas urbanas, manteniendo el bienestar
                de ambos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Cultivo:</AccordionTrigger>
              <AccordionContent>
                Implementamos estrategias de control de fauna que preservan la
                integridad y productividad de las áreas agrícolas, evitando
                daños a los cultivos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Vertederos:</AccordionTrigger>
              <AccordionContent>
                Controlamos la fauna en vertederos para evitar problemas de
                salud pública y daños ambientales, asegurando una gestión
                eficiente de los residuos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Acuicultura:</AccordionTrigger>
              <AccordionContent>
                Protegemos las instalaciones acuícolas de depredadores y otras
                amenazas, asegurando un entorno seguro y productivo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};
