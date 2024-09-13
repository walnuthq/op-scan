"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Address } from "viem";
import { TokenHoldings } from "@/components/pages/address/address-details/fetch-token-holdings";

type TokenDetails = {
  type: "ERC-20" | "ERC-721" | "ERC-1155";
  address: Address;
  name: string;
  symbol: string;
  amount: string;
  price: number;
};

const Erc20CommandItem = ({
  token,
  setOpen,
}: {
  token: TokenDetails;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const tokenUSDValue = Number(token.amount) * token.price;
  return (
    <CommandItem
      className="cursor-pointer"
      value={token.address}
      onSelect={() => {
        router.push(`/address/${token.address}`);
        setOpen(false);
      }}
    >
      <div className="flex w-full justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-sm font-semibold">
            {token.name} <span>({token.symbol})</span>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {token.amount}
          </p>
        </div>
        <div className="min-w-24">
          {token.price > 0 && (
            <div className="flex flex-col gap-1 text-right">
              <p className="text-sm font-semibold">
                ${tokenUSDValue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                @{token.price.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </CommandItem>
  );
};

const NFTCommandItem = ({
  token,
  setOpen,
}: {
  token: TokenDetails;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  return (
    <CommandItem
      className="cursor-pointer"
      key={token.address}
      value={token.address}
      onSelect={() => {
        router.push(`/address/${token.address}`);
        setOpen(false);
      }}
    >
      <div className="flex w-full justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-sm font-semibold">{token.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {token.symbol}
          </p>
        </div>
        <div className="min-w-24">
          <div className="flex flex-col gap-1 text-right">
            <p className="text-xs text-muted-foreground">{token.type}</p>
            <p className="text-xs text-muted-foreground">x{token.amount}</p>
          </div>
        </div>
      </div>
    </CommandItem>
  );
};

const AddressTokenHoldings = ({
  tokenHoldings: { erc20, erc721, erc1155 },
}: {
  tokenHoldings: TokenHoldings;
}) => {
  const [open, setOpen] = useState(false);
  // Process ERC20 tokens
  const erc20Tokens = erc20.map((token) => ({
    type: "ERC-20" as const,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    amount: token.amount,
    price: token.price,
  }));
  // Process ERC721 tokens
  const erc721Tokens = erc721.map((token) => ({
    type: "ERC-721" as const,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    amount: token.amount.toString(),
    price: 0, // NFTs don't have a standard USD value
  }));
  // Process ERC1155 tokens
  const erc1155Tokens = erc1155.flatMap((token) =>
    token.tokenIds.map((tokenId) => ({
      type: "ERC-1155" as const,
      address: token.address,
      name: `ERC1155 Token (ID: ${tokenId.id})`,
      symbol: "ERC1155",
      amount: tokenId.amount.toString(),
      price: 0, // ERC1155 tokens don't have a standard USD value
    })),
  );
  const nftTokens = [...erc721Tokens, ...erc1155Tokens];
  // Calculate total USD value and token count
  const totalUSDValue = erc20Tokens.reduce(
    (sum, token) => sum + Number(token.amount) * token.price,
    0,
  );
  const tokensCount = erc20Tokens.length + nftTokens.length;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-baseline gap-1">
            ${totalUSDValue.toFixed(2)}
            <span className="text-xs text-muted-foreground">
              ({tokensCount} Token{tokensCount === 1 ? "" : "s"})
            </span>
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 px-2" align="start">
        <Command>
          <CommandInput placeholder="Search for Token Name" />
          <CommandEmpty>No Tokens found</CommandEmpty>
          <CommandList>
            {erc20Tokens.length > 0 && (
              <CommandGroup heading={`ERC-20 Tokens (${erc20Tokens.length})`}>
                {erc20Tokens.map((token) => (
                  <Erc20CommandItem
                    key={token.address}
                    token={token}
                    setOpen={setOpen}
                  />
                ))}
              </CommandGroup>
            )}
            {nftTokens.length > 0 && (
              <CommandGroup heading={`NFT Tokens (${nftTokens.length})`}>
                {nftTokens.map((token) => (
                  <NFTCommandItem
                    key={token.address}
                    token={token}
                    setOpen={setOpen}
                  />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AddressTokenHoldings;
