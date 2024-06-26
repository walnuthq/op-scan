"use client";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks";
import { SearchResultDropDown } from "./search-result-dropdown";

const Search = () => {
  const { 
    searchResult, showResult, selectedCategory, handleCategorySelect, onQueryChanged, handleShowResult } = useSearch()

  return (
    <form className="ml-auto flex-1 relative sm:flex-initial">
      <div className="relative">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            onChange={onQueryChanged}
            placeholder="Search by Address / Txn Hash / Block / Token"
            className="pl-8 w-full sm:w-[400px] md:w-[360px] lg:w-[480px]"
          />
        </div>
        <SearchResultDropDown
          showResult={showResult} 
          searchResult={searchResult}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
          handleShowResult={handleShowResult}
        /> 
      </div>
    </form>
  );
};

export default Search;
