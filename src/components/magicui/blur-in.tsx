import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BlurIntProps {
  word: string;
  className?: string;
  variant?: {
    hidden: { filter: string; opacity: number };
    visible: { filter: string; opacity: number };
  };
  duration?: number;
}
const BlurInTitle = ({
  word,
  className,
  variant,
  duration = 1,
}: BlurIntProps) => {
  const defaultVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      transition={{ duration }}
      variants={combinedVariants}
      className={cn(
        className,
        "font-display text-center text-2xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-5xl md:leading-[3rem]"
      )}
    >
      {word}
    </motion.h1>
  );
};
const BlurInParagraph = ({
  word,
  className,
  variant,
  duration = 1,
}: BlurIntProps) => {
  const defaultVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <motion.p
      initial="hidden"
      animate="visible"
      transition={{ duration }}
      variants={combinedVariants}
      className={cn(
        className,
        "font-display text-left text-lg tracking-[-0.02em] drop-shadow-sm text-md md:text-xl"
      )}
    >
      {word}
    </motion.p>
  );
};

export { BlurInTitle, BlurInParagraph };
