import { useTranslation } from "react-i18next";
import image1 from "../assets/p-1.webp";
import image10 from "../assets/p-10.webp";
import image11 from "../assets/p-11.webp";
import image12 from "../assets/p-12.webp";
import image2 from "../assets/p-2.webp";
import image3 from "../assets/p-3.webp";
import image4 from "../assets/p-4.webp";
import image5 from "../assets/p-5.webp";
import image6 from "../assets/p-6.webp";
import image7 from "../assets/p-7.webp";
import image8 from "../assets/p-8.webp";
import { LayoutGrid } from "./ui/layout-grid";

export default function PortfolioGrid() {
  return (
    <div className="h-screen py-20 w-full shadow-sm">
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
  const { t } = useTranslation();
  return (
    <>
      <p className="font-bold md:text-4xl text-xl text-foreground">
        {t(`portfolio.${title}`)}
      </p>
      <p className="font-normal text-base text-foreground"></p>
      <p className="font-normal text-base my-4 max-w-lg text-foreground">
        {t(`portfolio.${description}`)}
      </p>
    </>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonCard title="title" description="description" />,
    className: "md:col-span-1",
    thumbnail: image1.src,
  },
  {
    id: 2,
    content: <SkeletonCard title="title" description="description" />,
    className: "col-span-1",
    thumbnail: image2.src,
  },
  {
    id: 3,
    content: <SkeletonCard title="title" description="description" />,
    className: "col-span-1",
    thumbnail: image3.src,
  },
  {
    id: 4,
    content: <SkeletonCard title="title" description="description" />,
    className: "md:col-span-1",
    thumbnail: image4.src,
  },
  {
    id: 5,
    content: <SkeletonCard title="title" description="description" />,
    className: "col-span-1",
    thumbnail: image5.src,
  },
  {
    id: 6,
    content: <SkeletonCard title="title" description="description" />,
    className: "md:col-span-1",
    thumbnail: image6.src,
  },
  {
    id: 7,
    content: <SkeletonCard title="title" description="description" />,
    className: "md:col-span-1",
    thumbnail: image7.src,
  },
  {
    id: 8,
    content: <SkeletonCard title="title" description="description" />,
    className: "col-span-1",
    thumbnail: image8.src,
  },
  {
    id: 9,
    content: <SkeletonCard title="title" description="description" />,
    className: "col-span-1",
    thumbnail: image1.src,
  },
  {
    id: 10,
    content: <SkeletonCard title="title" description="description" />,
    className: "md:col-span-1",
    thumbnail: image10.src,
  },
  {
    id: 11,
    content: <SkeletonCard title="title" description="description" />,
    className: "col-span-1",
    thumbnail: image11.src,
  },
  {
    id: 12,
    content: <SkeletonCard title="title" description="description" />,
    className: "col-span-1",
    thumbnail: image12.src,
  },
];
