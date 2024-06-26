import { SearchInputResult } from "@/interfaces";

interface Props {
  selectedCategory: string;
  searchResult: SearchInputResult[];
  handleCategorySelect: (category: string) => void;
}

export function CategoryListDropdown({
  selectedCategory,
  searchResult,
  handleCategorySelect,
}: Props) {
  return (
    <ul className="mb-4 flex overflow-x-auto border-b">
      {searchResult.map(({ category }) => (
        <li
          key={category}
          className={`cursor-pointer border-b-2 px-4 py-2 transition-all duration-200 ${selectedCategory === category ? "border-[#C71C41] text-[#C71C41]" : "border-transparent"}`}
          onClick={() => handleCategorySelect(category)}
        >
          {category}
        </li>
      ))}
    </ul>
  );
}
