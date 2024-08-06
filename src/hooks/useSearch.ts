import { useRef, useState, useEffect, ChangeEvent } from "react";
import { isAddress } from "viem";
import { l2PublicClient } from "@/lib/chains";
import { SearchInputResult } from "@/interfaces";

export function useSearch() {
  const debounceRef = useRef<NodeJS.Timeout>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchResult, setSearchResult] = useState<SearchInputResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const selectedDefaultCategory =
      searchResult.length !== 0 ? searchResult[0].category : "";
    setSelectedCategory(selectedDefaultCategory);
  }, [searchResult]);

  const onQueryChanged = (searchValue: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const searchInputValue = searchValue.trim();

      setSearchResult([]);
      if (searchInputValue) {
        setLoading(true);
        try {
          let updatedSearchResult = [...searchResult];
          updatedSearchResult = await handleBlockSearch(
            updatedSearchResult,
            searchInputValue,
          );
          updatedSearchResult = await handleTransactionSearch(
            updatedSearchResult,
            searchInputValue,
          );
          updatedSearchResult = await handleAddressSearch(
            updatedSearchResult,
            searchInputValue,
          );
          setSearchResult(updatedSearchResult);
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      }
    }, 500);
  };

  const handleBlockSearch = async (
    results: SearchInputResult[],
    searchValue: string,
  ) => {
    if (!isNumeric(searchValue)) return results;

    const blockNumber = BigInt(parseInt(searchValue, 10));
    const blockData = await l2PublicClient.getBlock({ blockNumber });
    if (blockData) {
      setSelectedCategory("Blocks");
      return updateSearchResult(results, "Blocks", searchValue);
    }

    return results;
  };

  const handleTransactionSearch = async (
    results: SearchInputResult[],
    searchValue: string,
  ) => {
    if (!isValidHash(searchValue)) return results;

    const transactionData = await l2PublicClient.getTransaction({
      hash: searchValue as `0x${string}`,
    });
    if (transactionData) {
      setSelectedCategory("Transactions");
      return updateSearchResult(results, "Transactions", searchValue);
    }

    return results;
  };

  const handleAddressSearch = async (
    results: SearchInputResult[],
    searchValue: string,
  ) => {
    if (!isAddress(searchValue)) return results;
    // const code = await l2PublicClient.getCode({ address: searchValue }); 👈 obtain additional address data if needed
    setSelectedCategory("Addresses");
    return updateSearchResult(results, "Addresses", searchValue);
  };

  const updateSearchResult = (
    results: SearchInputResult[],
    category: string,
    value: string,
  ): SearchInputResult[] => {
    const index = results.findIndex((item) => item.category === category);
    if (index !== -1) {
      results[index].values.push(value);
    } else {
      results.push({ category, values: [value] });
    }
    return results;
  };

  const isNumeric = (str: string): boolean => /^\d+$/.test(str);
  const isValidHash = (str: string): boolean =>
    /^0x([A-Fa-f0-9]{64})$/.test(str);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return {
    // Variables
    selectedCategory,
    searchResult,
    loading,

    // Functions
    handleCategorySelect,
    onQueryChanged,
  };
}