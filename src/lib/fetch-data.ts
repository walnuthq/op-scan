import { Address, formatUnits, Hash } from "viem";
import {
  extractTransactionDepositedLogs,
  getL2TransactionHash,
} from "viem/op-stack";
import { TransactionEnqueued } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import portal from "@/lib/contracts/portal/contract";
import l1CrossDomainMessenger from "@/lib/contracts/l1-cross-domain-messenger/contract";
import getERC721Contract from "@/lib/contracts/erc-721/contract";
import getERC1155Contract from "@/lib/contracts/erc-1155/contract";
import {
  formatTimestamp,
  convertIpfsToHttp,
  NftPlaceholderImage,
} from "@/lib/utils";

const fetchL2BlockNumberFromJsonRpc = () => l2PublicClient.getBlockNumber();

const fetchL2BlockNumberFromDatabase = async () => {
  const {
    _max: { number: latestBlockNumber },
  } = await prisma.block.aggregate({
    _max: { number: true },
  });
  return latestBlockNumber ?? fetchL2BlockNumberFromJsonRpc();
};

export const fetchL2BlockNumber = process.env.DATABASE_URL
  ? fetchL2BlockNumberFromDatabase
  : fetchL2BlockNumberFromJsonRpc;

export const fetchLatestTransactionsEnqueued = async (
  start: bigint,
  hash: Hash,
  latest: bigint,
): Promise<{
  transactionsEnqueued: TransactionEnqueued[];
  previousStart?: bigint;
  previousHash?: Hash;
  nextStart?: bigint;
  nextHash?: Hash;
}> => {
  const l1BlocksPerTxsEnqueued = BigInt(250);
  const txsEnqueuedPerPage = BigInt(
    process.env.NEXT_PUBLIC_TXS_ENQUEUED_PER_PAGE,
  );
  const l1FromBlock = start - l1BlocksPerTxsEnqueued * txsEnqueuedPerPage;
  const [transactionDepositedLogs, sentMessageLogs] = await Promise.all([
    portal.getEvents.TransactionDeposited(undefined, {
      fromBlock: l1FromBlock,
    }),
    l1CrossDomainMessenger.getEvents.SentMessage(undefined, {
      fromBlock: l1FromBlock,
    }),
  ]);
  const transactionsEnqueued = await Promise.all(
    extractTransactionDepositedLogs({ logs: transactionDepositedLogs }).map(
      async (transactionDepositedLog, index) => {
        const sentMessageLog = sentMessageLogs[index];
        if (!sentMessageLog || !sentMessageLog.args.gasLimit) {
          return null;
        }
        const { timestamp } = await l1PublicClient.getBlock({
          blockNumber: transactionDepositedLog.blockNumber,
        });
        return {
          l1BlockNumber: transactionDepositedLog.blockNumber,
          l2TxHash: getL2TransactionHash({ log: transactionDepositedLog }),
          l1TxHash: transactionDepositedLog.transactionHash,
          timestamp,
          l1TxOrigin: transactionDepositedLog.args.from,
          gasLimit: sentMessageLog.args.gasLimit,
        };
      },
    ),
  );
  return {
    transactionsEnqueued: transactionsEnqueued
      .filter((transactionEnqueud) => transactionEnqueud !== null)
      .reverse()
      .slice(0, Number(txsEnqueuedPerPage)),
    previousStart: BigInt(0),
    previousHash: "0x",
    nextStart: BigInt(0),
    nextHash: "0x",
  };
};

const fetchNFTMetadata = async (
  contractAddress: Address,
  tokenId: string,
  type: "ERC721" | "ERC1155",
) => {
  let name = "NFT: Event#0";
  let symbol = "NFT: Event";
  let image = NftPlaceholderImage;
  let tokenURI = "";

  try {
    const tokenIdBigInt = BigInt(tokenId);

    if (type === "ERC721") {
      const contract = getERC721Contract(contractAddress);

      name = await contract.read.name();
      symbol = await contract.read.symbol();
      tokenURI = await contract.read.tokenURI([tokenIdBigInt]);
    } else {
      const contract = getERC1155Contract(contractAddress);

      tokenURI = await contract.read.uri([tokenIdBigInt]);
      name = await contract.read.name();
      symbol = await contract.read.symbol();
    }

    if (tokenURI.startsWith("https")) {
      const response = await fetch(tokenURI);

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.startsWith("application/json")) {
          const result = await response.json();
          if (result.image) image = result.image;
          else
            console.log(
              `Could not find image in token uri "${tokenURI}" JSON response of address "${contractAddress}": ${result}`,
            );
        } else if (contentType && contentType.startsWith("image"))
          image = response.url;
        else
          console.log(
            `failed to recognise content type "${contentType}" for token uri "${tokenURI}" of address "${contractAddress}"`,
          );
      } else
        console.log(
          `failed to fetch data for token uri "${tokenURI}" of address "${contractAddress}". ${response.statusText}`,
        );
    } else if (tokenURI.startsWith("ipfs")) {
      let processedUri = convertIpfsToHttp(tokenURI);

      if (processedUri.includes("{id}"))
        processedUri = processedUri.replace("{id}", tokenIdBigInt.toString());

      const response = await fetch(processedUri);

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.startsWith("application/json")) {
          const result = await response.json();
          if (result.image) {
            let imageUrl = result.image;

            image = imageUrl.startsWith("ipfs://")
              ? convertIpfsToHttp(imageUrl)
              : imageUrl;
          } else
            console.log(
              `Could not find image in token uri "${tokenURI}" JSON response of address "${contractAddress}": ${result}`,
            );
        } else if (contentType && contentType.startsWith("image"))
          image = processedUri;
      } else
        console.log(
          `failed to fetch data for token uri "${tokenURI}" of address "${contractAddress}". ${response.statusText}`,
        );
    } else
      console.log(
        `token uri "${tokenURI}" not recognised for address "${contractAddress}"`,
      );

    return {
      name,
      tokenId: BigInt(tokenId).toString(),
      contractAddress,
      symbol,
      image,
    };
  } catch (e) {
    return {
      name,
      tokenId: BigInt(tokenId).toString(),
      contractAddress,
      symbol,
      image,
    };
  }
};

export async function getLatestNftTransferEvents(
  contractAddress: Address,
  page: number = 1,
  limit: number = 25,
) {
  const skip = (page - 1) * limit;

  try {
    const [erc721Transfers, erc1155Transfers] = await Promise.all([
      prisma.erc721Transfer.findMany({
        where: {
          OR: [{ to: contractAddress }, { from: contractAddress }],
        },
        orderBy: { transactionHash: "desc" },
        take: limit,
        skip: skip,
        include: {
          receipt: {
            include: {
              transaction: {
                include: {
                  block: true,
                },
              },
            },
          },
        },
      }),
      prisma.erc1155Transfer.findMany({
        where: {
          OR: [{ to: contractAddress }, { from: contractAddress }],
        },
        orderBy: { transactionHash: "desc" },
        take: limit,
        skip: skip,
        include: {
          receipt: {
            include: {
              transaction: {
                include: {
                  block: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const mapTransfer = async (t: any, type: "ERC721" | "ERC1155") => {
      const transactionDate = new Date(
        Number(t.receipt.transaction.block.timestamp) * 1000,
      );

      const metadata = await fetchNFTMetadata(
        t.address,
        type === "ERC721" ? t.tokenId : t.id,
        type,
      );

      return {
        transactionHash: t.transactionHash,
        method: t.receipt.transaction.input.slice(0, 10),
        block: Number(t.receipt.transaction.blockNumber),
        age: transactionDate,
        from: t.from,
        to: t.to,
        type,
        metadata,
      };
    };

    const allTransfers = await Promise.all([
      ...erc721Transfers.map((t) => mapTransfer(t, "ERC721")),
      ...erc1155Transfers.map((t) => mapTransfer(t, "ERC1155")),
    ]);

    const sortedTransfers = allTransfers
      .sort((a, b) => b.block - a.block)
      .slice(0, limit);

    return {
      transfers: sortedTransfers,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching token transfers:", error);
    throw error;
  }
}

export async function getLatestTransferEvents(
  contractAddress: Address,
  page: number = 1,
  limit: number = 100,
) {
  console.log(contractAddress);
  const skip = (page - 1) * limit;

  try {
    const erc20Transfers = await prisma.erc20Transfer.findMany({
      where: {
        OR: [{ from: contractAddress }, { to: contractAddress }],
      },
      orderBy: { transactionHash: "desc" },
      take: limit,
      skip: skip,
      include: {
        receipt: {
          include: {
            transaction: {
              include: {
                block: true,
              },
            },
          },
        },
      },
    });

    const allTransfers = await Promise.all(
      erc20Transfers.map(async (t) => {
        return {
          transactionHash: t.transactionHash,
          method: t.receipt.transaction.input.slice(0, 10),
          block: Number(t.receipt.transaction.blockNumber),
          age: formatTimestamp(t.receipt.transaction.block.timestamp).distance,
          from: t.from,
          to: t.to,
          amount: formatUnits(BigInt(t.value), t.decimals),
          token: {
            address: t.address,
            decimals: t.decimals,
          },
          type: "ERC20" as const,
        };
      }),
    );

    return {
      transfers: allTransfers,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching token transfers:", error);
    throw error;
  }
}

type GetSpotPriceResponse = {
  data: { amount: string; base: string; currency: string };
};

export const fetchTokenPrice = async (symbol: string): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`,
    );

    if (!response.ok) {
      return 0; // Return 0 if we can't get the price
    }

    const json = await response.json();
    const { data } = json as GetSpotPriceResponse;
    return Number(data.amount);
  } catch (error) {
    return 0; // Return 0 if there's an error
  }
};

type GetSpotPriceResult = Record<string, number>;

export const fetchSpotPrices = async (date?: string) => {
  const url = date
    ? `https://api.coinbase.com/v2/prices/USD/spot?date=${date}`
    : "https://api.coinbase.com/v2/prices/USD/spot";
  const response = await fetch(url, {
    cache: date ? "force-cache" : "no-store",
  });
  const json = await response.json();
  const { data } = json as {
    data: {
      amount: string;
      base: string;
      currency: "USD";
    }[];
  };
  return data.reduce<GetSpotPriceResult>(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue.base]: Number(currentValue.amount),
    }),
    {},
  );
};
