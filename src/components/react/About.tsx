import image1 from "@/assets/4.webp";
import image2 from "@/assets/p-3.webp";
import image3 from "@/assets/p-4.webp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { TFunction } from "i18next";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
interface AboutSection {
  title: string;
  description: string[];
  accordion: AccordionContent[] | null;
  imgSrc: string;
  imgRight?: boolean;
}

interface AccordionContent {
  trigger: string;
  content: string;
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

export default function About({
  translation,
}: {
  translation: TFunction<"translation", undefined>;
}) {
  const [ref1, inView1] = useInView({ threshold: 0.1 });
  const [ref2, inView2] = useInView({ threshold: 0.1 });
  const [ref3, inView3] = useInView({ threshold: 0.1 });

  const sections = [
    {
      title: translation("about.section1.title"),
      description: [
        translation("about.section1.description.p1"),
        translation("about.section1.description.p2"),
        translation("about.section1.description.p3"),
      ],
      accordion: [
        {
          trigger: translation("about.accordion.items.item1.trigger"),
          content: translation("about.accordion.items.item1.content"),
        },
        {
          trigger: translation("about.accordion.items.item2.trigger"),
          content: translation("about.accordion.items.item2.content"),
        },
        {
          trigger: translation("about.accordion.items.item3.trigger"),
          content: translation("about.accordion.items.item4.content"),
        },
        {
          trigger: translation("about.accordion.items.item4.trigger"),
          content: translation("about.accordion.items.item4.content"),
        },
        {
          trigger: translation("about.accordion.items.item5.trigger"),
          content: translation("about.accordion.items.item5.content"),
        },
      ],
      imgSrc: image2.src,
    },
    {
      title: translation("about.section2.title"),
      description: [
        translation("about.section2.description.p1"),
        translation("about.section2.description.p2"),
      ],
      accordion: null,
      imgSrc: image3.src,
      imgRight: true,
    },
    {
      title: translation("about.section3.title"),
      description: [translation("about.section3.description")],
      accordion: null,
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
        className="w-full lg:w-1/2 mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover"
      />
      <div className="w-full lg:w-1/2 ">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {section.title}
        </h2>

        {section.description.map((description, index) => (
          <p
            key={`about-card${index}`}
            className="text-muted-foreground md:text-md/relaxed lg:text-base/relaxed xl:text-md/relaxed"
          >
            {description}
          </p>
        ))}
        {section.accordion?.length && (
          <Accordion type="multiple" className="w-full">
            {section.accordion.map(({ trigger, content }, index) => (
              <AccordionItem value={`item-${index + 1}`}>
                <AccordionTrigger>{trigger}</AccordionTrigger>
                <AccordionContent>{content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
