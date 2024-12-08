import {
  Card as BaseCard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image1 from "@/assets/1.png";
import image2 from "@/assets/2.png";
import image3 from "@/assets/3.png";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

const MotionCard = motion(BaseCard);

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "Control de Fauna:",
    description: `Nos dedicamos a la gestión responsable y ética de la fauna, implementando estrategias para minimizar los conflictos entre los seres humanos y la vida silvestre. Utilizamos tecnologías avanzadas, incluidos drones, para monitorear y gestionar poblaciones de animales, asegurando la coexistencia armónica y la conservación de las especies.`,
    image: image3.src,
  },
  {
    title: "Consultora Ambiental:",
    description: `Ofrecemos asesoramiento integral en cuestiones ambientales, ayudando a empresas y gobiernos a desarrollar proyectos sostenibles y respetuosos con el medio ambiente. Nuestro enfoque se basa en el análisis detallado y el uso de tecnología innovadora para ofrecer soluciones que promuevan el desarrollo económico sin comprometer la salud del planeta.`,
    image: image2.src,
  },
  {
    title: "Tecnología con Drones:",
    description: `Nuestra división de tecnología se especializa en el uso de drones para una amplia gama de aplicaciones, desde la monitorización ambiental hasta la recopilación de datos precisos y en tiempo real. Los drones nos permiten obtener una visión única y detallada del entorno, facilitando la toma de decisiones informadas y efectivas en nuestros proyectos.`,
    image: image1.src,
  },
];

const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2, // Ajusta el retraso según tus necesidades
      duration: 0.6, // Duración de la animación
      type: "spring", // Tipo de animación
      stiffness: 100, // Rigidez del resorte
      damping: 20, // Amortiguación para suavizar el rebote
    },
  }),
};

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true, // La animación solo se dispara una vez
    threshold: 0.1, // Ajusta este valor según sea necesario
  });
  return (
    <section id="about" className="container py-24 sm:py-32 space-y-8">
      <h4 className="text-xl lg:text-2xl font-bold md:text-center">
        Nuestro equipo está organizado en tres grupos de trabajo especializados:
      </h4>

      <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps, index) => (
          <MotionCard
            key={title}
            custom={index}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </MotionCard>
        ))}
      </div>
      <h5 className="text-lg lg:text-xl font-bold md:text-center">
        En FALCOTECH, creemos que la integración de la tecnología con el
        conocimiento ambiental es clave para resolver los desafíos más urgentes
        de nuestro tiempo. Estamos comprometidos con la innovación, la
        excelencia y la sostenibilidad. Trabajamos para crear un futuro en el
        que la humanidad y la naturaleza puedan prosperar juntas.
      </h5>
      <h6 className="text-lg lg:text-xl font-bold md:text-center">
        Les invitamos a explorar más sobre nuestros servicios.
      </h6>
    </section>
  );
}
