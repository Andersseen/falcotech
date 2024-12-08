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

  return (
    <section id="features">
      <motion.section
        ref={ref1}
        initial="hidden"
        animate={inView1 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <SectionContent1 />
      </motion.section>

      <motion.section
        ref={ref2}
        initial="hidden"
        animate={inView2 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <SectionContent2 />
      </motion.section>
      <motion.section
        ref={ref3}
        initial="hidden"
        animate={inView3 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <SectionContent3 />
      </motion.section>
    </section>
  );
}
const SectionContent1 = () => {
  return (
    <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
      <img
        src={image2.src}
        width="650"
        height="450"
        alt="Collaboration"
        className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover"
      />
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Control fauna
        </h2>
        <p className="max-w-[600px] text-muted-foreground md:text-md/relaxed lg:text-base/relaxed xl:text-md/relaxed">
          En FALCOTECH, contamos con un equipo altamente profesional compuesto
          por técnicos y expertos en control y manejo de fauna, incluyendo
          especialistas en cetrería. Nuestro equipo combina conocimientos
          profundos en técnicas tradicionales y modernas, lo que nos permite
          abordar diversas situaciones con una perspectiva integral y adaptada a
          cada caso.
        </p>
        <p className="max-w-[600px] text-muted-foreground md:text-md/relaxed lg:text-base/relaxed xl:text-md/relaxed">
          Nuestro compromiso es ofrecer servicios de la más alta calidad,
          garantizando resultados óptimos y sostenibles para la convivencia
          entre la actividad humana y la conservación de la biodiversidad.
        </p>
        <p className="max-w-[600px] text-muted-foreground md:text-md/relaxed lg:text-base/relaxed xl:text-md/relaxed">
          Para desarrollar nuestro servicio de control de fauna, utilizamos
          cetrería, aprovechando la habilidad de aves rapaces entrenadas para
          gestionar poblaciones de fauna de manera natural. Complementamos esta
          técnica con el uso de drones adaptados, que nos permiten monitorizar y
          controlar áreas extensas con precisión y eficacia. Además,
          implementamos sistemas de captura diseñados para ser respetuosos con
          las especies, asegurando su bienestar y minimizando el impacto en su
          entorno natural.
        </p>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Aeropuertos:</AccordionTrigger>
            <AccordionContent>
              Gestionamos la fauna para minimizar los riesgos de colisiones con
              aeronaves, garantizando la seguridad en las operaciones
              aeroportuarias.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Zonas Urbanas:</AccordionTrigger>
            <AccordionContent>
              Desarrollamos soluciones que facilitan la convivencia entre la
              fauna y la población en áreas urbanas, manteniendo el bienestar de
              ambos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Cultivo:</AccordionTrigger>
            <AccordionContent>
              Implementamos estrategias de control de fauna que preservan la
              integridad y productividad de las áreas agrícolas, evitando daños
              a los cultivos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Vertederos:</AccordionTrigger>
            <AccordionContent>
              Controlamos la fauna en vertederos para evitar problemas de salud
              pública y daños ambientales, asegurando una gestión eficiente de
              los residuos.
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
      </div>
    </div>
  );
};
const SectionContent2 = () => {
  return (
    <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-4 order-2 lg:order-1">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Consultora ambiental
        </h2>
        <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
          Nuestro equipo está compuesto por técnicos y biólogos con amplia
          experiencia en el seguimiento y estudio de fauna, estudios de
          Biodiversidad, Evaluación de Impacto Ambiental y análisis estadístico
          y geoespacial lo que les permite abordar diversas situaciones con
          solvencia y un enfoque especializado.
        </p>
        <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
          Los esfuerzos diarios para prestar un servicio de alto nivel, hace que
          nuestro equipo técnico domine los programas informáticos más avanzados
          para la planificación y diseño de las metodologías de estudio y el
          procesamiento de datos que permita sacar el máximo partido a los
          trabajos realizados en campo como prospecciones botánicas, estudios de
          avifauna, quirópteros y herpetofauna, entre otros.
        </p>
      </div>
      <img
        src={image3.src}
        width="650"
        height="450"
        alt="Workflow"
        className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover order-1 lg:order-2"
      />
    </div>
  );
};
const SectionContent3 = () => {
  return (
    <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
      <img
        src={image1.src}
        width="650"
        height="450"
        alt="Innovation"
        className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover"
      />
      <div className="space-y-4 mb-10">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Drones
        </h2>
        <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
          Nuestra empresa integra tecnología UAV (Unmanned Aerial Vehicle) para
          optimizar nuestros servicios, proporcionando soluciones avanzadas y
          precisas. Ofrecemos una gama de servicios con drones, incluyendo
          grabaciones de alta calidad y detalladas inspecciones de
          infraestructuras y terrenos. Además, desarrollamos drones
          especializados, personalizados para realizar trabajos específicos
          según las necesidades del proyecto.
        </p>
      </div>
    </div>
  );
};
