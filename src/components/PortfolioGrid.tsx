import image1 from "../assets/p-1.webp";
import image2 from "../assets/p-2.webp";
import image3 from "../assets/p-3.webp";
import image4 from "../assets/p-4.webp";
import image5 from "../assets/p-5.webp";
import image6 from "../assets/p-7.webp";
import { LayoutGrid } from "./ui/layout-grid";

export default function PortfolioGrid() {
  return (
    <div className="h-screen py-20 w-full shadow-lg">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <>
      <p className="font-bold md:text-4xl text-xl text-foreground">{title}</p>
      <p className="font-normal text-base text-foreground"></p>
      <p className="font-normal text-base my-4 max-w-lg text-foreground">
        {description}
      </p>
    </>
  );
};

const SkeletonOne = () => (
  <SkeletonCard
    title="House in the woods"
    description="A serene and tranquil retreat, this house in the woods offers a peaceful escape from the hustle and bustle of city life."
  />
);

const SkeletonTwo = () => (
  <SkeletonCard
    title="House above the clouds"
    description="Perched high above the world, this house offers breathtaking views and a unique living experience. It's a place where the sky meets home, and tranquility is a way of life."
  />
);

const SkeletonThree = () => (
  <SkeletonCard
    title="Greens all over"
    description="A house surrounded by greenery and nature's beauty. It's the perfect place to relax, unwind, and enjoy life."
  />
);

const SkeletonFour = () => (
  <SkeletonCard
    title="Rivers are serene"
    description="A house by the river is a place of peace and tranquility. It's the perfect place to relax, unwind, and enjoy life."
  />
);

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-1",
    thumbnail: image1.src,
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: image2.src,
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: image3.src,
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-1",
    thumbnail: image4.src,
  },
  {
    id: 5,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: image5.src,
  },
  {
    id: 6,
    content: <SkeletonFour />,
    className: "md:col-span-1",
    thumbnail: image6.src,
  },
];
