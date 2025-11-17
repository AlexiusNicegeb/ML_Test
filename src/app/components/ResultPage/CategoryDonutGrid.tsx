import { CategoryDonut } from "./CategoryDonut";

interface CategoryGridProps {
  categories: { title: string; score: number }[];
}

export const CategoryDonutGrid = ({ categories }: CategoryGridProps) => {
  
  return (
    <div className="flex md:flex-wrap gap-4 w-full  mt-6 overflow-x-auto md:overflow-visible">
      {categories.map((cat, idx) => (
        <CategoryDonut key={idx} title={cat.title} score={cat.score} />
      ))}
    </div>
  );
};
