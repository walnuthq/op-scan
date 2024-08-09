import getERC1155Contract from "@/lib/contracts/erc-1155/contract";
import getERC20Contract from "@/lib/contracts/erc-20/contract";
import getERC721Contract from "@/lib/contracts/erc-721/contract";
import { fetchTokenPrice } from "@/lib/fetch-data";
import { prisma } from "@/lib/prisma";
import { Address } from "viem";

export type ERC20TokenHolding = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  usd_value: number;
  amount: bigint;
};

export type ERC721TokenHolding = {
  address: Address;
  name: string;
  symbol: string;
  amount: bigint;
};

export type ERC1155TokenHolding = {
  address: Address;
  tokenIds: { id: string; amount: bigint }[];
};

export type TokenHoldings = {
  ERC20: ERC20TokenHolding[];
  ERC721: ERC721TokenHolding[];
  ERC1155: ERC1155TokenHolding[];
};

export const fetchTokenHoldings = async (
  contractAddress: Address,
): Promise<TokenHoldings> => {
  const [erc20Tokens, erc721Tokens, erc1155Transfers] = await Promise.all([
    prisma.erc20Transfer.findMany({
      where: {
        to: contractAddress,
      },
      distinct: ["address"],
      select: {
        address: true,
        name: true,
        symbol: true,
        decimals: true,
      },
    }),
    prisma.erc721Transfer.findMany({
      where: {
        to: contractAddress,
      },
      distinct: ["address"],
      select: {
        name: true,
        symbol: true,
        address: true,
      },
    }),
    prisma.erc1155Transfer.findMany({
      where: {
        to: contractAddress,
      },
      select: {
        address: true,
        id: true,
      },
    }),
  ]);

  const erc20Holdings = await Promise.all(
    erc20Tokens.map(async (token) => {
      const contract = getERC20Contract(token.address as Address);
      const amount = await contract.read.balanceOf([contractAddress]);
      const usd_value = await fetchTokenPrice(token.symbol);

      return {
        address: token.address as Address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        usd_value,
        amount: BigInt(amount),
      };
    }),
  );

  const erc721Holdings = await Promise.all(
    erc721Tokens.map(async (token) => {
      const contract = getERC721Contract(token.address as Address);
      const amount = await contract.read.balanceOf([contractAddress]);

      return {
        address: token.address as Address,
        name: token.name,
        symbol: token.symbol,
        amount: BigInt(amount),
      };
    }),
  );

  // Group ERC1155 transfers by address
  const erc1155TokensGrouped = erc1155Transfers.reduce(
    (acc, transfer) => {
      if (!acc[transfer.address]) {
        acc[transfer.address] = new Set();
      }
      acc[transfer.address].add(transfer.id);
      return acc;
    },
    {} as Record<string, Set<string>>,
  );

  const erc1155Holdings = await Promise.all(
    Object.entries(erc1155TokensGrouped).map(async ([address, tokenIds]) => {
      const contract = getERC1155Contract(address as Address);
      const tokenHoldings = await Promise.all(
        Array.from(tokenIds).map(async (id) => {
          const amount = await contract.read.balanceOf([
            contractAddress,
            BigInt(id),
          ]);
          return { id, amount: BigInt(amount) };
        }),
      );

      return {
        address: address as Address,
        tokenIds: tokenHoldings.filter((holding) => holding.amount > BigInt(0)),
      };
    }),
  );

  return {
    ERC20: erc20Holdings,
    ERC721: erc721Holdings,
    ERC1155: erc1155Holdings,
  };
};
