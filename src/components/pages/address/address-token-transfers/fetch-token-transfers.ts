import { type Address, formatUnits, type Hash } from "viem";
import { fromPrismaErc20TransferWithToken, prisma } from "@/lib/prisma";
import { txsPerPage } from "@/lib/constants";
import { loadFunctions } from "@/lib/signatures";
import { fetchSpotPrices } from "@/lib/fetch-data";
import { formatPrice } from "@/lib/utils";
import { l2Chain } from "@/lib/chains";
import fetchAccount from "@/lib/fetch-account";

export type TokenTransfer = {
  transactionHash: Hash;
  selector: string;
  signature: string;
  blockNumber: bigint;
  logIndex: number;
  timestamp: bigint;
  from: Address;
  to: Address;
  amount: string;
  destination: number | null;
  source: number | null;
  usdValue: string;
  tokenAddress: Address;
};

export const fetchTokenTransfers = async (address: Address, page: number) => {
  const where = {
    OR: [{ from: address }, { to: address }],
    chainId: l2Chain.id,
  };
  const [prismaErc20Transfers, totalCount, prices, account] = await Promise.all(
    [
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
          receipt: { include: { transaction: true } },
        },
      }),
      prisma.erc20Transfer.count({ where }),
      fetchSpotPrices(),
      fetchAccount(address),
    ],
  );
  const signatures = await Promise.all(
    prismaErc20Transfers.map(({ receipt }) =>
      loadFunctions(receipt.transaction.input.slice(0, 10)),
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
        selector: prismaErc20Transfer.receipt.transaction.input.slice(0, 10),
        signature: signatures[index] ?? "",
        blockNumber: erc20Transfer.blockNumber,
        logIndex: erc20Transfer.logIndex,
        timestamp: prismaErc20Transfer.receipt.transaction.timestamp,
        from: erc20Transfer.from,
        to: erc20Transfer.to,
        amount,
        destination: erc20Transfer.destination,
        source: erc20Transfer.source,
        usdValue: formatPrice(Number(amount) * price),
        tokenAddress: erc20Transfer.address,
      };
    }),
    totalCount,
    account,
  };
};
