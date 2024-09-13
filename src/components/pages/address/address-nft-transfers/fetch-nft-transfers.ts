import { Address, Hash } from "viem";
import { NFTMetadata, NftTransferWithToken } from "@/lib/types";
import { prisma, fromPrismaNftTransferWithToken } from "@/lib/prisma";
import { loadFunctions } from "@/lib/signatures";
import getErc721Contract from "@/lib/contracts/erc-721/contract";
import getErc1155Contract from "@/lib/contracts/erc-1155/contract";

export type NftTransfer = {
  transactionHash: Hash;
  selector: string;
  signature: string;
  blockNumber: bigint;
  timestamp: bigint;
  from: Address;
  to: Address;
  type: "ERC-721" | "ERC-1155";
  metadata: NFTMetadata;
};

const ipfsToHttps = (uri: string) => {
  const { protocol, pathname } = new URL(uri);
  return protocol === "ipfs:"
    ? `https://ipfs.io/ipfs/${pathname.slice(2)}`
    : uri;
};

const substituteId = (tokenUri: string, tokenId: bigint) =>
  tokenUri.replace("{id}", tokenId.toString().padStart(64, "0"));

const processUri = (tokenUri: string, tokenId: bigint) =>
  substituteId(ipfsToHttps(tokenUri), tokenId);

const getTokenUri = (nftTransfer: NftTransferWithToken) => {
  if (nftTransfer.erc721Token) {
    const contract = getErc721Contract(nftTransfer.address);
    return contract.read.tokenURI([nftTransfer.tokenId]);
  } else {
    const contract = getErc1155Contract(nftTransfer.address);
    return contract.read.uri([nftTransfer.tokenId]);
  }
};

type JSONMetadata = { name: string; image: string; image_data: string };

const parseTokenMetadata = (
  { name, image, image_data: imageData }: JSONMetadata,
  tokenId: bigint,
) => {
  return imageData
    ? { name, imageUrl: imageData }
    : { name, imageUrl: processUri(image, tokenId) };
};

const getTokenMetadata = async (tokenUri: string, tokenId: bigint) => {
  try {
    if (tokenUri.startsWith("data:application/json;")) {
      const [, base64] = tokenUri.split(",");
      const json = JSON.parse(Buffer.from(base64, "base64").toString());
      return parseTokenMetadata(json, tokenId);
    }
    if (tokenUri.startsWith("data:image/")) {
      return { name: "NFT", imageUrl: tokenUri };
    }
    const tokenUriProcessed = processUri(tokenUri, tokenId);
    const response = await fetch(tokenUriProcessed);
    if (!response.ok) {
      return { name: "NFT", imageUrl: "" };
    }
    const contentType = response.headers.get("content-type");
    if (contentType === "application/json") {
      const json = await response.json();
      return parseTokenMetadata(json, tokenId);
    }
    return { name: "", imageUrl: tokenUriProcessed };
  } catch (error) {
    console.error(error);
    return { name: "NFT", imageUrl: "" };
  }
};

const fetchNFTMetadata = async (nftTransfer: NftTransferWithToken) => {
  const tokenUri = await getTokenUri(nftTransfer);
  const { name, imageUrl } = await getTokenMetadata(
    tokenUri,
    nftTransfer.tokenId,
  );
  return {
    address: nftTransfer.address,
    name: nftTransfer.erc721Token ? nftTransfer.erc721Token.name : name,
    symbol: nftTransfer.erc721Token
      ? nftTransfer.erc721Token.symbol
      : "ERC-1155",
    tokenId: nftTransfer.tokenId,
    imageUrl,
  };
};

export const fetchNftTransfers = async (address: Address, page: number) => {
  const txsPerPage = Number(process.env.NEXT_PUBLIC_TXS_PER_PAGE);
  const where = { OR: [{ to: address }, { from: address }] };
  const [prismaNftTransfers, totalCount] = await Promise.all([
    prisma.nftTransfer.findMany({
      where,
      orderBy: [
        { blockNumber: "desc" as const },
        { transactionIndex: "desc" as const },
        { logIndex: "desc" as const },
      ],
      take: txsPerPage,
      skip: (page - 1) * txsPerPage,
      include: { transaction: true, erc721Token: true, erc1155Token: true },
    }),
    prisma.nftTransfer.count({ where }),
  ]);
  const nftTransfers = await Promise.all(
    prismaNftTransfers.map(async (prismaNftTransfer) => {
      const nftTransfer = fromPrismaNftTransferWithToken(prismaNftTransfer);
      const selector = prismaNftTransfer.transaction.input.slice(0, 10);
      const [signature, metadata] = await Promise.all([
        loadFunctions(selector),
        fetchNFTMetadata(nftTransfer),
      ]);
      return {
        transactionHash: nftTransfer.transactionHash,
        selector,
        signature,
        blockNumber: nftTransfer.blockNumber,
        timestamp: prismaNftTransfer.transaction.timestamp,
        from: nftTransfer.from,
        to: nftTransfer.to,
        type: "ERC-721" as const,
        metadata,
      };
    }),
  );
  return {
    nftTransfers,
    totalCount,
  };
};
