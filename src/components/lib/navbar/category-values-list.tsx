import { SearchInputResult } from "@/interfaces";
import { truncateText } from "@/utils";
import Link from "next/link";

interface Props {
  selectedCategory: string;
  searchResult: SearchInputResult[];
}

export function CategoryValuesList({ selectedCategory, searchResult }: Props) {
  const categoryToRedirect: string = 
  selectedCategory === "Transactions" 
    ? "tx" 
    : selectedCategory === "Blocks" 
      ? "block" 
      : "address";

  return (
    <div className="custom-scroll flex max-h-64 flex-col items-center justify-start overflow-y-auto px-4">
      <span className="mb-1 self-start text-base opacity-[0.6]">
        {selectedCategory}
      </span>
      {searchResult
        .find((result) => result.category === selectedCategory)
        ?.values.map((value, index) => (
          <Link
            key={index}
            className="self-start rounded-md bg-transparent p-2 text-sm opacity-[0.6] transition-all duration-200 hover:cursor-pointer hover:bg-[#313131c5] hover:text-white"
            href={`/${categoryToRedirect}/${value}`}
          >
            {truncateText(value, 16)}
          </Link>
        ))}
    </div>
  );
}
