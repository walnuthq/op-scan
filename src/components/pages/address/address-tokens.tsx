"use client";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

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
import { Address, formatUnits } from "viem";
import { TokenHoldings } from "./fetch-token-holdings";

type TokenDetails = {
  type: "ERC20" | "ERC721" | "ERC1155";
  symbol: string;
  name: string;
  amount: bigint;
  usd_value: number;
  address: Address;
  decimals: number;
};

type Props = {
  tokenHoldings: TokenHoldings;
};

const AddressTokenHoldings = ({ tokenHoldings }: Props) => {
  const [open, setOpen] = React.useState(false);

  function handleTokenClick(token: TokenDetails) {
    // Do Something
    setOpen(false);
  }

  // Process ERC20 tokens
  const erc20Tokens: TokenDetails[] = tokenHoldings.ERC20.map((token) => ({
    type: "ERC20",
    symbol: token.symbol,
    name: token.name,
    amount: token.amount,
    usd_value: token.usd_value,
    address: token.address,
    decimals: token.decimals,
  }));

  // Process ERC721 tokens
  const erc721Tokens: TokenDetails[] = tokenHoldings.ERC721.map((token) => ({
    type: "ERC721",
    symbol: token.symbol,
    name: token.name,
    amount: token.amount,
    usd_value: 0, // NFTs don't have a standard USD value
    address: token.address,
    decimals: 0,
  }));

  // Process ERC1155 tokens
  const erc1155Tokens: TokenDetails[] = tokenHoldings.ERC1155.flatMap((token) =>
    token.tokenIds.map((tokenId) => ({
      type: "ERC1155",
      symbol: "ERC1155",
      name: `ERC1155 Token (ID: ${tokenId.id})`,
      amount: tokenId.amount,
      usd_value: 0, // ERC1155 tokens don't have a standard USD value
      address: token.address,
      decimals: 0,
    })),
  );

  const nftTokens = [...erc721Tokens, ...erc1155Tokens];

  // Calculate total USD value and token count
  const totalUsdValue = erc20Tokens.reduce(
    (sum, token) =>
      sum + Number(formatUnits(token.amount, token.decimals)) * token.usd_value,
    0,
  );
  const totalTokenCount = erc20Tokens.length + nftTokens.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span>
            ${totalUsdValue.toFixed(2)}{" "}
            <span className="text-xs text-muted-foreground">
              ({totalTokenCount} Tokens)
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 px-2" align="start">
        <Command>
          <CommandInput placeholder="Search Tokens..." />
          <CommandEmpty>No Tokens found</CommandEmpty>
          <CommandList>
            {erc20Tokens.length > 0 && (
              <CommandGroup heading="ERC-20 Tokens">
                {erc20Tokens.map((token) => {
                  const total_units = formatUnits(token.amount, token.decimals);
                  const total_usd_value = Number(total_units) * token.usd_value;
                  return (
                    <CommandItem
                      className="cursor-pointer"
                      key={token.address}
                      value={token.name + token.symbol + token.address}
                      onSelect={() => {
                        handleTokenClick(token);
                      }}
                    >
                      <div className="flex w-full justify-between gap-4">
                        <div className="flex min-w-0 flex-col gap-1">
                          <p className="truncate text-sm font-semibold">
                            {token.name} <span>({token.symbol})</span>
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {total_units}
                          </p>
                        </div>
                        <div className="min-w-24">
                          {token.usd_value > 0 && (
                            <div className="flex flex-col gap-1 text-right">
                              <p
                                className="text-sm font-semibold"
                                title={`$${total_usd_value}`}
                              >
                                ${total_usd_value.toFixed(2)}
                              </p>
                              <p
                                title={token.usd_value.toString()}
                                className="text-xs text-muted-foreground"
                              >
                                @{token.usd_value.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {nftTokens.length > 0 && (
              <CommandGroup heading="NFT Tokens">
                {nftTokens.map((token) => (
                  <CommandItem
                    className="cursor-pointer"
                    key={token.address}
                    value={token.name + token.symbol + token.address}
                    onSelect={() => {
                      handleTokenClick(token);
                    }}
                  >
                    <div className="flex w-full justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-1">
                        <p className="truncate text-sm font-semibold">
                          {token.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {token.symbol}
                        </p>
                      </div>
                      <div className="min-w-24">
                        <div className="flex flex-col gap-1 text-right">
                          <p className="text-xs text-muted-foreground">
                            {token.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            x{token.amount.toString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CommandItem>
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
