import { NextResponse } from "next/server";
// import { range } from "lodash";
import {
  fetchL2BlockNumberFromJsonRpc,
  fetchL2BlockNumberFromDatabase,
  fetchL1BlockNumberFromJsonRpc,
  fetchL1BlockNumberFromDatabase,
} from "@/lib/fetch-data";
import { indexL1Block, indexL2Block } from "@/lib/indexer";

export const GET = async () => {
  const [
    l2BlockNumberFromJsonRpc,
    l2BlockNumberFromDatabase,
    l1BlockNumberFromJsonRpc,
    l1BlockNumberFromDatabase,
  ] = await Promise.all([
    fetchL2BlockNumberFromJsonRpc(),
    fetchL2BlockNumberFromDatabase(),
    fetchL1BlockNumberFromJsonRpc(),
    fetchL1BlockNumberFromDatabase(),
  ]);
  const l2BlocksIndexed: number[] = [];
  const l1BlocksIndexed: number[] = [];
  try {
    for (
      let blockNumber = l2BlockNumberFromDatabase + BigInt(1);
      blockNumber <= l2BlockNumberFromJsonRpc;
      ++blockNumber
    ) {
      await indexL2Block(blockNumber);
      l2BlocksIndexed.push(Number(blockNumber));
    }
    for (
      let blockNumber = l1BlockNumberFromDatabase + BigInt(1);
      blockNumber <= l1BlockNumberFromJsonRpc;
      ++blockNumber
    ) {
      await indexL1Block(blockNumber);
      l1BlocksIndexed.push(Number(blockNumber));
    }
    /* await Promise.all([
      Promise.all(
        range(
          Number(l2BlockNumberFromDatabase) + 1,
          Number(l2BlockNumberFromJsonRpc) + 1,
        ).map(async (blockNumber) => {
          await indexL2Block(BigInt(blockNumber));
          l2BlocksIndexed.push(blockNumber);
        }),
      ),
      Promise.all(
        range(
          Number(l1BlockNumberFromDatabase) + 1,
          Number(l1BlockNumberFromJsonRpc) + 1,
        ).map(async (blockNumber) => {
          await indexL1Block(BigInt(blockNumber));
          l1BlocksIndexed.push(blockNumber);
        }),
      ),
    ]); */
    return NextResponse.json({
      ok: true,
      l2BlockNumberFromJsonRpc: l2BlockNumberFromJsonRpc.toString(),
      l2BlockNumberFromDatabase: l2BlockNumberFromDatabase.toString(),
      l2BlocksIndexed: l2BlocksIndexed.sort(),
      l1BlockNumberFromJsonRpc: l1BlockNumberFromJsonRpc.toString(),
      l1BlockNumberFromDatabase: l1BlockNumberFromDatabase.toString(),
      l1BlocksIndexed: l1BlocksIndexed.sort(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      l2BlockNumberFromJsonRpc: l2BlockNumberFromJsonRpc.toString(),
      l2BlockNumberFromDatabase: l2BlockNumberFromDatabase.toString(),
      l2BlocksIndexed: l2BlocksIndexed.sort(),
      l1BlockNumberFromJsonRpc: l1BlockNumberFromJsonRpc.toString(),
      l1BlockNumberFromDatabase: l1BlockNumberFromDatabase.toString(),
      l1BlocksIndexed: l1BlocksIndexed.sort(),
    });
  }
};
