import { Address, formatUnits, Hash } from "viem";
import { fromPrismaErc20TransferWithToken, prisma } from "@/lib/prisma";
import { loadFunctions } from "@/lib/signatures";
import { fetchSpotPrices } from "@/lib/fetch-data";
import { formatPrice } from "@/lib/utils";

export type TokenTransfer = {
  transactionHash: Hash;
  selector: string;
  signature: string;
  blockNumber: bigint;
  timestamp: bigint;
  from: Address;
  to: Address;
  amount: string;
  usdValue: string;
  tokenAddress: Address;
};

export const fetchTokenTransfers = async (address: Address, page: number) => {
  const txsPerPage = Number(process.env.NEXT_PUBLIC_TXS_PER_PAGE);
  const where = {
    OR: [{ from: address }, { to: address }],
  };
  const [prismaErc20Transfers, totalCount, prices] = await Promise.all([
    prisma.erc20Transfer.findMany({
      where,
      orderBy: [
        { blockNumber: "desc" },
        { transactionIndex: "desc" },
        { logIndex: "desc" },
      ],
      take: txsPerPage,
      skip: (page - 1) * txsPerPage,
      include: {
        token: true,
        transaction: true,
      },
    }),
    prisma.erc20Transfer.count({ where }),
    fetchSpotPrices(),
  ]);
  const signatures = await Promise.all(
    prismaErc20Transfers.map(({ transaction }) =>
      loadFunctions(transaction.input.slice(0, 10)),
    ),
  );
  return {
    tokenTransfers: prismaErc20Transfers.map((prismaErc20Transfer, index) => {
      const erc20Transfer =
        fromPrismaErc20TransferWithToken(prismaErc20Transfer);
      const amount = formatUnits(
        erc20Transfer.value,
        erc20Transfer.token.decimals,
      );
      const price = prices[erc20Transfer.token.symbol] ?? 0;
      return {
        transactionHash: erc20Transfer.transactionHash,
        selector: prismaErc20Transfer.transaction.input.slice(0, 10),
        signature: signatures[index] ?? "",
        blockNumber: erc20Transfer.blockNumber,
        timestamp: prismaErc20Transfer.transaction.timestamp,
        from: erc20Transfer.from,
        to: erc20Transfer.to,
        amount,
        usdValue: formatPrice(Number(amount) * price),
        tokenAddress: erc20Transfer.address,
      };
    }),
    totalCount,
  };
};
