import { type Address, formatUnits } from "viem";
import {
  prisma,
  fromPrismaErc20TransferWithToken,
  fromPrismaNftTransferWithToken,
} from "@/lib/prisma";
import getErc20Contract from "@/lib/contracts/erc-20/contract";
import getErc721Contract from "@/lib/contracts/erc-721/contract";
import getErc1155Contract from "@/lib/contracts/erc-1155/contract";
import { fetchSpotPrices } from "@/lib/fetch-data";
import { l2Chain } from "@/lib/chains";

export type Erc20TokenHolding = {
  address: Address;
  name: string;
  symbol: string;
  price: number;
  amount: string;
};

export type Erc721TokenHolding = {
  address: Address;
  name: string;
  symbol: string;
  amount: bigint;
};

export type Erc1155TokenHolding = {
  address: Address;
  tokenIds: { id: bigint; amount: bigint }[];
};

export type TokenHoldings = {
  erc20: Erc20TokenHolding[];
  erc721: Erc721TokenHolding[];
  erc1155: Erc1155TokenHolding[];
};

export const fetchTokenHoldings = async (
  address: Address,
): Promise<TokenHoldings> => {
  const [erc20Transfers, erc721Transfers, erc1155Transfers, prices] =
    await Promise.all([
      prisma.erc20Transfer.findMany({
        where: { to: address, chainId: l2Chain.id },
        distinct: ["address"],
        include: { token: true },
      }),
      prisma.nftTransfer.findMany({
        where: {
          to: address,
          erc721Token: { isNot: null },
          chainId: l2Chain.id,
        },
        distinct: ["address"],
        include: { erc721Token: true, erc1155Token: true },
      }),
      prisma.nftTransfer.findMany({
        where: {
          to: address,
          erc1155Token: { isNot: null },
          chainId: l2Chain.id,
        },
        distinct: ["address"],
        include: { erc721Token: true, erc1155Token: true },
      }),
      fetchSpotPrices(),
    ]);
  // Group ERC1155 transfers by address
  const erc1155TransfersGrouped = erc1155Transfers
    .map(fromPrismaNftTransferWithToken)
    .reduce<Record<Address, Set<bigint>>>((previousValue, nftTransfer) => {
      const tokenIds = previousValue[nftTransfer.address];
      if (tokenIds) {
        tokenIds.add(nftTransfer.tokenId);
      } else {
        previousValue[nftTransfer.address] = new Set<bigint>([
          nftTransfer.tokenId,
        ]);
      }
      return previousValue;
    }, {});
  const [erc20Holdings, erc721Holdings, erc1155Holdings] = await Promise.all([
    Promise.all(
      erc20Transfers
        .map(fromPrismaErc20TransferWithToken)
        .map(async (erc20Transfer) => {
          const contract = getErc20Contract(erc20Transfer.address);
          const amount = await contract.read.balanceOf([address]);
          return {
            address: erc20Transfer.address,
            name: erc20Transfer.token.name,
            symbol: erc20Transfer.token.symbol,
            price: prices[erc20Transfer.token.symbol] ?? 0,
            amount: formatUnits(amount, erc20Transfer.token.decimals),
          };
        }),
    ),
    Promise.all(
      erc721Transfers
        .map(fromPrismaNftTransferWithToken)
        .map(async (erc721Transfer) => {
          const contract = getErc721Contract(erc721Transfer.address);
          const amount = await contract.read.balanceOf([address]);
          return {
            address: erc721Transfer.address,
            name: erc721Transfer.erc721Token
              ? erc721Transfer.erc721Token.name
              : "",
            symbol: erc721Transfer.erc721Token
              ? erc721Transfer.erc721Token.symbol
              : "",
            amount,
          };
        }),
    ),
    Promise.all(
      Object.entries(erc1155TransfersGrouped).map(
        async ([tokenAddress, tokenIds]) => {
          const contract = getErc1155Contract(tokenAddress as Address);
          const tokenHoldings = await Promise.all(
            Array.from(tokenIds).map(async (id) => {
              const amount = await contract.read.balanceOf([address, id]);
              return { id, amount };
            }),
          );
          return {
            address: tokenAddress as Address,
            tokenIds: tokenHoldings.filter(({ amount }) => amount > BigInt(0)),
          };
        },
      ),
    ),
  ]);
  return {
    erc20: erc20Holdings,
    erc721: erc721Holdings,
    erc1155: erc1155Holdings,
  };
};
