import { motion, useTransform, useScroll } from "motion/react";
import { useRef } from "react";
import image1 from "@/assets/p-12.webp";
import image2 from "@/assets/p-2.webp";
import image3 from "@/assets/p-7.webp";
import image4 from "@/assets/p-8.webp";
import image5 from "@/assets/p-5.webp";
import image6 from "@/assets/p-6.webp";

const Carousel = () => {
  return (
    <>
      <HorizontalScrollCarousel />
    </>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden rounded"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      {/* <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
          {card.title}
        </p>
      </div> */}
    </div>
  );
};

export default Carousel;

const cards = [
  {
    url: image1,
    title: "Title 7",
    id: 7,
  },
  {
    url: image2,
    title: "Title 2",
    id: 2,
  },
  {
    url: image3,
    title: "Title 3",
    id: 3,
  },
  {
    url: image4,
    title: "Title 6",
    id: 6,
  },
  {
    url: image5,
    title: "Title 5",
    id: 5,
  },

  {
    url: image6,
    title: "Title 6",
    id: 6,
  },
];
