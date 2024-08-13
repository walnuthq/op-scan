"use client";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { SearchInputResult } from "@/interfaces";
import { useState, useCallback } from "react";
import { CornerDownLeft } from "lucide-react";
import Item from "./item";

type CommandDemoProps = {
  searchResult: SearchInputResult[];
  selectedCategory: string;
  loading: boolean;
  handleCategorySelect: (category: string) => void;
  onQueryChanged?: ((search: string) => void) | undefined;
};
export function CommandDemo({
  searchResult,
  selectedCategory,
  loading,
  handleCategorySelect,
  onQueryChanged,
}: CommandDemoProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  // Handle opening the list
  const handleFocus = useCallback(() => setOpen(true), []);
  // Handle closing the list
  const handleBlur = useCallback(
    () => setTimeout(() => setOpen(false), 100),
    [],
  );
  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchText(value);
    if (onQueryChanged) {
      onQueryChanged(value);
    }
  };
  return (
    <div className="fixed mr-28 w-5/12 sm:w-3/5 md:w-3/6 lg:w-1/3">
      <Command className="w-full rounded-lg border shadow-md">
        <div className="relative">
          <CommandInput
            placeholder="Search by Address / Txn Hash / Block / Token"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onValueChange={handleInputChange}
            value={searchText}
            disabled={loading}
          />
        </div>
        {open && (
          <>
            <CommandList>
              {searchResult.map((result, index) => (
                <>
                  <CommandGroup key={index} heading={result.category}>
                    {searchResult
                      .find(
                        (resultValue) =>
                          resultValue.category === selectedCategory,
                      )
                      ?.values.map((value, index) => (
                        <Item
                          key={index}
                          selectedCategory={selectedCategory}
                          setOpen={setOpen}
                          value={value}
                        />
                      ))}
                  </CommandGroup>
                  <div className="mx-3 mt-2 flex items-center justify-end border-t border-white border-opacity-20 text-sm opacity-40">
                    <CornerDownLeft className="my-3 p-1" />
                    Enter
                  </div>
                </>
              ))}
            </CommandList>
          </>
        )}
      </Command>
    </div>
  );
}
