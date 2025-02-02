import image1 from "@/assets/1.png";
import image2 from "@/assets/2.png";
import image3 from "@/assets/3.png";
import {
  Card as BaseCard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TFunction } from "i18next";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

const MotionCard = motion.create(BaseCard);

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "features.card1.title",
    description: "features.card1.description",
    image: image3.src,
  },
  {
    title: "features.card1.title",
    description: "features.card1.description",
    image: image2.src,
  },
  {
    title: "features.card3.title",
    description: "features.card3.description",
    image: image1.src,
  },
];

const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number) => ({
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

export default function Features({
  translation,
}: {
  translation: TFunction<"translation", undefined>;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true, // La animación solo se dispara una vez
    threshold: 0.1, // Ajusta este valor según sea necesario
  });

  return (
    <section id="about" className="container py-24 sm:py-32 space-y-8">
      <h4 className="text-xl lg:text-2xl font-bold md:text-center">
        {translation(`features.title1`)}
      </h4>

      <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps, index) => (
          <MotionCard
            key={`features-card${index}`}
            custom={index}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <CardHeader>
              <CardTitle>{translation(title)}</CardTitle>
            </CardHeader>

            <CardContent>{translation(description)}</CardContent>

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
        {translation(`features.title2`)}
      </h5>
      <h6 className="text-lg lg:text-xl font-bold md:text-center">
        {translation(`features.title3`)}
      </h6>
    </section>
  );
}
