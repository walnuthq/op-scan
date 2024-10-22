"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Address, isAddress, getAddress, Hash } from "viem";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  searchBlock,
  searchAddress,
  searchTransaction,
} from "@/components/lib/search/actions";
import AddressAvatar from "@/components/lib/address-avatar";

const Search = ({
  className,
  shortcut = false,
}: {
  className?: string;
  shortcut?: boolean;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [blockResult, setBlockResult] = useState<bigint | null>(null);
  const [addressResult, setAddressResult] = useState<Address | null>(null);
  const [transactionResult, setTransactionResult] = useState<Hash | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!shortcut) {
      return;
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        inputRef?.current?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [shortcut]);
  return (
    <div className={className}>
      <Command className="rounded-lg border" shouldFilter={false}>
        <CommandInput
          ref={inputRef}
          className={cn("h-10", { shortcut })}
          placeholder="Search by Address / Txn Hash / Block / Token"
          value={search}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
            }, 200);
          }}
          onValueChange={async (value) => {
            setSearch(value);
            setBlockResult(null);
            setAddressResult(null);
            setTransactionResult(null);
            if (Number.parseInt(value, 10) > 0) {
              const number = BigInt(value);
              const hasBlockResult = await searchBlock(number);
              setBlockResult(hasBlockResult ? number : null);
            } else if (isAddress(value)) {
              const address = getAddress(value);
              const hasAddressResult = await searchAddress(address);
              setAddressResult(hasAddressResult ? address : null);
            } else if (
              value.startsWith("0x") &&
              !Number.isNaN(Number.parseInt(value)) &&
              value.length === 66
            ) {
              const hash = value as Hash;
              const hasTransactionResult = await searchTransaction(hash);
              setTransactionResult(hasTransactionResult ? hash : null);
            }
          }}
        />
        {open && (
          <CommandList>
            {search.length > 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {blockResult && (
              <CommandGroup heading="Blocks">
                <CommandItem
                  className="cursor-pointer"
                  value={blockResult.toString()}
                  onSelect={() => router.push(`/block/${blockResult}`)}
                >
                  {blockResult.toString()}
                </CommandItem>
              </CommandGroup>
            )}
            {addressResult && (
              <CommandGroup heading="Addresses">
                <CommandItem
                  className="flex cursor-pointer items-center gap-2"
                  value={addressResult}
                  onSelect={() => router.push(`/address/${addressResult}`)}
                >
                  <AddressAvatar className="size-4" address={addressResult} />
                  {addressResult}
                </CommandItem>
              </CommandGroup>
            )}
            {transactionResult && (
              <CommandGroup heading="Transactions">
                <CommandItem
                  className="cursor-pointer"
                  value={transactionResult}
                  onSelect={() => router.push(`/tx/${transactionResult}`)}
                >
                  {transactionResult}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default Search;
