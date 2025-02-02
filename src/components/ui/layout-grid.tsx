import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerRow = 3;
  const rows = 2;

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  const handleNext = () => {
    if (startIndex + itemsPerRow * rows < cards.length) {
      setStartIndex(startIndex + itemsPerRow);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerRow >= 0) {
      setStartIndex(startIndex - itemsPerRow);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-between relative md:px-8">
      <motion.button
        onClick={handlePrev}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="bg-foreground p-3 rounded-full shadow-lg">
          <ChevronLeft className="text-background w-6 h-6" />
        </div>
      </motion.button>

      <div className="w-full h-full md:p-5 lg:p-10 grid grid-cols-1 md:grid-cols-3 mx-auto gap-4">
        {cards
          .slice(startIndex, startIndex + itemsPerRow * rows)
          .map((card, i) => (
            <div key={card.id}>
              <motion.div
                onClick={() => handleClick(card)}
                className={cn(
                  card.className,
                  "relative overflow-hidden cursor-pointer",
                  selected?.id === card.id
                    ? "rounded-lg absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-10 flex justify-center items-center flex-wrap flex-col"
                    : "bg-white rounded-xl h-full w-full"
                )}
                layoutId={`card-${card.id}`}
              >
                {selected?.id === card.id && (
                  <SelectedCard selected={selected} />
                )}
                <ImageComponent card={card} />
              </motion.div>
            </div>
          ))}
      </div>

      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="bg-foreground p-3 rounded-full shadow-lg">
          <ChevronRight className="text-background w-6 h-6" />
        </div>
      </motion.button>

      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-10",
          selected?.id ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail as string}
      height="500"
      width="500"
      className="object-cover object-top absolute inset-0 h-full w-full transition duration-200"
      alt="thumbnail"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
