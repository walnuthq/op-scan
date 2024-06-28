import { useEffect, useRef } from "react";
import { SearchInputResult } from "@/interfaces";
import { CategoryListDropdown } from "./category-list-dropdown";
import { CategoryValuesList } from "./category-values-list";

interface Props {
  showResult: boolean;
  selectedCategory: string;
  searchResult: SearchInputResult[];
  handleCategorySelect: (category: string) => void;
  handleShowResult: (value: boolean) => void;
}

export function SearchResultDropDown({
  showResult,
  selectedCategory,
  searchResult,
  handleCategorySelect,
  handleShowResult,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensures that the menu is hidden if the user clicks on any part of the screen
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleShowResult(false);
      }
    };

    if (showResult) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResult, handleShowResult]);

  return (
    <>
      {showResult && (
        <div
          ref={dropdownRef}
          className={`card absolute left-0 right-0 top-full z-10 overflow-x-auto border border-input bg-[#fcfcfcb6] py-3 md:w-[360px] lg:w-[480px] dark:bg-[#0c0a09c5]`}
        >
          {searchResult.length !== 0 ? (
            <div>
              <CategoryListDropdown
                searchResult={searchResult}
                selectedCategory={selectedCategory}
                handleCategorySelect={handleCategorySelect}
              />
              <CategoryValuesList
                searchResult={searchResult}
                selectedCategory={selectedCategory}
              />
            </div>
          ) : (
            <div className="w-full items-center justify-start p-4 text-base opacity-[0.6]">
              <p>No results found</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
