"use client";
import { useSearch } from "@/hooks";
import { CommandDemo } from "./CommandDemo";

const Search = () => {
  const {
    searchResult,
    selectedCategory,
    loading,
    handleCategorySelect,
    onQueryChanged,
  } = useSearch();

  return (
    <CommandDemo
      searchResult={searchResult}
      selectedCategory={selectedCategory}
      loading={loading}
      handleCategorySelect={handleCategorySelect}
      onQueryChanged={onQueryChanged}
    />
  );
};

export default Search;